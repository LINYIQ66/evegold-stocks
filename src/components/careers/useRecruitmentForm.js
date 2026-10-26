import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useRecruitmentForm(copy) {
  const [values, setValues] = useState({ full_name: '', contact_details: '', introduction: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const uploaded = useRef(null);
  const submitting = useRef(false);
  const change = event => setValues(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const selectFile = event => {
    const selected = event.target.files?.[0];
    uploaded.current = null;
    setError('');
    if (selected && (!/\.(pdf|docx?)$/i.test(selected.name) || selected.size < 1 || selected.size > 10485760 || selected.name.length > 255)) {
      event.target.value = '';
      setFile(null);
      setError(copy.fileError);
    } else setFile(selected || null);
  };
  const submit = async event => {
    event.preventDefault();
    if (submitting.current) return;
    if (!file || !values.full_name.trim() || values.contact_details.trim().length < 3 || !values.introduction.trim()) return setError(copy.required);
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      if (!uploaded.current) uploaded.current = await base44.integrations.Core.UploadPrivateFile({ file });
      if (!uploaded.current.file_uri) throw new Error('Missing private file reference');
      await base44.entities.JobApplication.create({ full_name: values.full_name.trim(), contact_details: values.contact_details.trim(), introduction: values.introduction.trim(), resume_file_uri: uploaded.current.file_uri, resume_file_name: file.name, resume_file_size: file.size });
      setSubmitted(true);
      setValues({ full_name: '', contact_details: '', introduction: '' });
      setFile(null);
      uploaded.current = null;
    } catch (failure) {
      setError(copy.failed);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };
  return { values, error, busy, submitted, change, selectFile, submit };
}