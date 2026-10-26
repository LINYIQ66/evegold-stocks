import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ComputeInquiryDetail({ inquiry, copy, onClose }) {
  const fields = [
    [copy.name, inquiry.contact_name], [copy.company, inquiry.company || '—'], [copy.contact, inquiry.contact_details],
    [copy.type, copy[inquiry.request_type]], [copy.model, inquiry.gpu_model], [copy.count, inquiry.gpu_count],
    [copy.region, inquiry.region], [copy.start, inquiry.start_date], [copy.duration, inquiry.duration_months],
    [copy.requirements, inquiry.requirements || '—']
  ];
  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{copy.adminTitle} · {inquiry.contact_name}</DialogTitle></DialogHeader><dl className="mt-3 grid gap-5 text-sm sm:grid-cols-2">{fields.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-2 break-words whitespace-pre-wrap leading-relaxed">{value}</dd></div>)}</dl><p className="mt-4 text-xs text-muted-foreground">{copy.deskNote}</p></DialogContent>
    </Dialog>
  );
}