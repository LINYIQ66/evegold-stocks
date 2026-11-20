import React from 'react';
import LegalDraftDocument from '@/components/legal/LegalDraftDocument';
import { privacyDraft } from '@/components/legal/privacyDraft';

export default function Privacy() {
  return <LegalDraftDocument document={privacyDraft} />;
}