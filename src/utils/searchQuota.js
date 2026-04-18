const QUOTA_KEYS = {
  jobs: { loggedIn: 'searchLimitLoggedIn', guest: 'searchLimit' },
  activities: { loggedIn: 'activitySearchLimitLoggedIn', guest: 'activitySearchLimit' },
};

const MAX_COUNTS = { loggedIn: 5, guest: 5 };

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getLimitKey(searchType, isLoggedIn) {
  const keys = QUOTA_KEYS[searchType] || QUOTA_KEYS.jobs;
  return isLoggedIn ? keys.loggedIn : keys.guest;
}

function readStored(limitKey) {
  try {
    return JSON.parse(localStorage.getItem(limitKey) || '{}');
  } catch {
    return {};
  }
}

export function getQuotaInfo(isLoggedIn, searchType = 'jobs') {
  const limitKey = getLimitKey(searchType, isLoggedIn);
  const maxCount = isLoggedIn ? MAX_COUNTS.loggedIn : MAX_COUNTS.guest;
  const today = getToday();
  const stored = readStored(limitKey);
  const count = stored.date === today ? stored.count : 0;

  return {
    count,
    maxCount,
    remaining: Math.max(0, maxCount - count),
    isExhausted: count >= maxCount,
    limitKey,
  };
}

export function incrementQuota(limitKey) {
  const today = getToday();
  const stored = readStored(limitKey);
  const count = stored.date === today ? stored.count : 0;
  localStorage.setItem(limitKey, JSON.stringify({ date: today, count: count + 1 }));
}

export function rollbackQuota(limitKey) {
  const today = getToday();
  const stored = readStored(limitKey);
  if (stored.date === today && stored.count > 0) {
    localStorage.setItem(limitKey, JSON.stringify({ date: today, count: stored.count - 1 }));
  }
}
