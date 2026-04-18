const BLOCKLIST = [
  '시발', '씨발', '씨빨', '씹', '좆', '지랄', '병신', '멍청',
  '개새끼', '꺼져', '닥쳐', '미친놈', '미친년', '느금마', '엠창',
  '한남', '한녀', '틀딱', '급식충', '맘충',
];

const CHEER_RATE_KEY = 'cheerRateLimit';
const MAX_CHEERS_PER_HOUR = 3;

export function containsProfanity(text) {
  const normalized = text.replace(/\s/g, '').toLowerCase();
  return BLOCKLIST.some((word) => normalized.includes(word));
}

export function checkCheerRateLimit() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  try {
    const stored = JSON.parse(localStorage.getItem(CHEER_RATE_KEY) || '[]');
    const recent = stored.filter((ts) => ts > oneHourAgo);

    if (recent.length >= MAX_CHEERS_PER_HOUR) {
      return { allowed: false, message: '응원은 1시간에 3번까지 가능해요. 잠시 후 다시 시도해주세요!' };
    }

    return { allowed: true, remaining: MAX_CHEERS_PER_HOUR - recent.length };
  } catch {
    return { allowed: true, remaining: MAX_CHEERS_PER_HOUR };
  }
}

export function recordCheer() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  try {
    const stored = JSON.parse(localStorage.getItem(CHEER_RATE_KEY) || '[]');
    const recent = [...stored.filter((ts) => ts > oneHourAgo), now];
    localStorage.setItem(CHEER_RATE_KEY, JSON.stringify(recent));
  } catch {
    localStorage.setItem(CHEER_RATE_KEY, JSON.stringify([now]));
  }
}
