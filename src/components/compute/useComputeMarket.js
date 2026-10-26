import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useComputeMarket() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = base44.entities.SystemSetting.subscribe(event => {
      if (event.data?.setting_key === 'compute_market_prices_v1') queryClient.invalidateQueries({ queryKey: ['compute-market-prices'] });
    });
    return unsubscribe;
  }, [queryClient]);
  return useQuery({
    queryKey: ['compute-market-prices'],
    queryFn: async () => {
      const page = await base44.entities.SystemSetting.filter({ setting_key: 'compute_market_prices_v1' }, { sort: '-updated_date', limit: 1 });
      return page.items[0]?.setting_value || null;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
    retry: false
  });
}