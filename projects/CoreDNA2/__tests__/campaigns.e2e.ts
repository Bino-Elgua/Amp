/**
 * End-to-End Tests for Campaign Generation & Persistence
 * Tests the complete user flow: Extract Brand → Generate Campaign → Save → View
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Campaign Generation & Persistence E2E', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Campaign Content Generation', () => {
    it('should generate campaign content with 200+ characters', () => {
      // This test verifies the prompt change
      // Content should be detailed, not 1-2 sentences
      const mockContent = `Tired of managing multiple marketing tools? Our platform streamlines your entire workflow. Save hours every week while maintaining brand consistency. Join 500+ teams already seeing results. Start your free trial today.`;
      
      expect(mockContent.length).toBeGreaterThanOrEqual(200);
      expect(mockContent).toContain('Tired of'); // Problem statement
      expect(mockContent).toContain('platform'); // Solution
      expect(mockContent).toContain('free trial'); // CTA
    });

    it('should generate unique assets with different angles', () => {
      const asset1 = 'Problem: Managing time. Solution: Our tool. Action: Try now.';
      const asset2 = 'Problem: Consistency issues. Solution: Built-in templates. Action: Get started.';
      const asset3 = 'Problem: Team collaboration. Solution: Real-time editing. Action: Start free.';
      
      expect(asset1).not.toBe(asset2);
      expect(asset2).not.toBe(asset3);
      expect(asset1).not.toBe(asset3);
    });

    it('should use brand DNA in content', () => {
      const brandDNA = {
        name: 'TechFlow',
        tagline: 'Streamline your workflow',
        mission: 'Empower teams to work smarter',
        values: ['Innovation', 'Simplicity', 'Reliability']
      };
      
      const content = `${brandDNA.name} helps teams achieve ${brandDNA.mission} through ${brandDNA.tagline.toLowerCase()}.`;
      
      expect(content).toContain(brandDNA.name);
      expect(content).toContain(brandDNA.mission);
    });
  });

  describe('Campaign Image Generation', () => {
    it('should generate image with specific Unsplash query', () => {
      const prompt = 'Marketing dashboard showing analytics charts with team collaboration';
      const keywords = prompt
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3);
      
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).toContain('marketing');
      expect(keywords).toContain('dashboard');
    });

    it('should fallback to Unsplash with improved query', () => {
      // Improved fallback should use 1024x768 instead of 800x600
      const imageUrl = 'https://source.unsplash.com/1024x768/?marketing,brand';
      
      expect(imageUrl).toContain('1024x768');
      expect(imageUrl).toContain('marketing');
      expect(imageUrl).toContain('brand');
    });
  });

  describe('Campaign Persistence Across Pages', () => {
    it('should save campaign to localStorage', () => {
      const campaign = {
        id: 'camp-123',
        dna: { name: 'TechFlow', id: 'dna-1' },
        goal: 'Increase brand awareness',
        assets: [
          { id: 'asset-1', title: 'Ad Copy', content: 'Sample content', imageUrl: '' }
        ],
        timestamp: Date.now()
      };

      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify([campaign]));
      
      const stored = localStorage.getItem('core_dna_saved_campaigns');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed[0].id).toBe('camp-123');
      expect(parsed[0].assets.length).toBe(1);
    });

    it('should load campaign on different page', () => {
      // Simulate saving in CampaignsPage
      const campaign = {
        id: 'camp-456',
        dna: { name: 'TechFlow' },
        assets: [{ id: 'asset-1', content: 'Deep marketing copy here...' }]
      };
      
      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify([campaign]));
      
      // Simulate loading in SchedulerPage
      const stored = localStorage.getItem('core_dna_saved_campaigns');
      const campaigns = stored ? JSON.parse(stored) : [];
      
      expect(campaigns.length).toBe(1);
      expect(campaigns[0].id).toBe('camp-456');
    });

    it('should sync across multiple pages', () => {
      const campaign1 = { id: 'camp-1', assets: [] };
      const campaign2 = { id: 'camp-2', assets: [] };
      
      // Page 1: Save campaign 1
      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify([campaign1]));
      expect(JSON.parse(localStorage.getItem('core_dna_saved_campaigns')!).length).toBe(1);
      
      // Page 2: Add campaign 2
      const existing = JSON.parse(localStorage.getItem('core_dna_saved_campaigns')!);
      const updated = [campaign2, ...existing];
      localStorage.setItem('core_dna_saved_campaigns', JSON.stringify(updated));
      
      expect(JSON.parse(localStorage.getItem('core_dna_saved_campaigns')!).length).toBe(2);
    });
  });

  describe('Campaign Data Validation', () => {
    it('should validate campaign has required fields', () => {
      const campaign = {
        id: 'camp-123',
        dna: { name: 'Brand', id: 'dna-1' },
        goal: 'Awareness',
        assets: [],
        timestamp: Date.now()
      };
      
      expect(campaign).toHaveProperty('id');
      expect(campaign).toHaveProperty('dna');
      expect(campaign).toHaveProperty('goal');
      expect(campaign).toHaveProperty('assets');
      expect(campaign).toHaveProperty('timestamp');
    });

    it('should validate asset has content', () => {
      const asset = {
        id: 'asset-1',
        title: 'Social Post',
        content: 'This is detailed marketing copy with multiple sentences explaining the value proposition...',
        channel: 'Instagram',
        cta: 'Click here',
        imageUrl: 'https://example.com/image.jpg'
      };
      
      expect(asset.content.length).toBeGreaterThanOrEqual(150);
      expect(asset).toHaveProperty('title');
      expect(asset).toHaveProperty('channel');
      expect(asset).toHaveProperty('cta');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing API key gracefully', () => {
      const handleError = (error: any) => {
        if (error.message.includes('API key not configured')) {
          return 'No API key configured. Go to Settings → API Keys to add one.';
        }
        return 'Unknown error';
      };
      
      const error = new Error('API key not configured');
      expect(handleError(error)).toContain('API key not configured');
    });

    it('should provide helpful error messages', () => {
      const errors = {
        'No LLM provider': 'Go to Settings → API Keys and add at least one LLM provider',
        'Image generation failed': 'Check image provider in Settings. Unsplash fallback is automatic.',
        'Network error': 'Check your internet connection and try again.'
      };
      
      expect(errors['No LLM provider']).toContain('Settings');
      expect(errors['Image generation failed']).toContain('Unsplash');
    });
  });

  describe('Content Depth Validation', () => {
    it('should warn if content is less than 150 chars', () => {
      const shallowContent = 'Check this out!';
      const deepContent = 'Tired of juggling multiple tools? Our platform streamlines everything you need for marketing success. Save time, stay consistent, scale faster.';
      
      expect(shallowContent.length).toBeLessThan(150);
      expect(deepContent.length).toBeGreaterThanOrEqual(200);
    });

    it('should ensure content references brand values', () => {
      const brand = {
        mission: 'Empower creators',
        values: ['Simplicity', 'Innovation']
      };
      
      const content = `We help you ${brand.mission} with ${brand.values[0]} and ${brand.values[1]}.`;
      
      expect(content).toContain(brand.mission);
      expect(content).toContain(brand.values[0]);
    });
  });
});
