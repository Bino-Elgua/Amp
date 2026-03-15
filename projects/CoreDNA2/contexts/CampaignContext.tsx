import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SavedCampaign } from '../types';

interface CampaignContextType {
  campaigns: SavedCampaign[];
  loading: boolean;
  error: string | null;
  loadCampaigns: () => Promise<void>;
  saveCampaign: (campaign: SavedCampaign) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  updateCampaign: (id: string, campaign: SavedCampaign) => Promise<void>;
}

export const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load campaigns from localStorage on mount
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[CampaignProvider] Loading campaigns from localStorage...');
      
      const stored = localStorage.getItem('core_dna_saved_campaigns');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCampaigns(Array.isArray(parsed) ? parsed : []);
        console.log(`[CampaignProvider] ✓ Loaded ${parsed.length} campaigns`);
      } else {
        setCampaigns([]);
        console.log('[CampaignProvider] No campaigns found in localStorage');
      }
    } catch (err: any) {
      const errorMsg = `Failed to load campaigns: ${err?.message}`;
      console.error('[CampaignProvider] ✗ Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Save a campaign to localStorage
  const saveCampaign = async (campaign: SavedCampaign) => {
    try {
      console.log('[CampaignProvider] Saving campaign:', campaign.id);
      const updated = [campaign, ...campaigns.filter(c => c.id !== campaign.id)];
      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify(updated));
      setCampaigns(updated);
      console.log('[CampaignProvider] ✓ Campaign saved:', campaign.id);
    } catch (err: any) {
      const errorMsg = `Failed to save campaign: ${err?.message}`;
      console.error('[CampaignProvider] ✗ Error:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  // Delete a campaign from localStorage
  const deleteCampaign = async (id: string) => {
    try {
      console.log('[CampaignProvider] Deleting campaign:', id);
      const updated = campaigns.filter(c => c.id !== id);
      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify(updated));
      setCampaigns(updated);
      console.log('[CampaignProvider] ✓ Campaign deleted:', id);
    } catch (err: any) {
      const errorMsg = `Failed to delete campaign: ${err?.message}`;
      console.error('[CampaignProvider] ✗ Error:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  // Update a campaign in localStorage
  const updateCampaign = async (id: string, campaign: SavedCampaign) => {
    try {
      console.log('[CampaignProvider] Updating campaign:', id);
      const updated = campaigns.map(c => c.id === id ? campaign : c);
      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify(updated));
      setCampaigns(updated);
      console.log('[CampaignProvider] ✓ Campaign updated:', id);
    } catch (err: any) {
      const errorMsg = `Failed to update campaign: ${err?.message}`;
      console.error('[CampaignProvider] ✗ Error:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'core_dna_saved_campaigns' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCampaigns(Array.isArray(parsed) ? parsed : []);
          console.log('[CampaignProvider] ✓ Campaigns updated from another tab');
        } catch (err) {
          console.error('[CampaignProvider] Error parsing storage change:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: CampaignContextType = {
    campaigns,
    loading,
    error,
    loadCampaigns,
    saveCampaign,
    deleteCampaign,
    updateCampaign
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

// Custom hook to use Campaign Context
export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
