/**
 * React Hook for Council API Integration
 * Task 7: Council Button in OpenWebUI
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

interface AgentVote {
  agent_id: string;
  position: string;
  confidence: number;
  reasoning: string;
}

interface DeliberationResult {
  topic: string;
  consensus_score: number;
  consensus_reached: boolean;
  votes: AgentVote[];
  chairman_summary: string;
  recommendation?: string;
  disagreement_severity: number;
}

export const useCouncil = (baseUrl = 'http://localhost:8000') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeliberationResult | null>(null);

  /**
   * Send a prompt to the council for deliberation
   */
  const deliberate = useCallback(
    async (
      topic: string,
      context?: string,
      numAgents: number = 3
    ): Promise<DeliberationResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post<DeliberationResult>(
          `${baseUrl}/api/council/deliberate`,
          {
            topic,
            context,
            num_agents: numAgents,
          },
          {
            timeout: 60000, // 60s timeout for deliberation
          }
        );

        setResult(response.data);
        return response.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to get council deliberation';
        setError(message);
        console.error('Council deliberation error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  /**
   * Get list of available agents
   */
  const getAgents = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/council/agents`);
      return response.data.agents;
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      return [];
    }
  }, [baseUrl]);

  /**
   * Get service health status
   */
  const getHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${baseUrl}/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  }, [baseUrl]);

  /**
   * Clear current result
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    deliberate,
    getAgents,
    getHealth,
    clearResult,
    result,
    loading,
    error,
  };
};

export default useCouncil;
