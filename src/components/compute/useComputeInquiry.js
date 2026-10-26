import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useComputeInquiry(copy) {
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const running = useRef(false);
  const submit = async event => {
    event.preventDefault();
    if (running.current) return;
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    for (const key of ['contact_name', 'company', 'contact_details', 'region', 'requirements']) data[key] = String(data[key] || '').trim();
    data.gpu_count = Number(data.gpu_count);
    data.duration_months = Number(data.duration_months);
    const today = new Date().toISOString().slice(0, 10);
    if (!data.contact_name || data.contact_details.length < 3 || !data.region || !Number.isInteger(data.gpu_count) || data.gpu_count < 1 || data.gpu_count > 100000 || !Number.isInteger(data.duration_months) || data.duration_months < 1 || data.duration_months > 60 || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.start_date)) || data.start_date < today) return setError(copy.invalid);
    running.current = true;
    setBusy(true);
    setError('');
    try {
      await base44.entities.ComputeInquiry.create(data);
      setSubmitted(true);
    } catch (failure) { setError(copy.failed); }
    finally { running.current = false; setBusy(false); }
  };
  return { busy, submitted, error, submit };
}