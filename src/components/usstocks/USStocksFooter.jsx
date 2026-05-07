import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Shield, FileText, AlertTriangle, BookOpen, Phone, Globe, Lock, TrendingUp, DollarSign, Zap, HelpCircle, BarChart2, Package, Banknote, PiggyBank, ArrowLeftRight, UserCheck } from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Products",
    links: [
      { label: "US Stock Trading", to: "/USStocks", desc: "Trade tokenized US-listed equities with USDT, including Apple, Tesla, NVIDIA and more." },
      { label: "Precious Metals", to: "/Trading", desc: "Buy and sell tokenized Gold and Silver backed by real market prices." },
      { label: "Crypto Exchange", to: "/Trading", desc: "Swap between digital assets and stable currencies with competitive rates." },
      { label: "Staking & Yield", to: "/Staking", desc: "Stake your digital assets to earn passive APR rewards automatically." },
      { label: "Physical Redemption", to: "/Physical", desc: "Redeem your Gold/Silver holdings for physical delivery to your door." },
      { label: "Crypto-Backed Loans", to: "/Lending", desc: "Use your crypto holdings as collateral to borrow stablecoins instantly." },
    ],
  },
  {
    title: "Trading",
    links: [
      { label: "Market Orders", to: "/USStocks", desc: "Execute immediately at the current best available market price." },
      { label: "Limit Orders", to: "/USStocks", desc: "Set a target price — your order fires automatically when the market hits it." },
      { label: "Fractional Shares", to: "/USStocks", desc: "Trade any dollar amount — no need to buy a full share lot." },
      { label: "Portfolio Overview", to: "/Wallet", desc: "Track your holdings, unrealized P&L and asset allocation in one view." },
      { label: "Order History", to: "/Wallet", desc: "Review all completed and pending orders with full trade details." },
      { label: "Fee Schedule", to: "/Guide", desc: "0.1% flat fee on all trades. Earn 100 EVE tokens per $1 in fees paid." },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { label: "Terms of Service", to: "/Guide", desc: "Read our full platform terms governing the use of EVE FINANCE services." },
      { label: "Privacy Policy", to: "/Guide", desc: "How we collect, use, and protect your personal data and trading information." },
      { label: "Risk Disclosure", to: "/Guide", desc: "Full disclosure of financial, market, and operational risks on the platform." },
      { label: "AML / KYC Policy", to: "/Account", desc: "Our Anti-Money Laundering and Know-Your-Customer compliance framework." },
      { label: "Cookie Policy", to: "/Guide", desc: "Information on how we use cookies and similar tracking technologies." },
      { label: "Regulatory Information", to: "/Guide", desc: "Details on licensing, jurisdictional compliance, and regulatory standing." },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/Guide", desc: "Browse our comprehensive knowledge base for answers to common questions." },
      { label: "Trading Guide", to: "/Guide", desc: "Step-by-step tutorials on how to use EVE FINANCE effectively and safely." },
      { label: "Contact Support", to: "/Account", desc: "Submit a support ticket and our team will respond within 24 hours." },
      { label: "KYC Verification", to: "/Account", desc: "Complete identity verification to unlock full platform functionality." },
      { label: "Daily Statement", to: "/DailyStatement", desc: "Download your daily trading activity and portfolio balance reports." },
      { label: "Security Center", to: "/Account", desc: "Manage account security, authentication settings, and login activity." },
    ],
  },
];

const DISCLAIMER_ITEMS = [
  {
    icon: AlertTriangle,
    title: "Investment Risk Warning",
    body: "Trading tokenized US stocks and digital assets involves a high degree of risk and may not be suitable for all investors. The value of investments can go up as well as down, and you may receive back less than you originally invest. Leveraged or margin products can amplify losses beyond your initial deposit. You should carefully consider your investment objectives, level of experience, and risk appetite before trading. EVE FINANCE strongly recommends that you seek independent financial advice if you are in any doubt. Past performance is not a reliable indicator of future results.",
  },
  {
    icon: Shield,
    title: "Tokenized Securities Disclosure",
    body: "EVE FINANCE offers tokenized representations of US-listed equities. These tokens are designed to track the price of the underlying stock in real time but do not confer direct ownership, shareholder rights, voting rights, or dividend entitlements unless explicitly stated. Tokenized stocks are distinct instruments from the actual underlying shares and are not listed or traded on regulated stock exchanges such as NYSE or NASDAQ. Holders of tokenized stocks are exposed to both the price movement of the underlying asset and the operational risks of the EVE FINANCE platform.",
  },
  {
    icon: FileText,
    title: "Regulatory Notice",
    body: "EVE FINANCE operates in compliance with applicable financial regulations in the jurisdictions where it is licensed and authorised. Users are solely responsible for ensuring that their access to and use of this platform complies with the laws, regulations, and tax obligations of their own country or territory of residence. This platform is not available to residents of the United States, Canada, or other jurisdictions where the offering of tokenized securities trading is restricted or prohibited by law. EVE FINANCE reserves the right to restrict access at any time based on regulatory requirements.",
  },
  {
    icon: BookOpen,
    title: "Market Data & Pricing Disclaimer",
    body: "All price data displayed on EVE FINANCE is sourced from reputable third-party market data providers including Polygon.io and CoinMarketCap, and is provided for informational and trading purposes only. Prices may differ from those quoted on traditional exchanges due to market conditions, liquidity constraints, data latency, and provider differences. EVE FINANCE does not guarantee the accuracy, completeness, or timeliness of any market data. Users should not rely solely on platform prices for investment decisions and should cross-reference data from official exchange sources where appropriate.",
  },
  {
    icon: Lock,
    title: "Asset Security & Custody",
    body: "User funds held on EVE FINANCE are maintained in segregated accounts and are not commingled with company operating funds. EVE FINANCE employs bank-grade encryption, multi-factor authentication, and cold storage protocols to safeguard digital assets. However, no system is immune to risk. EVE FINANCE is not responsible for losses arising from user error, compromised credentials, third-party hacks, or circumstances beyond our reasonable control. Users are advised to enable all available security features and to never share login credentials with any third party.",
  },
  {
    icon: DollarSign,
    title: "Fee & Reward Programme",
    body: "A flat trading fee of 0.1% is applied to the notional value of every completed trade on the EVE FINANCE platform. This fee is deducted automatically at the time of execution and is non-refundable except in the case of a platform error confirmed by our operations team. In addition to the standard fee schedule, EVE FINANCE operates a loyalty reward programme that distributes 100 EVE tokens for every USD 1.00 paid in trading fees. EVE token rewards are credited to your wallet in real time and may be subject to future redemption terms. EVE FINANCE reserves the right to modify fee rates and reward structures at any time with reasonable notice.",
  },
];

