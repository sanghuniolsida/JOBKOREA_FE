
import type { WorkPeriod, WorkDay, WorkHour, EmploymentType, Gender, DayOfWeek } from './types';

export const WORK_PERIODS: WorkPeriod[] = [
    '하루(1일)', '1주일이하', '1주일~1개월', '1개월~3개월', '3개월~6개월', '6개월~1년', '1년이상'
];

export const WORK_DAYS: WorkDay[] = [
    '월~금', '주말(토,일)', '주1일', '주2일', '주3일', '주4일', '주5일', '주6일'
];

export const WORK_HOURS: WorkHour[] = [
    '오전 파트', '오후 파트', '저녁 파트', '새벽 파트',
    '오전~오후 파트', '오후~저녁 파트', '저녁~새벽 파트',
    '새벽~오전 파트', '풀타임(8시간 이상)'
];

export const DAYS_OF_WEEK: DayOfWeek[] = ['월', '화', '수', '목', '금', '토', '일'];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
    '정규직', '계약직', '인턴', '아르바이트', '프리랜서'
];

export const GENDERS: Gender[] = ['무관', '남성', '여성'];