import React from 'react';
import LegalDraftDocument from '@/components/legal/LegalDraftDocument';
import { termsDraft } from '@/components/legal/termsDraft';

export default function Terms() {
  return <LegalDraftDocument document={termsDraft} />;
}