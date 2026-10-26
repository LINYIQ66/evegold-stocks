import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function RecruitmentApplicationDetail({ application, onClose, copy }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: application.resume_file_uri, expires_in: 60 });
      const response = await fetch(signed_url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error('Download failed');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = application.resume_file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) { setError(copy.downloadError); }
    finally { setBusy(false); }
  };
  return (
    <Dialog open={Boolean(application)} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{copy.reviewTitle} · {application.full_name}</DialogTitle></DialogHeader>
        <dl className="space-y-5 text-sm"><div><dt className="font-semibold">{copy.contact}</dt><dd className="mt-2 break-words whitespace-pre-wrap">{application.contact_details}</dd></div><div><dt className="font-semibold">{copy.introduction}</dt><dd className="mt-2 break-words whitespace-pre-wrap leading-relaxed text-muted-foreground">{application.introduction}</dd></div><div><dt className="font-semibold">{copy.resume}</dt><dd className="mt-2 break-words">{application.resume_file_name}</dd></div></dl>
        <p className="text-xs leading-relaxed text-muted-foreground">{copy.privacy}</p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button onClick={download} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-desk-navy px-4 py-3 text-sm font-medium text-desk-silver disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}{busy ? copy.downloading : copy.download}</button>
      </DialogContent>
    </Dialog>
  );
}