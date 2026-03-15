import { writable } from 'svelte/store';

export const apiBaseUrl = writable(
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
);

export const phoneKey = writable(localStorage?.getItem('phoneKey') || '');

export const selectedTab = writable('search');

export const searchResults = writable([]);

export const isLoading = writable(false);

export const timelineData = writable(null);

export const darkMode = writable(true);
