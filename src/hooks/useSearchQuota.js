import { useState, useCallback } from 'react';
import { getQuotaInfo, incrementQuota, rollbackQuota } from '../utils/searchQuota';

export default function useSearchQuota(isLoggedIn, searchType = 'jobs') {
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const info = getQuotaInfo(isLoggedIn, searchType);

  const increment = useCallback(() => {
    incrementQuota(info.limitKey);
    refresh();
  }, [info.limitKey, refresh]);

  const rollback = useCallback(() => {
    rollbackQuota(info.limitKey);
    refresh();
  }, [info.limitKey, refresh]);

  return {
    count: info.count,
    maxCount: info.maxCount,
    remaining: info.remaining,
    isExhausted: info.isExhausted,
    limitKey: info.limitKey,
    increment,
    rollback,
  };
}
