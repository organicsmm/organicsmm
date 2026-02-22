import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalMarkup } from './useGlobalMarkup';
import type { Service } from '@/lib/supabase';

/**
 * Fetches active services with the global admin markup applied to prices.
 * Use this hook everywhere services are displayed to users.
 */
export function useServices() {
  const { applyMarkup, markupPercent, isLoading: markupLoading } = useGlobalMarkup();

  const { data: rawServices, isLoading: servicesLoading, ...rest } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Service[];
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Apply global markup to all service prices
  const services = rawServices?.map(s => ({
    ...s,
    price: Math.max(0, applyMarkup(s.price)),
  }));

  return { 
    services, 
    isLoading: servicesLoading || markupLoading,
    markupPercent,
    ...rest 
  };
}
