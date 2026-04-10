export const STATUS_CONFIG = {
  NOT_APPLIED:  { label: '미지원',    color: 'bg-gray-100 text-gray-700' },
  APPLIED:      { label: '지원완료',  color: 'bg-blue-50 text-blue-700' },
  INTERVIEWING: { label: '면접 진행', color: 'bg-yellow-50 text-yellow-700' },
  REJECTED:     { label: '불합격',    color: 'bg-red-50 text-red-700' },
  OFFERED:      { label: '합격',      color: 'bg-green-50 text-green-700' },
};

export const STATUS_FILTERS = [
  { key: '',             label: '전체' },
  { key: 'NOT_APPLIED',  label: '미지원' },
  { key: 'APPLIED',      label: '지원완료' },
  { key: 'INTERVIEWING', label: '면접 진행' },
  { key: 'REJECTED',     label: '불합격' },
  { key: 'OFFERED',      label: '합격' },
];

export const TYPE_FILTERS = [
  { key: '',         label: '전체' },
  { key: 'JOB',      label: '채용공고' },
  { key: 'ACTIVITY', label: '대외활동' },
];
