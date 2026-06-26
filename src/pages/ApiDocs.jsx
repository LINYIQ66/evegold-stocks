import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Shield,
  UserPlus,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  Radio,
  RefreshCw,
  BookOpen,
  Plane,
  DollarSign,
  CalendarClock,
  Globe,
  FolderCog,
  ArrowRightLeft,
  Plug,
  HelpCircle,
  KeyRound,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { id: 'overview', label: 'Overview', icon: Server },
  { id: 'auth', label: 'Authentication', icon: KeyRound },
  { id: 'onboarding', label: 'Account Onboarding', icon: UserPlus },
  { id: 'kyc', label: 'KYC & Compliance', icon: Shield },
  { id: 'accounts', label: 'Account Lifecycle', icon: FileCheck2 },
  { id: 'validation', label: 'Data Validation', icon: CheckCircle2 },
  { id: 'funding', label: 'Funding & Transfers', icon: CreditCard },
  { id: 'trading', label: 'Trading System', icon: TrendingUp },
  { id: 'sse', label: 'Real-Time Events (SSE)', icon: Radio },
  { id: 'rebalancing', label: 'Portfolio Rebalancing', icon: RefreshCw },
  { id: 'ipo', label: 'IPO Subscriptions', icon: Globe },
  { id: 'fixedincome', label: 'Fixed Income', icon: DollarSign },
  { id: 'eod', label: 'End-of-Day & Reconciliation', icon: CalendarClock },
  { id: 'extended', label: '24/5 Extended Trading', icon: Plane },
  { id: 'managed', label: 'Managed Accounts', icon: FolderCog },
  { id: 'acat', label: 'ACAT Transfers', icon: ArrowRightLeft },
  { id: 'integration', label: 'Integration Guide', icon: Plug },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

const CodeBlock = ({ children, label }) => (
  <div className="my-4">
    {label && <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>}
    <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed"><code>{children}</code></pre>
  </div>
);

