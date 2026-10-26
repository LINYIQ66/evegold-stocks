import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { gpuModels, requestTypes } from '@/components/compute/computeCatalog';

export default function ComputeInquiryFields({ copy, model, onModelChange }) {
  const inputClass = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {[['contact_name', copy.name, 120, true], ['company', copy.company, 160, false], ['contact_details', copy.contact, 200, true], ['region', copy.region, 120, true]].map(([name, label, max, required]) => <label key={name} className="space-y-2 text-sm font-medium"><span className="block">{label}{required ? ' *' : ''}</span><Input name={name} required={required} minLength={name === 'contact_details' ? 3 : undefined} maxLength={max} placeholder={name === 'contact_details' ? copy.contactHint : undefined} /></label>)}
        <label className="space-y-2 text-sm font-medium"><span className="block">{copy.type} *</span><select name="request_type" className={inputClass} defaultValue="bulk">{requestTypes.map(type => <option key={type} value={type}>{copy[type]}</option>)}</select></label>
        <label className="space-y-2 text-sm font-medium"><span className="block">{copy.model} *</span><select name="gpu_model" className={inputClass} value={model} onChange={event => onModelChange(event.target.value)}>{gpuModels.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="space-y-2 text-sm font-medium"><span className="block">{copy.count} *</span><Input name="gpu_count" type="number" min={1} max={100000} step={1} required defaultValue={8} /></label>
        <label className="space-y-2 text-sm font-medium"><span className="block">{copy.duration} *</span><Input name="duration_months" type="number" min={1} max={60} step={1} required defaultValue={3} /></label>
        <label className="space-y-2 text-sm font-medium"><span className="block">{copy.start} *</span><Input name="start_date" type="date" min={today} defaultValue={today} required /></label>
      </div>
      <label className="block space-y-2 text-sm font-medium"><span>{copy.requirements}</span><Textarea name="requirements" maxLength={3000} rows={4} /></label>
    </>
  );
}