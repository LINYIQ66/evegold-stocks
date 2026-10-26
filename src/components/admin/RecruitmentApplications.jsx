import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/common/LanguageProvider';
import { careerCopy } from '@/components/careers/careerCopy';
import RecruitmentApplicationDetail from '@/components/admin/RecruitmentApplicationDetail';

export default function RecruitmentApplications({ adminId }) {
  const { language } = useLanguage();
  const copy = careerCopy[language === 'zh' ? 'zh' : 'en'];
  const [selected, setSelected] = useState(null);
  const query = useInfiniteQuery({
    queryKey: ['recruitment-applications', adminId],
    initialPageParam: null,
    queryFn: ({ pageParam }) => base44.entities.JobApplication.list({ sort: '-created_date', limit: 20, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
    enabled: Boolean(adminId),
    gcTime: 0
  });
  const applications = query.data?.pages.flatMap(page => page.items) || [];
  return (
    <section className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{copy.reviewTitle}</h2><button onClick={() => query.refetch()} disabled={query.isFetching} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50">{copy.refresh}</button></div>
      {query.isLoading ? <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />{copy.loading}</p> : query.isError ? <p role="alert" className="text-sm text-destructive">{copy.loadError}</p> : !applications.length ? <p className="py-8 text-center text-sm text-muted-foreground">{copy.empty}</p> : <div className="space-y-3">{applications.map(item => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div className="min-w-0"><h3 className="font-semibold">{item.full_name}</h3><p className="mt-1 break-words text-sm text-muted-foreground">{item.contact_details}</p><p className="mt-2 text-xs text-muted-foreground">{copy.received}: {new Date(item.created_date).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-GB')}</p></div><button onClick={() => setSelected(item)} className="rounded-lg bg-desk-navy px-4 py-2 text-sm text-desk-silver">{copy.details}</button></article>)}</div>}
      {query.hasNextPage && <button onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage} className="mt-5 rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50">{query.isFetchingNextPage ? copy.loading : copy.more}</button>}
      {selected && <RecruitmentApplicationDetail key={selected.id} application={selected} onClose={() => setSelected(null)} copy={copy} />}
    </section>
  );
}