const StatusBadge = ({ status, type }) => {
  const colors = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warn: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${colors[type] || colors.info}`}>{status}</span>;
};

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Eve Broker API Reference
              </h1>
              <p className="text-sm text-slate-500">Complete developer documentation for the Eve Broker API</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="secondary" className="text-xs">Base URL: broker-api.eve.markets</Badge>
            <Badge variant="secondary" className="text-xs">Sandbox: broker-api.sandbox.eve.markets</Badge>
            <Badge variant="secondary" className="text-xs">Auth: authx.eve.markets</Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:sticky lg:top-8 h-fit p-3">
            <CardContent className="p-1">
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <s.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{s.label}</span>
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-6">
            {/* 1. Overview */}
            <Card id="overview">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5 text-blue-600" /> 1. Architecture Overview</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">The Eve Broker API lets you build a complete trading platform for end users in the capacity of a broker-dealer.</p>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Capability</th><th className="text-left p-3 font-semibold">You</th><th className="text-left p-3 font-semibold">Eve</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3">🎨 Frontend Experience</td><td className="p-3">UI / UX / App / Web</td><td className="p-3 text-slate-400">—</td></tr>
                      <tr><td className="p-3">📝 Customer Onboarding</td><td className="p-3">Collect & submit KYC</td><td className="p-3">Review</td></tr>
                      <tr><td className="p-3">💰 Fund Custody</td><td className="p-3 text-slate-400">—</td><td className="p-3">SIPC protection ($500K)</td></tr>
                      <tr><td className="p-3">📈 Order Routing</td><td className="p-3 text-slate-400">—</td><td className="p-3">Multi-venue routing</td></tr>
                      <tr><td className="p-3">📜 Regulatory Compliance</td><td className="p-3 text-slate-400">—</td><td className="p-3">FINRA member</td></tr>
                      <tr><td className="p-3">🧾 Clearing & Settlement</td><td className="p-3 text-slate-400">—</td><td className="p-3">Apex Clearing</td></tr>
                      <tr><td className="p-3">📊 Reporting</td><td className="p-3 text-slate-400">—</td><td className="p-3">Auto statements / confirms</td></tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Three Partnership Models</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Model</th><th className="text-left p-3 font-semibold">Account Structure</th><th className="text-left p-3 font-semibold">Use Case</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-medium">Fully-Disclosed</td><td className="p-3">Individual account per customer</td><td className="p-3">Standard broker app</td></tr>
                      <tr><td className="p-3 font-medium">Omnibus</td><td className="p-3">One master account, you keep internal books</td><td className="p-3">High-frequency / institutional</td></tr>
                      <tr><td className="p-3 font-medium">RIA</td><td className="p-3">Registered Investment Advisor</td><td className="p-3">Advisory services</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 2. Authentication */}
            <Card id="auth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-blue-600" /> 2. Authentication</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Endpoint Matrix</h3>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Environment</th><th className="text-left p-3 font-semibold">Broker API</th><th className="text-left p-3 font-semibold">Market Data</th><th className="text-left p-3 font-semibold">Auth</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-medium">Live</td><td className="p-3 font-mono text-xs">broker-api.eve.markets</td><td className="p-3 font-mono text-xs">data.eve.markets</td><td className="p-3 font-mono text-xs">authx.eve.markets</td></tr>
                      <tr><td className="p-3 font-medium">Sandbox</td><td className="p-3 font-mono text-xs">broker-api.sandbox.eve.markets</td><td className="p-3 font-mono text-xs">data.sandbox.eve.markets</td><td className="p-3 font-mono text-xs">authx.sandbox.eve.markets</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mb-2">Client Credentials (Recommended)</h3>
                <p className="text-slate-600 mb-2"><strong>Step 1:</strong> Obtain an access token (valid for 15 minutes)</p>
                <CodeBlock label="Bash">{`curl -X POST "https://authx.sandbox.eve.markets/v1/oauth2/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET"`}</CodeBlock>
                <CodeBlock label="Response">{`{"access_token": "eyJ...", "expires_in": 899, "token_type": "Bearer"}`}</CodeBlock>
                <p className="text-slate-600 mb-2"><strong>Step 2:</strong> Include the token in all requests</p>
                <CodeBlock>{`curl -H "Authorization: Bearer eyJ..." \\
  "https://broker-api.sandbox.eve.markets/v1/accounts"`}</CodeBlock>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700"><strong>Reuse tokens:</strong> Do not re-request within 15 minutes. Supports both <code className="bg-amber-100 px-1 rounded">client_secret_post</code> and <code className="bg-amber-100 px-1 rounded">private_key_jwt</code> (RFC 7523).</p>
                </div>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Legacy Authentication</h3>
                <CodeBlock>{`curl -H "APCA-API-KEY-ID: xxx" \\
  -H "APCA-API-SECRET-KEY: xxx" \\
  "https://api.eve.markets/v2/account"`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Idempotency</h3>
                <p className="text-slate-600">Creation requests support the <code className="bg-slate-100 px-1 rounded">Idempotency-Key</code> header:</p>
                <ul className="text-sm text-slate-600 list-disc pl-5 mt-2 space-y-1">
                  <li>Same key + same body → returns existing result (no duplication)</li>
                  <li>Same key + different body → 422 error</li>
                  <li>Recommended format: UUID</li>
                </ul>
              </CardContent>
            </Card>

            {/* 3. Onboarding */}
            <Card id="onboarding">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-600" /> 3. Account Onboarding</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Complete Flow</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono">
                  User fills form → POST /v1/accounts → Eve KYC review<br/>
                  ↓<br/>
                  Onfido identity verification → Upload result → CIP submission<br/>
                  ↓<br/>
                  NEW → SUBMITTED → PENDING → APPROVED → ACTIVE
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Core API Endpoints</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Operation</th><th className="text-left p-3 font-semibold">Endpoint</th><th className="text-left p-3 font-semibold">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3">Create account</td><td className="p-3 font-mono text-xs">POST /v1/accounts</td><td className="p-3">Submit contact + identity + disclosures</td></tr>
                      <tr><td className="p-3">List accounts</td><td className="p-3 font-mono text-xs">GET /v1/accounts</td><td className="p-3">Max 1000, paginate by created_after/before</td></tr>
                      <tr><td className="p-3">Get account</td><td className="p-3 font-mono text-xs">GET /v1/accounts/{'{id}'}</td><td className="p-3">Includes documents attribute</td></tr>
                      <tr><td className="p-3">Update account</td><td className="p-3 font-mono text-xs">PATCH /v1/accounts/{'{id}'}</td><td className="p-3">Modify information</td></tr>
                      <tr><td className="p-3">Close account</td><td className="p-3 font-mono text-xs">POST /v1/accounts/{'{id}'}/actions/close</td><td className="p-3">Must liquidate & withdraw first</td></tr>
                      <tr><td className="p-3">Upload document</td><td className="p-3 font-mono text-xs">POST /v1/accounts/{'{id}'}/documents/upload</td><td className="p-3">PDF/JPG/PNG</td></tr>
                      <tr><td className="p-3">Get CIP</td><td className="p-3 font-mono text-xs">GET /v1/accounts/{'{id}'}/cip</td><td className="p-3">Customer Identification Program</td></tr>
                      <tr><td className="p-3">Submit CIP</td><td className="p-3 font-mono text-xs">POST /v1/accounts/{'{id}'}/cip</td><td className="p-3">Submit KYC verification result</td></tr>
                      <tr><td className="p-3">Onfido token</td><td className="p-3 font-mono text-xs">GET /v1/accounts/{'{id}'}/onfido-sdk-tokens</td><td className="p-3">Get SDK token</td></tr>
                      <tr><td className="p-3">Onfido result</td><td className="p-3 font-mono text-xs">PATCH /v1/accounts/{'{id}'}/onfido-sdk</td><td className="p-3">Upload SDK verification result</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Account Creation Request Body (Fully-Disclosed)</h3>
                <CodeBlock label="JSON">{`{
  "contact": {
    "email_address": "john@example.com",
    "phone_number": "7065912538",
    "street_address": ["20 S Craig Ave"],
    "city": "San Mateo",
    "state": "CA",
    "postal_code": "33345"
  },
  "identity": {
    "given_name": "John",
    "family_name": "Doe",
    "date_of_birth": "1990-01-01",
    "tax_id_type": "USA_SSN",
    "tax_id": "661010666",
    "country_of_citizenship": "USA",
    "country_of_birth": "USA",
    "country_of_tax_residence": "USA",
    "funding_source": ["employment_income"],
    "annual_income_min": "50000",
    "annual_income_max": "100000",
    "total_net_worth_min": "100000",
    "total_net_worth_max": "500000",
    "liquid_net_worth_min": "50000",
    "liquid_net_worth_max": "250000",
    "liquidity_needs": "does_not_apply",
    "investment_experience": "limited",
    "risk_tolerance": "moderate",
    "investment_objective": "growth",
    "employment_status": "employed",
    "employer_name": "Acme Corp",
    "visa_type": "not_applicable"
  },
  "disclosures": {
    "is_control_person": false,
    "is_affiliated_exchange_or_finra": false,
    "is_politically_exposed": false,
    "is_immediate_family_exposed": false,
    "employment_status": "employed"
  },
  "agreements": [
    {
      "agreement": "customer_agreement",
      "signed_at": "2024-01-01T00:00:00Z",
      "ip_address": "127.0.0.1"
    },
    {
      "agreement": "options_agreement",
      "signed_at": "2024-01-01T00:00:00Z",
      "ip_address": "127.0.0.1"
    }
  ],
  "trusted_contact": {
    "given_name": "Jane",
    "family_name": "Doe",
    "email_address": "jane@example.com"
  }
}`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Multi-Account (MLA)</h3>
                <p className="text-slate-600">Existing users can open sub-accounts by passing <code className="bg-slate-100 px-1 rounded">primary_account_holder_id</code>:</p>
                <CodeBlock label="JSON">{`{
  "primary_account_holder_id": "existing-account-uuid",
  "account_type": "ira",
  "minor_type": "traditional_ira"
}`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Onfido Identity Verification</h3>
                <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-1">
                  <li>Get SDK Token: <code className="bg-slate-100 px-1 rounded">GET /v1/accounts/{'{id}'}/onfido-sdk-tokens</code> → <code className="bg-slate-100 px-1 rounded">{'{"sdk_token": "..."}'}</code></li>
                  <li>Frontend uses token to launch Onfido SDK (user selfie + ID scan)</li>
                  <li>After verification, upload result: <code className="bg-slate-100 px-1 rounded">PATCH /v1/accounts/{'{id}'}/onfido-sdk</code> (Onfido callback auto-notifies Eve)</li>
                </ol>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">CIP Minimum Required Fields</h3>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/cip">{`{
  "tax_id_type": "USA_SSN",
  "tax_id": "661010666",
  "date_of_birth": "1990-01-01"
}`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">File Upload</h3>
                <p className="text-slate-600">Supports PDF, JPG, PNG:</p>
                <CodeBlock>{`curl -X POST "https://broker-api.sandbox.eve.markets/v1/accounts/{id}/documents/upload" \\
  -H "Authorization: Bearer ..." \\
  -F "file=@driver_license.jpg" \\
  -F "document_type=id_card" \\
  -F "document_sub_type=drivers_license"`}</CodeBlock>
              </CardContent>
            </Card>

            {/* 4. KYC */}
            <Card id="kyc">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" /> 4. KYC & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Who is Responsible for KYC?</h3>
                <p className="text-slate-600">KYC responsibility differs based on your partnership model:</p>
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Model</th><th className="text-left p-3 font-semibold">KYC Owner</th><th className="text-left p-3 font-semibold">Post-Onboarding Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-medium">Trading App / RIA</td><td className="p-3"><StatusBadge status="Eve" type="info" /></td><td className="p-3 font-mono text-xs">SUBMITTED → Eve auto-review</td></tr>
                      <tr><td className="p-3 font-medium">Fully-Disclosed Broker</td><td className="p-3"><StatusBadge status="You" type="warn" /></td><td className="p-3 font-mono text-xs">APPROVED (directly after your review)</td></tr>
                      <tr><td className="p-3 font-medium">Omnibus</td><td className="p-3 text-slate-400">No individual onboarding</td><td className="p-3 text-slate-400">—</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Model 1: Trading App / RIA — Eve Reviews</h3>
                <p className="text-slate-600">You collect info → Eve reviews → You wait for results</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono mt-2">
                  ① POST /v1/accounts<br/>
                  {'  '}{`├─ contact (contact info)`}<br/>
                  {'  '}{`├─ identity (identity + financial info)`}<br/>
                  {'  '}{`├─ disclosures (compliance declarations)`}<br/>
                  {'  '}{`└─ agreements (signed agreements)`}<br/><br/>
                  ② Account → SUBMITTED → Eve auto KYC<br/>
                  {'  '}{`├─ Blacklist screening`}<br/>
                  {'  '}{`├─ SSN verification`}<br/>
                  {'  '}{`├─ Address verification`}<br/>
                  {'  '}{`└─ OFAC / sanctions list check`}<br/><br/>
                  ③ Result (SSE push):<br/>
                  {'  '}{`├─ APPROVED → ACTIVE ✅`}<br/>
                  {'  '}{`├─ APPROVAL_PENDING → Eve manual review ⏳`}<br/>
                  {'  '}{`├─ ACTION_REQUIRED → supplementary docs 📎`}<br/>
                  {'  '}{`└─ REJECTED ❌`}
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Upload Supplementary Documents</h3>
                <CodeBlock>{`curl -X POST "https://broker-api.sandbox.eve.markets/v1/accounts/{id}/documents/upload" \\
  -H "Authorization: Bearer ***" \\
  -F "file=@utility_bill.pdf" \\
  -F "document_type=proof_of_address" \\
  -F "document_sub_type=utility_bill"`}</CodeBlock>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Common ACTION_REQUIRED reasons:</p>
                  <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                    <li>Address unverified → Upload utility bill / bank statement</li>
                    <li>Identity unconfirmed → Upload driver's license / passport</li>
                    <li>SSN mismatch → Upload SSN card</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Model 2: Fully-Disclosed Broker — You Review</h3>
                <p className="text-slate-600">You complete KYC yourself → Tell Eve the result → Immediate account opening</p>
                <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-1">
                  <li>You perform your own KYC (using your vendor: Jumio / Plaid IDV / LexisNexis etc.)</li>
                  <li><code className="bg-slate-100 px-1 rounded">POST /v1/accounts</code> → status directly <code className="bg-slate-100 px-1 rounded">APPROVED</code> (since you already verified)</li>
                  <li>Eve only runs blacklist screening (match → REJECTED / APPROVAL_PENDING)</li>
                  <li><code className="bg-slate-100 px-1 rounded">POST /v1/accounts/{'{id}'}/cip</code> ← Submit your KYC result</li>
                </ol>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">CIP Minimum Required Fields (FINRA)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Field</th><th className="text-left p-3 font-semibold">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-mono text-xs">Name</td><td className="p-3">Full name</td></tr>
                      <tr><td className="p-3 font-mono text-xs">Date of Birth</td><td className="p-3">Date of birth</td></tr>
                      <tr><td className="p-3 font-mono text-xs">Address</td><td className="p-3">Residential address</td></tr>
                      <tr><td className="p-3 font-mono text-xs">Tax ID (SSN/TIN)</td><td className="p-3">Taxpayer identification number</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Onfido Identity Verification Flow (Recommended for Trading App)</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono">
                  Your Frontend → Your Backend → Eve<br/>
                  ① User fills form<br/>
                  ② POST /v1/accounts<br/>
                  ③ GET /v1/accounts/{'{id}'}/onfido-sdk-tokens → returns sdk_token<br/>
                  ④ Return sdk_token to frontend<br/>
                  ⑤ Launch Onfido SDK — user photo + selfie, Onfido auto-verifies<br/>
                  ⑥ Verification complete (callback)<br/>
                  ⑦ PATCH /v1/accounts/{'{id}'}/onfido-sdk<br/>
                  ⑧ Eve receives result, continues KYC review
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Key Implementation Points</h3>
                <p className="text-slate-600"><strong>1. Get SDK Token:</strong></p>
                <CodeBlock>{`GET /v1/accounts/{account_id}/onfido-sdk-tokens
→ {"sdk_token": "eyJ..."}`}</CodeBlock>
                <p className="text-slate-600"><strong>2. Frontend Integration (onfido-sdk-ui npm package):</strong></p>
                <CodeBlock label="JavaScript">{`import { Onfido } from 'onfido-sdk-ui';

Onfido.init({
  token: sdkToken,
  containerId: 'onfido-mount',
  onComplete: (data) => {
    fetch('/api/onfido-result', {
      method: 'PATCH',
      body: JSON.stringify({ account_id, result: data })
    });
  }
});`}</CodeBlock>
                <p className="text-slate-600"><strong>3. Upload Onfido Result:</strong></p>
                <CodeBlock>{`PATCH /v1/accounts/{account_id}/onfido-sdk
# Body can be empty (Onfido auto-notifies Eve)`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">International Clients — W-8BEN</h3>
                <p className="text-slate-600">Non-US tax residents (W-9 not applicable) must submit W-8BEN:</p>
                <CodeBlock>{`POST /v1/accounts/{id}/documents/upload \\
  -F "file=@w8ben.pdf" \\
  -F "document_type=w8ben"`}</CodeBlock>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700"><strong>W-8BEN must be renewed every 3 years</strong> (signing year + 3 years).</p>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">KYC Status Enumeration</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Status</th><th className="text-left p-3 font-semibold">Meaning</th><th className="text-left p-3 font-semibold">Your Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-mono text-xs">ONBOARDING</td><td className="p-3">Just created, KYC not started</td><td className="p-3">Wait or trigger Onfido</td></tr>
                      <tr><td className="p-3 font-mono text-xs">SUBMITTED</td><td className="p-3">Submitted for review</td><td className="p-3">Wait for Eve</td></tr>
                      <tr><td className="p-3 font-mono text-xs">APPROVAL_PENDING</td><td className="p-3">KYC not auto-passed, manual review</td><td className="p-3">Wait</td></tr>
                      <tr><td className="p-3 font-mono text-xs">ACTION_REQUIRED</td><td className="p-3">Supplementary materials needed</td><td className="p-3"><strong>Upload documents</strong></td></tr>
                      <tr><td className="p-3 font-mono text-xs">APPROVED</td><td className="p-3">Approved</td><td className="p-3">Can deposit & trade</td></tr>
                      <tr><td className="p-3 font-mono text-xs">ACTIVE</td><td className="p-3">Activated</td><td className="p-3">All features available</td></tr>
                      <tr><td className="p-3 font-mono text-xs">REJECTED</td><td className="p-3">Rejected</td><td className="p-3">Contact user / Eve</td></tr>
                      <tr><td className="p-3 font-mono text-xs">SUBMISSION_FAILED</td><td className="p-3">System failure</td><td className="p-3">Eve auto-handles</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Practical Minimal KYC Pipeline</h3>
                <CodeBlock label="Python (pseudocode)">{`class EveKYC:
    def onboard(self, user_data):
        # 1. Create account
        account = self.api.post('/v1/accounts', {
            'contact': user_data.contact,
            'identity': {
                'given_name': user_data.first_name,
                'family_name': user_data.last_name,
                'date_of_birth': user_data.dob,  # "1990-01-01"
                'tax_id_type': 'USA_SSN',
                'tax_id': user_data.ssn,  # "661010666"
                'funding_source': ['employment_income'],
                'annual_income_min': user_data.income_range,
            },
            'disclosures': {},
            'agreements': [
                {'agreement': 'customer_agreement', 'signed_at': now, 'ip_address': user_ip}
            ]
        })
        account_id = account['id']

        # 2. Trigger Onfido
        sdk_token = self.api.get(f'/v1/accounts/{account_id}/onfido-sdk-tokens')
        return account_id, sdk_token['sdk_token']

    def on_onfido_complete(self, account_id):
        # 3. Notify Eve after Onfido completes
        self.api.patch(f'/v1/accounts/{account_id}/onfido-sdk')
        # 4. If Fully-Disclosed, submit CIP
        self.api.post(f'/v1/accounts/{account_id}/cip', {
            'tax_id_type': 'USA_SSN',
            'tax_id': ssn,
            'date_of_birth': dob
        })

    def check_status(self, account_id):
        # 5. Poll or listen via SSE for status changes
        acct = self.api.get(f'/v1/accounts/{account_id}')
        return acct['status']  # SUBMITTED / ACTION_REQUIRED / APPROVED / ACTIVE`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Key Pitfalls</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700"><strong>Strict SSN format validation</strong> — do not submit numbers like 123456789 that look like test data.</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700"><strong>approved_level and margin_multiplier</strong> — cannot be set at onboarding; only via PATCH after account is ACTIVATED.</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700"><strong>W-8BEN date format</strong> — the form uses MM-DD-YYYY, but API submission must use YYYY-MM-DD.</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700"><strong>Onfido token in memory only</strong> — do not persist; discard after use.</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700"><strong>SSE events may duplicate</strong> — deduplicate using the <code className="bg-red-100 px-1 rounded">at</code> field.</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700"><strong>Production rate limits</strong> — do not send concurrent onboarding request bursts.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Account Lifecycle */}
            <Card id="accounts">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-blue-600" /> 5. Account Status & Lifecycle</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Status</th><th className="text-left p-3 font-semibold">Meaning</th><th className="text-left p-3 font-semibold">Actions Available</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-mono text-xs">NEW</td><td className="p-3">Just submitted</td><td className="p-3">Edit, upload documents</td></tr>
                      <tr><td className="p-3 font-mono text-xs">SUBMITTED</td><td className="p-3">Submitted for review</td><td className="p-3">Wait</td></tr>
                      <tr><td className="p-3 font-mono text-xs">PENDING</td><td className="p-3">Under review</td><td className="p-3 text-slate-400">—</td></tr>
                      <tr><td className="p-3 font-mono text-xs">ACTION_REQUIRED</td><td className="p-3">Supplementary materials needed</td><td className="p-3">Upload docs / Onfido</td></tr>
                      <tr><td className="p-3 font-mono text-xs">APPROVED</td><td className="p-3">Approved</td><td className="p-3">Deposit, trade</td></tr>
                      <tr><td className="p-3 font-mono text-xs">ACTIVE</td><td className="p-3">Activated</td><td className="p-3">All</td></tr>
                      <tr><td className="p-3 font-mono text-xs">DISABLED</td><td className="p-3">Disabled</td><td className="p-3">Contact Eve</td></tr>
                      <tr><td className="p-3 font-mono text-xs">CLOSED</td><td className="p-3">Closed</td><td className="p-3 text-slate-400">Irreversible</td></tr>
                      <tr><td className="p-3 font-mono text-xs">REJECTED</td><td className="p-3">Rejected</td><td className="p-3">Contact Eve</td></tr>
                      <tr><td className="p-3 font-mono text-xs">SUSPENDED</td><td className="p-3">Suspended</td><td className="p-3">Contact Eve</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Status Flow</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono">
                  NEW → SUBMITTED → PENDING ──→ APPROVED → ACTIVE<br/>
                  {'  '}{'↓        ↓        ↓              ↓'}<br/>
                  REJECTED  ACTION_   CLOSED     DISABLED / SUSPENDED<br/>
                  {'          REQUIRED'}<br/>
                  {'          ↓'}<br/>
                  {'          APPROVED'}
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Account Attributes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Attribute</th><th className="text-left p-3 font-semibold">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-mono text-xs">account_type</td><td className="p-3">trading / ira</td></tr>
                      <tr><td className="p-3 font-mono text-xs">minor_type</td><td className="p-3">traditional_ira / roth_ira / sep_ira</td></tr>
                      <tr><td className="p-3 font-mono text-xs">margin</td><td className="p-3">Margin account enabled</td></tr>
                      <tr><td className="p-3 font-mono text-xs">options_approved_level</td><td className="p-3">0 - 4</td></tr>
                      <tr><td className="p-3 font-mono text-xs">crypto_status</td><td className="p-3">Crypto trading enabled</td></tr>
                      <tr><td className="p-3 font-mono text-xs">currency</td><td className="p-3">USD / multi-currency (LCT)</td></tr>
                      <tr><td className="p-3 font-mono text-xs">system_day_trades_left</td><td className="p-3">Remaining day trades</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 6. Data Validation */}
            <Card id="validation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 6. Data Validation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">All data must pass FINRA CAIS validation, otherwise a <code className="bg-slate-100 px-1 rounded">422</code> is returned.</p>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Name / Address Romanization</h3>
                <p className="text-slate-600"><code className="bg-slate-100 px-1 rounded">given_name</code>, <code className="bg-slate-100 px-1 rounded">family_name</code>, <code className="bg-slate-100 px-1 rounded">street_address</code>, <code className="bg-slate-100 px-1 rounded">city</code>, <code className="bg-slate-100 px-1 rounded">state</code> etc. must be in <strong>ASCII range 32-126</strong>. To preserve the original script, use <code className="bg-slate-100 px-1 rounded">local_*</code> fields (e.g. <code className="bg-slate-100 px-1 rounded">local_given_name</code>).</p>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">SSN Validation Rules</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /><code className="text-sm">661010666</code><span className="text-xs text-slate-500">(9 digits)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">000123456</code><span className="text-xs text-slate-500">(Area Number cannot be 000)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">666123456</code><span className="text-xs text-slate-500">(Area Number cannot be 666)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">123004567</code><span className="text-xs text-slate-500">(Group Number cannot be 00)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">1234560000</code><span className="text-xs text-slate-500">(Serial Number cannot be 0000)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">111111111</code><span className="text-xs text-slate-500">(cannot be all same digits)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">123456789</code><span className="text-xs text-slate-500">(cannot be sequential ascending)</span></div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><code className="text-sm">987654321</code><span className="text-xs text-slate-500">(cannot be sequential descending)</span></div>
                </div>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Funding Source Verification</h3>
                <CodeBlock label="JSON">{`"funding_source": ["employment_income"]  // at least one required
"annual_income_min": "50000_99999"        // annual income range`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Age Restriction</h3>
                <p className="text-slate-600">Must be <strong>≥ 18 years old</strong>.</p>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">funding_source Options</h3>
                <div className="flex flex-wrap gap-2">
                  {['employment_income', 'investments', 'inheritance', 'business_income', 'savings', 'family', 'pension', 'real_estate', 'alimony', 'disability', 'social_security'].map(f => (
                    <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                  ))}
                </div>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Financial Range Enumerations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Range</th><th className="text-left p-3 font-semibold">Enum Value</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3">{'< $10K'}</td><td className="p-3 font-mono text-xs">0_9999</td></tr>
                      <tr><td className="p-3">$10K - $25K</td><td className="p-3 font-mono text-xs">10000_24999</td></tr>
                      <tr><td className="p-3">$25K - $50K</td><td className="p-3 font-mono text-xs">25000_49999</td></tr>
                      <tr><td className="p-3">$50K - $100K</td><td className="p-3 font-mono text-xs">50000_99999</td></tr>
                      <tr><td className="p-3">$100K - $250K</td><td className="p-3 font-mono text-xs">100000_249999</td></tr>
                      <tr><td className="p-3">$250K - $500K</td><td className="p-3 font-mono text-xs">250000_499999</td></tr>
                      <tr><td className="p-3">{'> $500K'}</td><td className="p-3 font-mono text-xs">500000_up</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Agreement Types</h3>
                <div className="flex flex-wrap gap-2">
                  {['customer_agreement', 'margin_agreement', 'options_agreement', 'crypto_agreement', 'ach_agreement', 'ira_agreement', 'account_transfer_agreement', 'esign_agreement', 'privacy_policy', 'data_sharing_disclosure', 'wire_agreement', 'sweep_agreement'].map(a => (
                    <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 7. Funding */}
            <Card id="funding">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" /> 7. Funding & Transfers</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Fund Flow</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono">
                  User Bank → Plaid Link → ACH Relationship → Transfer API → Credited<br/><br/>
                  Wire Transfer → ↑<br/>
                  Instant Funding → ↑<br/>
                  Journals → ↑
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">7.1 Sandbox Testing</h3>
                <p className="text-slate-600">In sandbox, all transfers are instant:</p>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/transfers">{`{
  "transfer_type": "ach",
  "relationship_id": "rel-uuid",
  "direction": "INCOMING",
  "amount": "5000.00"
}`}</CodeBlock>
                <p className="text-slate-600">→ Account immediately available</p>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">7.2 ACH Deposits & Withdrawals</h3>
                <p className="text-slate-600"><strong>Step 1: Plaid Link</strong> — user authorizes in-app → obtain <code className="bg-slate-100 px-1 rounded">processor_token</code></p>
                <p className="text-slate-600 mt-2"><strong>Step 2: Create ACH Relationship</strong></p>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/ach-relationships">{`{
  "processor_token": "plaid-processor-token",
  "account_owner_name": "John Doe"
}`}</CodeBlock>
                <p className="text-slate-600">Status: <StatusBadge status="PENDING → APPROVED" type="info" /></p>
                <p className="text-slate-600 mt-2"><strong>Step 3: Initiate Transfer</strong></p>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/transfers">{`{
  "transfer_type": "ach",
  "relationship_id": "rel-uuid",
  "direction": "INCOMING",
  "amount": "1000.00"
}`}</CodeBlock>
                <p className="text-slate-600">Status: <StatusBadge status="QUEUED → APPROVED → PROCESSING → COMPLETE" type="info" /></p>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">7.3 Wire Transfers</h3>
                <p className="text-slate-600">First create a bank object:</p>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/recipient-banks">{`{
  "name": "Chase",
  "bank_code_type": "ABA",
  "bank_code": "021000021",
  "account_number": "123456789"
}`}</CodeBlock>
                <p className="text-slate-600 mt-2">Then transfer:</p>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/transfers">{`{
  "transfer_type": "wire",
  "bank_id": "bank-uuid",
  "direction": "OUTGOING",
  "amount": "5000.00",
  "fee_payment_method": "user"
}`}</CodeBlock>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700"><strong>Incoming wires</strong> require FFC instructions: <code className="bg-amber-100 px-1 rounded">FFC: {'{correspondent_name} {account_number}'}</code></p>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">7.4 International Wire (SWIFT)</h3>
                <CodeBlock label="POST /v1/accounts/{'{id}'}/recipient-banks">{`{
  "name": "HSBC Hong Kong",
  "bank_code_type": "SWIFT",
  "bank_code": "HSBCHKHH",
  "account_number": "000123456",
  "bank_country_code": "HKG",
  "bank_city": "Hong Kong",
  "international_bank_name": "HSBC"
}`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">7.5 Journals</h3>
                <p className="text-slate-600">Internal transfers between accounts:</p>
                <CodeBlock label="POST /v1/journals">{`{
  "from_account": "account-id-A",
  "to_account": "account-id-B",
  "entry_type": "JNLC",
  "amount": "1000.00"
}`}</CodeBlock>
                <p className="text-slate-600"><code className="bg-slate-100 px-1 rounded">entry_type</code>: <code className="bg-slate-100 px-1 rounded">JNLC</code> (cash) or <code className="bg-slate-100 px-1 rounded">JNLS</code> (security)</p>
              </CardContent>
            </Card>

            {/* 8. Trading */}
            <Card id="trading">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> 8. Trading System</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Order Submission</h3>
                <CodeBlock label="POST /v2/orders">{`{
  "symbol": "AAPL",
  "qty": 1,
  "side": "buy",
  "type": "market",
  "time_in_force": "day",
  "client_order_id": "my-order-001"
}`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Order Types</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Type</th><th className="text-left p-3 font-semibold">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-mono text-xs">market</td><td className="p-3">Execute at best available price</td></tr>
                      <tr><td className="p-3 font-mono text-xs">limit</td><td className="p-3">Execute at specified price or better</td></tr>
                      <tr><td className="p-3 font-mono text-xs">stop</td><td className="p-3">Stop order (triggers market order)</td></tr>
                      <tr><td className="p-3 font-mono text-xs">stop_limit</td><td className="p-3">Stop-limit order</td></tr>
                      <tr><td className="p-3 font-mono text-xs">trailing_stop</td><td className="p-3">Trailing stop order</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Time in Force (TIF)</h3>
                <div className="flex flex-wrap gap-2">
                  {['day', 'gtc', 'opg', 'cls', 'ioc', 'fok'].map(t => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Order Lifecycle</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-mono">
                  new → partially_filled → filled<br/>
                  {'  ↓        ↓'}<br/>
                  rejected  canceled<br/>
                  {'           ↓'}<br/>
                  {'           expired'}
                </div>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Position Management</h3>
                <CodeBlock>{`GET /v2/positions              # List all positions
GET /v2/positions/{symbol}    # Get specific position
DELETE /v2/positions/{symbol} # Close position`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Market Data</h3>
                <CodeBlock>{`GET /v2/stocks/{symbol}/quotes/latest   # Latest quote
GET /v2/stocks/{symbol}/bars            # Historical bars
GET /v2/stocks/{symbol}/trades/latest   # Latest trades`}</CodeBlock>
              </CardContent>
            </Card>

            {/* 9. SSE */}
            <Card id="sse">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Radio className="w-5 h-5 text-blue-600" /> 8. Real-Time Events (SSE)</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Server-Sent Events stream real-time updates for account status changes, trade executions, and transfers.</p>
                <CodeBlock label="JavaScript">{`const eventSource = new EventSource(
  'https://broker-api.sandbox.eve.markets/v1/events?token=YOUR_TOKEN'
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
  // Deduplicate using data.at field
};`}</CodeBlock>

                <h3 className="font-semibold text-slate-800 mt-4 mb-2">Event Types</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr><th className="text-left p-3 font-semibold">Event</th><th className="text-left p-3 font-semibold">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-mono text-xs">accounts.updated</td><td className="p-3">Account status changed</td></tr>
                      <tr><td className="p-3 font-mono text-xs">trades.executed</td><td className="p-3">Order filled</td></tr>
                      <tr><td className="p-3 font-mono text-xs">transfers.completed</td><td className="p-3">Transfer completed</td></tr>
                      <tr><td className="p-3 font-mono text-xs">journals.processed</td><td className="p-3">Journal processed</td></tr>
                      <tr><td className="p-3 font-mono text-xs">non_trading_day</td><td className="p-3">Market holiday notification</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700"><strong>SSE events may duplicate</strong> — always deduplicate using the <code className="bg-amber-100 px-1 rounded">at</code> timestamp field.</p>
                </div>
              </CardContent>
            </Card>

            {/* 10-18: Brief sections */}
            <Card id="rebalancing">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /> 9. Portfolio Rebalancing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Automated portfolio rebalancing lets you define target allocations and execute trades to maintain them.</p>
                <CodeBlock label="POST /v1/rebalancing/runs">{`{
  "account_id": "account-uuid",
  "portfolio_type": "predefined",
  "portfolio_name": "Tech Focus",
  "allocation": {
    "AAPL": 0.40,
    "MSFT": 0.30,
    "GOOGL": 0.30
  }
}`}</CodeBlock>
                <p className="text-slate-600 mt-2">The API calculates required trades and executes them automatically.</p>
              </CardContent>
            </Card>

            <Card id="ipo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" /> 10. IPO Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Participate in Initial Public Offerings for eligible accounts.</p>
                <CodeBlock label="POST /v1/ipo/subscriptions">{`{
  "account_id": "account-uuid",
  "ipo_id": "ipo-uuid",
  "shares": 100,
  "price_limit": "50.00"
}`}</CodeBlock>
                <p className="text-slate-600 mt-2">Status flow: <StatusBadge status="PENDING → ALLOCATED → CONFIRMED" type="info" /></p>
              </CardContent>
            </Card>

            <Card id="fixedincome">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-blue-600" /> 11. Fixed Income</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Trade Treasury bonds, corporate bonds, and other fixed-income securities.</p>
                <CodeBlock>{`GET /v1/treasuries          # List available treasuries
POST /v1/orders            # Submit bond order with CUSIP`}</CodeBlock>
              </CardContent>
            </Card>

            <Card id="eod">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarClock className="w-5 h-5 text-blue-600" /> 12. End-of-Day & Reconciliation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Daily reconciliation processes run at market close to ensure consistency between Eve and Apex Clearing.</p>
                <ul className="text-sm text-slate-600 list-disc pl-5 mt-2 space-y-1">
                  <li>Position reconciliation</li>
                  <li>Cash balance reconciliation</li>
                  <li>Trade settlement confirmation</li>
                  <li>Corporate action processing</li>
                  <li>Monthly statements auto-generated</li>
                </ul>
                <CodeBlock>{`GET /v1/account/portfolio/{account_id}  # End-of-day snapshot
GET /v1/statements                     # List statements`}</CodeBlock>
              </CardContent>
            </Card>

            <Card id="extended">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plane className="w-5 h-5 text-blue-600" /> 13. 24/5 Extended Trading</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Eve supports extended-hours trading for 5 days a week, enabling pre-market and after-hours order execution.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-blue-500 font-medium">Pre-Market</p>
                    <p className="text-lg font-bold text-blue-800">4:00 - 9:30 AM ET</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-green-500 font-medium">Regular Hours</p>
                    <p className="text-lg font-bold text-green-800">9:30 AM - 4:00 PM ET</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-purple-500 font-medium">After Hours</p>
                    <p className="text-lg font-bold text-purple-800">4:00 - 8:00 PM ET</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="managed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FolderCog className="w-5 h-5 text-blue-600" /> 14. Managed Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Managed (custody) accounts allow advisors to trade on behalf of clients.</p>
                <CodeBlock label="POST /v1/accounts">{`{
  "account_type": "trading",
  "managed": true,
  "manager_id": "advisor-uuid"
}`}</CodeBlock>
              </CardContent>
            </Card>

            <Card id="acat">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-blue-600" /> 15. ACAT Transfers</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-slate-600">Automated Customer Account Transfer (ACAT) for moving assets between brokerages.</p>
                <CodeBlock label="POST /v1/acat/transfers">{`{
  "account_id": "account-uuid",
  "transfer_type": "FULL",
  "contra_broker": "DTC#",
  "contra_account_number": "12345678"
}`}</CodeBlock>
                <p className="text-slate-600 mt-2">Status: <StatusBadge status="PENDING → IN_PROGRESS → COMPLETED" type="info" /></p>
              </CardContent>
            </Card>

            <Card id="integration">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plug className="w-5 h-5 text-blue-600" /> 16. Integration Guide</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Step-by-Step Integration</h3>
                <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-2">
                  <li><strong>Register</strong> — Contact Eve to obtain <code className="bg-slate-100 px-1 rounded">client_id</code> and <code className="bg-slate-100 px-1 rounded">client_secret</code></li>
                  <li><strong>Sandbox testing</strong> — Use sandbox environment for all development</li>
                  <li><strong>Implement OAuth2</strong> — Client Credentials flow, cache tokens for 15 min</li>
                  <li><strong>Build onboarding flow</strong> — Account creation + KYC + Onfido</li>
                  <li><strong>Integrate Plaid</strong> — Bank linking for ACH transfers</li>
                  <li><strong>Implement SSE listener</strong> — Real-time event handling</li>
                  <li><strong>Go live</strong> — Switch endpoints to production, test with small amounts</li>
                </ol>

                <h3 className="font-semibold text-slate-800 mt-6 mb-2">Recommended Tech Stack</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500">Backend</p><p className="text-sm font-medium">Node.js / Python / Go</p></div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500">Frontend</p><p className="text-sm font-medium">React / Vue / Angular</p></div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500">KYC Vendor</p><p className="text-sm font-medium">Onfido / Jumio / Plaid IDV</p></div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500">Bank Linking</p><p className="text-sm font-medium">Plaid</p></div>
                </div>
              </CardContent>
            </Card>

            <Card id="faq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-600" /> 17. FAQ</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-slate-800">Q: How long do access tokens last?</p>
                    <p className="text-slate-600 text-sm">A: 15 minutes. Cache and reuse until expiry.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Q: What is the difference between the three partnership models?</p>
                    <p className="text-slate-600 text-sm">A: Fully-Disclosed = individual accounts per customer; Omnibus = one master account with your internal books; RIA = for registered investment advisors.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Q: Who handles KYC?</p>
                    <p className="text-slate-600 text-sm">A: In Trading App / RIA mode, Eve handles KYC. In Fully-Disclosed mode, you handle KYC and submit results via CIP endpoint.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Q: How do I handle ACTION_REQUIRED status?</p>
                    <p className="text-slate-600 text-sm">A: Upload the requested supplementary documents (utility bill, ID, SSN card) via the document upload endpoint.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Q: Are transfers instant in production?</p>
                    <p className="text-slate-600 text-sm">A: No — only in sandbox. In production, ACH transfers take 1-3 business days; wires are typically same-day.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Q: How often must W-8BEN be renewed?</p>
                    <p className="text-slate-600 text-sm">A: Every 3 years (signing year + 3 years).</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center py-6">
              <p className="text-xs text-slate-400">© 2004 EVE FINANCE. All rights reserved. Eve Broker API Documentation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}