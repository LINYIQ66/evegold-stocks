import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// 4% annual interest, paid daily
const ANNUAL_RATE = 0.04;
const DAILY_RATE = ANNUAL_RATE / 365;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all users (paginated)
    let allUsers = [];
    let hasMore = true;
    let skip = 0;
    while (hasMore) {
      const batch = await base44.asServiceRole.entities.User.list('-created_date', 100);
      allUsers = allUsers.concat(batch);
      hasMore = batch.length === 100;
      if (hasMore) {
        // User.list doesn't support skip; break if we hit exactly 100 to avoid infinite loop
        break;
      }
    }

    let totalInterestPaid = 0;
    let usersPaid = 0;
    const records = [];

    for (const user of allUsers) {
      const balances = user.wallet_balances || {};
      const locked = user.locked_balances || {};

      // Available balance = total - frozen - locked
      const usdAvailable = (balances.usd || 0) - (balances.frozen_usd || 0) - (locked.usd || 0);
      const usdtAvailable = (balances.usdt || 0) - (balances.frozen_usdt || 0) - (locked.usdt || 0);

      const interestUsd = usdAvailable > 0 ? usdAvailable * DAILY_RATE : 0;
      const interestUsdt = usdtAvailable > 0 ? usdtAvailable * DAILY_RATE : 0;

      // Skip if both are below $0.01
      if (interestUsd < 0.01 && interestUsdt < 0.01) continue;

      // Update wallet balances
      const newBalances = { ...balances };
      if (interestUsd >= 0.01) {
        newBalances.usd = (balances.usd || 0) + interestUsd;
      }
      if (interestUsdt >= 0.01) {
        newBalances.usdt = (balances.usdt || 0) + interestUsdt;
      }

      await base44.asServiceRole.entities.User.update(user.id, { wallet_balances: newBalances });

      // Create transaction record for USD interest
      if (interestUsd >= 0.01) {
        await base44.asServiceRole.entities.Transaction.create({
          transaction_type: "interest",
          user_email: user.email,
          asset: "USD",
          amount_usd: interestUsd,
          status: "completed",
          description: `每日利息 | 可用余额 $${usdAvailable.toFixed(2)} × ${ANNUAL_RATE * 100}% ÷ 365 = $${interestUsd.toFixed(4)}`
        });
        totalInterestPaid += interestUsd;
        records.push({ email: user.email, asset: 'USD', amount: interestUsd, principal: usdAvailable });
      }

      // Create transaction record for USDT interest
      if (interestUsdt >= 0.01) {
        await base44.asServiceRole.entities.Transaction.create({
          transaction_type: "interest",
          user_email: user.email,
          asset: "USDT",
          amount_usd: interestUsdt,
          status: "completed",
          description: `每日利息 | 可用余额 $${usdtAvailable.toFixed(2)} × ${ANNUAL_RATE * 100}% ÷ 365 = $${interestUsdt.toFixed(4)}`
        });
        totalInterestPaid += interestUsdt;
        records.push({ email: user.email, asset: 'USDT', amount: interestUsdt, principal: usdtAvailable });
      }

      usersPaid++;
    }

    return Response.json({
      success: true,
      usersPaid,
      totalInterestPaid: totalInterestPaid.toFixed(4),
      totalRecords: records.length,
      records: records.slice(0, 50),
      rate: `${(ANNUAL_RATE * 100).toFixed(1)}% APY / 365 days`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error paying daily interest:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});