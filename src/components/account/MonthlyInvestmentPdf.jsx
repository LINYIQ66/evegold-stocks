import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit' }).formatToParts(new Date());
const sgYear = parts.find(p => p.type === 'year').value;
const sgMonth = parts.find(p => p.type === 'month').value;
const previousMonth = new Date(`${sgYear}-${sgMonth}-01T00:00:00Z`);
previousMonth.setUTCMonth(previousMonth.getUTCMonth() - 1);

export default function MonthlyInvestmentPdf({ users }) {
  const [month, setMonth] = useState(previousMonth.toISOString().slice(0, 7));
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await base44.functions.invoke('generateMonthlyInvestmentStatement', { month, ...(users ? { userEmail: email } : {}) });
      const { filename, pdfBase64 } = response.data;
      const binary = atob(pdfBase64);
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Unable to generate statement.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="space-y-3 border-t pt-4">
    <h3 className="font-semibold">Monthly investment statement (PDF)</h3>
    <p className="text-sm text-muted-foreground">Completed stock and precious metal trades, by Singapore calendar month.</p>
    <div className="flex flex-col sm:flex-row gap-2">
      {users && <select aria-label="Client" className="h-10 rounded-md border bg-background px-3" value={email} onChange={e => setEmail(e.target.value)}><option value="">Select client</option>{users.map(u => <option key={u.id} value={u.email}>{u.full_name || u.email} ({u.email})</option>)}</select>}
      <input aria-label="Statement month" type="month" className="h-10 rounded-md border bg-background px-3" value={month} onChange={e => setMonth(e.target.value)} />
      <Button onClick={download} disabled={busy || !month || (users && !email)}>{busy ? 'Generating PDF...' : 'Download monthly PDF'}</Button>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}