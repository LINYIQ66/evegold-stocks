import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/common/LanguageProvider';
import { computeCopy } from '@/components/compute/computeCopy';
import ComputeInquiryDetail from '@/components/admin/ComputeInquiryDetail';

export default function ComputeInquiries({ adminId }) {
  const { language } = useLanguage();
  const copy = computeCopy[language === 'zh' ? 'zh' : 'en'];
  const [selected, setSelected] = useState(null);
  const query = useInfiniteQuery({
    queryKey: ['compute-inquiries', adminId], initialPageParam: null,
    queryFn: ({ pageParam }) => base44.entities.ComputeInquiry.list({ sort: '-created_date', limit: 20, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
    enabled: Boolean(adminId), gcTime: 0
  });
  const items = query.data?.pages.flatMap(page => page.items) || [];
  return (
    <section className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{copy.adminTitle}</h2><button onClick={() => query.refetch()} disabled={query.isFetching} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50">{copy.refresh}</button></div>
      {query.isLoading ? <p className="text-sm">{copy.inquiriesLoading}</p> : query.isError ? <p role="alert" className="text-sm text-destructive">{copy.listError}</p> : !items.length ? <p className="py-8 text-center text-sm text-muted-foreground">{copy.empty}</p> : <div className="space-y-3">{items.map(item => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div className="min-w-0"><h3 className="font-semibold">{item.company || item.contact_name} · {item.gpu_model} × {item.gpu_count}</h3><p className="mt-1 break-words text-sm text-muted-foreground">{copy[item.request_type]} · {item.region} · {item.start_date}</p><p className="mt-2 text-xs text-muted-foreground">{copy.received}: {new Date(item.created_date).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-GB')}</p></div><button onClick={() => setSelected(item)} className="rounded-lg bg-desk-navy px-4 py-2 text-sm text-desk-silver">{copy.details}</button></article>)}</div>}
      {query.hasNextPage && <button onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage} className="mt-5 rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50">{query.isFetchingNextPage ? copy.inquiriesLoading : copy.more}</button>}
      {selected && <ComputeInquiryDetail inquiry={selected} copy={copy} onClose={() => setSelected(null)} />}
    </section>
  );
}