function DisclaimerItem({ item }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-700/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-slate-200 text-sm font-medium">
          <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
          {item.title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-slate-400 text-xs leading-relaxed border-t border-slate-700 pt-3">
          {item.body}
        </div>
      )}
    </div>
  );
}

export default function USStocksFooter() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 rounded-2xl overflow-hidden shadow-2xl">
      {/* Trading Info Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Trading Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, label: "Real-Time Prices", desc: "Live market data for 20+ tokenized US stocks sourced from Polygon.io, updated every 30 seconds during market hours." },
              { icon: DollarSign, label: "Trade with USDT", desc: "Fund your wallet with USDT via bank transfer or crypto deposit, then buy stocks instantly. Sell back to USDT at any time." },
              { icon: Zap, label: "0.1% Fee · 100 EVE/$", desc: "Industry-low 0.1% flat fee on all trades. Earn 100 EVE reward tokens for every $1 paid in fees — credited instantly." },
              { icon: BarChart2, label: "Fractional Shares", desc: "No minimum lot size. Trade any USDT amount from $1 upwards — own a fraction of any US-listed stock." },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-white font-semibold text-xs mb-1 flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5 text-blue-300" />
                  {item.label}
                </p>
                <p className="text-blue-200 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "Market Order",
                desc: "Your order executes immediately at the best available market price. Ideal when speed matters more than exact price — guaranteed fill during trading hours.",
              },
              {
                title: "Limit Order",
                desc: "You specify the exact price at which you want to buy or sell. Funds are frozen upon submission and released automatically if the order is not triggered. Cancel at any time from your Wallet.",
              },
            ].map(item => (
              <div key={item.title} className="bg-white/10 rounded-xl px-4 py-3 flex gap-3 items-start">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-xs">{item.title}</p>
                  <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="px-6 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {NAV_SECTIONS.map(section => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group block"
                    >
                      <span className="text-slate-300 text-xs font-medium group-hover:text-blue-400 transition-colors">
                        {link.label}
                      </span>
                      <p className="text-slate-600 text-xs mt-0.5 leading-relaxed group-hover:text-slate-500 transition-colors hidden md:block">
                        {link.desc}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
            Important Disclosures &amp; Legal Notices
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DISCLAIMER_ITEMS.map(item => (
              <DisclaimerItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md overflow-hidden flex-shrink-0">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a0d6759fb_Screenshot2025-08-23105026.png"
                alt="EVE FINANCE"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-slate-300 font-bold text-sm">EVE FINANCE</span>
              <p className="text-slate-600 text-xs">© 2004–2026 EVE FINANCE Ltd. All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              256-bit SSL Encryption
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Segregated Funds
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              24/7 Support
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              v2.6.0
            </span>
          </div>
        </div>

        {/* Final disclaimer paragraph */}
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-500">Risk Warning:</strong> Trading tokenized stocks and digital assets carries a high level of risk and may not be suitable for all investors. You could lose some or all of your invested capital. You should only trade with money you can afford to lose. Please ensure you fully understand the risks involved and seek independent financial advice if necessary.
          </p>
          <p>
            <strong className="text-slate-500">No Investment Advice:</strong> Nothing on this platform constitutes investment advice, financial advice, trading advice, or any other kind of advice. EVE FINANCE is not a licensed investment adviser, broker-dealer, or financial institution. All content is provided for informational and transactional purposes only. You are solely responsible for your own investment decisions.
          </p>
          <p>
            <strong className="text-slate-500">Regulatory:</strong> EVE FINANCE operates under applicable digital asset and fintech regulations. Access to our platform and its services may be restricted in certain jurisdictions including but not limited to the United States of America, Canada, and sanctioned territories. It is the user's responsibility to comply with local laws and regulations prior to using this platform.
          </p>
        </div>
      </div>
    </footer>
  );
}