import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useUraniumPrices() {
  return useQuery({
    queryKey: ['uranium-market-prices'],
    queryFn: async () => {
      const page = await base44.entities.SystemSetting.filter({ setting_key: 'uranium_market_prices_v1' }, { sort: '-updated_date', limit: 1 });
      return page.items[0]?.setting_value || null;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false
  });
}