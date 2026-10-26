import React from 'react';
import { CheckCircle2, Loader2, LockKeyhole } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useDeskLanguage from '@/components/uranium/useDeskLanguage';
import useRecruitmentForm from '@/components/careers/useRecruitmentForm';
import { careerCopy } from '@/components/careers/careerCopy';

export default function RecruitmentForm() {
  const [language] = useDeskLanguage();
  const copy = careerCopy[language];
  const { values, error, busy, submitted, change, selectFile, submit } = useRecruitmentForm(copy);
  if (submitted) return <div role="status" className="mt-6 rounded-xl border border-border bg-muted p-6"><CheckCircle2 className="h-6 w-6 text-desk-navy" /><h3 className="mt-3 font-semibold">{copy.success}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.successNote}</p></div>;
  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm font-medium" htmlFor="career-name"><span>{copy.name} *</span><Input id="career-name" name="full_name" autoComplete="name" required maxLength={120} value={values.full_name} onChange={change} /></label>
          <label className="block space-y-2 text-sm font-medium" htmlFor="career-contact"><span>{copy.contact} *</span><Input id="career-contact" name="contact_details" required minLength={3} maxLength={200} value={values.contact_details} onChange={change} placeholder={copy.contactHint} /></label>
        </div>
        <label className="block space-y-2 text-sm font-medium" htmlFor="career-intro"><span>{copy.introduction} *</span><Textarea id="career-intro" name="introduction" required rows={5} maxLength={5000} value={values.introduction} onChange={change} placeholder={copy.introductionHint} /></label>
        <label className="block space-y-2 text-sm font-medium" htmlFor="career-resume"><span>{copy.resume} *</span><Input id="career-resume" type="file" accept=".pdf,.doc,.docx" required onChange={selectFile} /><span className="block text-xs font-normal text-muted-foreground">{copy.fileHint}</span></label>
      </fieldset>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />{copy.privacy}</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-desk-navy px-5 py-3 text-sm font-semibold text-desk-silver disabled:cursor-not-allowed disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? copy.submitting : copy.submit}</button>
    </form>
  );
}