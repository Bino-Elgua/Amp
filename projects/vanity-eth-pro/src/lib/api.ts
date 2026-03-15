/**
 * API Client for ÀṣẹMirror
 */

export async function apiCall(
  action: string,
  payload: any = {},
  phoneKey: string = ''
) {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${phoneKey}`,
    },
    body: JSON.stringify({ action, phoneKey, ...payload }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function search(query: string, phoneKey: string) {
  return apiCall('search', { query }, phoneKey);
}

export async function chat(messages: any[], phoneKey: string) {
  return apiCall('chat', { messages }, phoneKey);
}

export async function getTimeline(phoneKey: string) {
  return apiCall('timeline', {}, phoneKey);
}

export async function visualize(type: string, phoneKey: string) {
  return apiCall('visualize', { query: type }, phoneKey);
}
