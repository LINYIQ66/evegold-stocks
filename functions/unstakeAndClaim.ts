import { createClient } from 'npm:@base44/sdk@0.1.0';
import { differenceInSeconds } from 'npm:date-fns@2.30.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'),
});

Deno.serve(async (req) => {
    try {
        const { stakeId } = await req.json();

        // 1. Authenticate user
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        const user = await base44.auth.me();
        if (!user) return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });

        // 2. Fetch the stake and validate ownership
        const stake = await base44.entities.Stake.get(stakeId);
        if (!stake || stake.user_email !== user.email) {
            return new Response(JSON.stringify({ success: false, error: 'Stake not found or access denied' }), { status: 404 });
        }
        if (stake.status !== 'active') {
            return new Response(JSON.stringify({ success: false, error: 'Stake is not active' }), { status: 400 });
        }

        // 3. Calculate rewards
        const secondsStaked = Math.max(0, differenceInSeconds(new Date(), new Date(stake.start_date)));
        const yearlyRate = (stake.apr || 4.5) / 100;
        const secondsPerYear = 365 * 24 * 60 * 60;
        const secondlyRate = yearlyRate / secondsPerYear;
        const rewards = stake.amount * secondlyRate * secondsStaked;

        // 4. Get current user data
        const currentUser = await base44.entities.User.get(user.id);
        const assetKey = stake.asset.toLowerCase();
        
        // 5. Prepare updated balances
        const newWalletBalances = { ...currentUser.wallet_balances };
        const newLockedBalances = { ...currentUser.locked_balances };
        
        // UNLOCK: Move principal from locked to available balance + add rewards
        newWalletBalances[assetKey] = (newWalletBalances[assetKey] || 0) + stake.amount + rewards;
        newLockedBalances[assetKey] = Math.max(0, (newLockedBalances[assetKey] || 0) - stake.amount);

        // 6. Execute updates in parallel where possible
        const updatePromises = [
            base44.entities.Stake.update(stake.id, { status: 'unstaked' }),
            base44.entities.User.update(user.id, { 
                wallet_balances: newWalletBalances,
                locked_balances: newLockedBalances
            })
        ];

        // 7. Create transaction logs (simplified - no external API calls)
        const principalValueUsd = stake.amount * 2000; // Use approximate USD value
        const rewardValueUsd = rewards * 2000;

        if (principalValueUsd > 0) {
            updatePromises.push(
                base44.entities.Transaction.create({
                    transaction_type: "unstaking",
                    user_email: user.email,
                    to_asset: stake.asset,
                    amount_usd: principalValueUsd,
                    status: "completed",
                    description: `Unstaked ${stake.amount} ${stake.asset}`
                })
            );
        }

        if (rewardValueUsd > 0) {
            updatePromises.push(
                base44.entities.Transaction.create({
                    transaction_type: "staking_reward",
                    user_email: user.email,
                    to_asset: stake.asset,
                    amount_usd: rewardValueUsd,
                    status: "completed",
                    description: `Reward for staking ${stake.amount} ${stake.asset}`
                })
            );
        }

        // Execute all updates
        await Promise.all(updatePromises);

        return new Response(JSON.stringify({ 
            success: true, 
            claimedRewards: rewards, 
            principalReturned: stake.amount 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Unstaking Error:', error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});