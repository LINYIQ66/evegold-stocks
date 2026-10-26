import React from 'react';
import { CheckCircle2, Loader2, LockKeyhole, Phone } from 'lucide-react';
import ComputeInquiryFields from '@/components/compute/ComputeInquiryFields';
import useComputeInquiry from '@/components/compute/useComputeInquiry';

export default function ComputeInquiryForm({ copy, model, onModelChange }) {
  const { busy, submitted, error, submit } = useComputeInquiry(copy);
  return (
    <section id="compute-inquiry" className="scroll-mt-6 rounded-xl border border-border bg-background p-5 md:p-7">
      <h3 className="text-xl font-semibold">{copy.desk}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.deskNote}</p>
      {submitted ? <div role="status" className="mt-6 rounded-lg bg-muted p-6"><CheckCircle2 className="h-6 w-6 text-desk-navy" /><h4 className="mt-3 font-semibold">{copy.submitted}</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.submittedNote}</p></div> : <form onSubmit={submit} className="mt-6 space-y-5"><fieldset disabled={busy} className="space-y-5 disabled:opacity-60"><ComputeInquiryFields copy={copy} model={model} onModelChange={onModelChange} /></fieldset><p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="h-4 w-4 shrink-0" />{copy.privacy}</p>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-desk-navy px-5 py-3 text-sm font-semibold text-desk-silver disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? copy.submitting : copy.submit}</button></form>}
      <div className="mt-7 border-t border-border pt-6"><p className="text-xs text-muted-foreground">{copy.enquiries}</p><a href="tel:+6583687572" className="mt-3 inline-flex items-center gap-2 font-semibold text-desk-navy"><Phone className="h-4 w-4" />+65 8368 7572</a></div>
    </section>
  );
}