import { create } from "zustand";
import  supabase from "../supabaseClient.server";

type Campaign = {
    id: number;
    name: string;
    daily_budget: number;
  };

  type CampaignStore = {
    campaigns: Campaign[];
    loading: boolean;
    hasMore: boolean;
    fetchCampaigns: (reset?: boolean) => Promise<void>;
    updateCampaign: (id: number, data: Partial<Campaign>) => void;
    deleteCampaign: (id: number) => void;
  };

  export const useCampaignStore = create<CampaignStore>((set, get) => ({
    campaigns: [],
    loading: false,
    hasMore: true,
  
    fetchCampaigns: async (reset = false) => {
      const { campaigns, loading } = get();
      if (loading) return;
  
      set({ loading: true });
  
      const from = reset ? 0 : campaigns.length;
      const to = from + 9;
  
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('id', { ascending: false })
        .range(from, to);
  
      if (error) {
        console.error(error);
      } else {
        set({
          campaigns: reset ? data : [...campaigns, ...data],
          hasMore: data.length > 0,
        });
      }
  
      set({ loading: false });
    },
  
    updateCampaign: (id, data) => {
      set(state => ({
        campaigns: state.campaigns.map(c => (c.id === id ? { ...c, ...data } : c)),
      }));
    },
  
    deleteCampaign: id => {
      set(state => ({
        campaigns: state.campaigns.filter(c => c.id !== id),
      }));
    },
  }));