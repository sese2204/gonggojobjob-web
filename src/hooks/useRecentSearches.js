import { useState, useCallback } from 'react';

const STORAGE_KEY = 'recentSearches';
const MAX_ITEMS = 5;

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function useRecentSearches() {
  const [searches, setSearches] = useState(loadFromStorage);

  const save = useCallback((tags, query, searchTab) => {
    if (!tags || tags.length === 0) return;
    const entry = { tags, query: query || '', searchTab, timestamp: Date.now() };
    const prev = loadFromStorage().filter(
      (s) => !(JSON.stringify(s.tags) === JSON.stringify(tags) && s.searchTab === searchTab)
    );
    const updated = [entry, ...prev].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSearches(updated);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSearches([]);
  }, []);

  return { searches, save, clear };
}
