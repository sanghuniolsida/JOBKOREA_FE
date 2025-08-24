import React, { useState, useMemo } from 'react';
import type { WorkPeriod, WorkDay, WorkHour, EmploymentType, Gender, DayOfWeek } from '../types';
import { WORK_PERIODS, WORK_DAYS, WORK_HOURS, EMPLOYMENT_TYPES, GENDERS, DAYS_OF_WEEK } from '../constants';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSection, Chip, Accordion, PlusIcon, DayPickerPopup, CustomCheckbox } from '../components/FilterComponents';

const SearchUI: React.FC = () => {
    // Core Filters
    const [selectedPeriods, setSelectedPeriods] = useState<WorkPeriod[]>([]);
    const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([]);
    const [selectedGender, setSelectedGender] = useState<Gender>(GENDERS[0]); // '무관'
    const [age, setAge] = useState('');

    // Work Day
    const [activeDayTab, setActiveDayTab] = useState<'list' | 'direct'>('list');
    const [selectedDays, setSelectedDays] = useState<WorkDay[]>([]);
    const [directlySelectedWeekdays, setDirectlySelectedWeekdays] = useState<DayOfWeek[]>([]);
    const [preferredDaysMap, setPreferredDaysMap] = useState<Partial<Record<WorkDay, DayOfWeek[]>>>({});
    const [dayPickerAnchor, setDayPickerAnchor] = useState<HTMLElement | null>(null);
    const [activeWorkDayForPopup, setActiveWorkDayForPopup] = useState<WorkDay | null>(null);

    // Work Hour
    const [activeHourTab, setActiveHourTab] = useState<'list' | 'direct'>('list');
    const [selectedWorkHours, setSelectedWorkHours] = useState<WorkHour[]>([]);
    const [excludeNegotiable, setExcludeNegotiable] = useState(false);
    const [selectedTimeRanges, setSelectedTimeRanges] = useState<{ start: string; end: string }[]>([]);
    const [directStartTime, setDirectStartTime] = useState('');
    const [directEndTime, setDirectEndTime] = useState('');

    // 파일 상단의 다른 useState들 아래에 추가
    const [includeInput, setIncludeInput] = useState('');
    const [excludeInput, setExcludeInput] = useState('');
    const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
    const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);

    // 최대 개수 (스샷 기준: 포함 20, 제외 100)
    const MAX_INCLUDE = 20;
    const MAX_EXCLUDE = 100;

    const addKeyword = (type: 'include' | 'exclude') => {
        const raw = type === 'include' ? includeInput : excludeInput;
        const token = raw.trim();
        if (!token) return;

        const list = type === 'include' ? includeKeywords : excludeKeywords;
        const setList = type === 'include' ? setIncludeKeywords : setExcludeKeywords;
        const setInput = type === 'include' ? setIncludeInput : setExcludeInput;
        const limit = type === 'include' ? MAX_INCLUDE : MAX_EXCLUDE;

        if (list.length >= limit) return;
        if (list.includes(token)) {
            setInput(''); // 중복이면 입력만 초기화
            return;
        }
        setList([...list, token]);
        setInput('');
    };

    const removeKeyword = (type: 'include' | 'exclude', idx: number) => {
        const list = type === 'include' ? includeKeywords : excludeKeywords;
        const setList = type === 'include' ? setIncludeKeywords : setExcludeKeywords;
        setList(list.filter((_, i) => i !== idx));
    };

    const onKeyDownAdd = (type: 'include' | 'exclude') => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword(type);
        }
    };


    // Limits
    const maxPeriods = 6;
    const maxDays = 3;
    const maxWorkHours = 3;
    const maxEmploymentTypes = 3;

    // Time options
    const timeOptions = useMemo(() => {
        const options: string[] = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                options.push(`${hour}:${minute}`);
            }
        }
        return options;
    }, []);

    // Generic toggle factory
    const createToggleHandler = <T,>(
        selectedItems: T[],
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        maxItems: number
    ) => (item: T) => {
        setter((prev) => {
            if (prev.includes(item)) return prev.filter((i) => i !== item);
            if (prev.length < maxItems) return [...prev, item];
            return prev;
        });
    };

    const handleTogglePeriod = createToggleHandler(selectedPeriods, setSelectedPeriods, maxPeriods);
    const handleToggleEmployment = createToggleHandler(selectedEmploymentTypes, setSelectedEmploymentTypes, maxEmploymentTypes);

    // Day handlers
    const handleCloseDayPicker = () => {
        setDayPickerAnchor(null);
        setActiveWorkDayForPopup(null);
    };

    const POPUP_TRIGGER_DAYS: WorkDay[] = ['주1일', '주2일', '주3일', '주4일', '주5일', '주6일'];

    const handleToggleDay = (day: WorkDay, event: React.MouseEvent<HTMLButtonElement>) => {
        const isSelected = selectedDays.includes(day);
        const trigger = POPUP_TRIGGER_DAYS.includes(day);

        if (isSelected) {
            setSelectedDays((prev) => prev.filter((d) => d !== day));
            if (trigger) {
                setPreferredDaysMap((prev) => {
                    const next = { ...prev };
                    delete next[day];
                    return next;
                });
            }
            if (activeWorkDayForPopup === day) handleCloseDayPicker();
            return;
        }

        if (selectedDays.length >= maxDays) return;

        setSelectedDays((prev) => [...prev, day]);

        if (trigger) {
            setDayPickerAnchor(event.currentTarget);
            setActiveWorkDayForPopup(day);
        } else {
            handleCloseDayPicker();
        }
    };

    const handleTogglePreferredDay = (day: DayOfWeek) => {
        if (!activeWorkDayForPopup) return;
        setPreferredDaysMap((prevMap) => {
            const current = prevMap[activeWorkDayForPopup] || [];
            const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
            return { ...prevMap, [activeWorkDayForPopup]: next };
        });
    };

    const handleToggleDirectWeekday = createToggleHandler(directlySelectedWeekdays, setDirectlySelectedWeekdays, 7);

    const handleDayTabSwitch = (tab: 'list' | 'direct') => {
        if (activeDayTab === tab) return;
        setActiveDayTab(tab);
        setSelectedDays([]);
        setPreferredDaysMap({});
        setDirectlySelectedWeekdays([]);
        handleCloseDayPicker();
    };

    // Hour handlers
    const handleHourTabSwitch = (tab: 'list' | 'direct') => {
        if (activeHourTab === tab) return;
        setActiveHourTab(tab);
        if (tab === 'direct') {
            setSelectedWorkHours([]);
            setExcludeNegotiable(false);
        } else {
            setSelectedTimeRanges([]);
            setDirectStartTime('');
            setDirectEndTime('');
        }
    };

    const handleToggleWorkHour = (hour: WorkHour) => {
        setExcludeNegotiable(false);
        setSelectedWorkHours((prev) => {
            if (prev.includes(hour)) return prev.filter((h) => h !== hour);
            if (prev.length < maxWorkHours) return [...prev, hour];
            return prev;
        });
    };

    const handleToggleExcludeNegotiable = () => {
        const next = !excludeNegotiable;
        setExcludeNegotiable(next);
        if (next) setSelectedWorkHours([]);
    };

    const handleAddTimeRange = () => {
        if (!directStartTime || !directEndTime || directStartTime >= directEndTime) return;
        if (selectedTimeRanges.length >= maxWorkHours) return;

        const newRange = { start: directStartTime, end: directEndTime };
        const duplicate = selectedTimeRanges.some((r) => r.start === newRange.start && r.end === newRange.end);
        if (duplicate) {
            alert('이미 추가된 시간입니다.');
            return;
        }

        setSelectedTimeRanges((prev) => [...prev, newRange]);
        setDirectStartTime('');
        setDirectEndTime('');
    };

    const handleRemoveTimeRange = (index: number) => {
        setSelectedTimeRanges((prev) => prev.filter((_, i) => i !== index));
    };

    // ✅ 초기화 핸들러: 헤더에서 호출
    const handleReset = () => {
        // Core
        setSelectedPeriods([]);
        setSelectedEmploymentTypes([]);
        setSelectedGender(GENDERS[0]);
        setAge('');

        // Day
        setActiveDayTab('list');
        setSelectedDays([]);
        setDirectlySelectedWeekdays([]);
        setPreferredDaysMap({});
        setDayPickerAnchor(null);
        setActiveWorkDayForPopup(null);

        // Hour
        setActiveHourTab('list');
        setSelectedWorkHours([]);
        setExcludeNegotiable(false);
        setSelectedTimeRanges([]);
        setDirectStartTime('');
        setDirectEndTime('');
    };

    // Render helpers
    const AddButton: React.FC = () => (
        <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50">
            <PlusIcon />
            <span>추가하기</span>
        </button>
    );

    const workHoursCount =
        activeHourTab === 'list' ? (excludeNegotiable ? 1 : selectedWorkHours.length) : selectedTimeRanges.length;

    const workDaysCount = activeDayTab === 'list' ? selectedDays.length : directlySelectedWeekdays.length;

    return (
        <div className="relative flex h-screen flex-col font-sans">
            {/* ⬇️ 초기화 핸들러 전달 */}
            <Header onReset={handleReset} />

            <main className="flex-grow overflow-y-auto bg-gray-50 pt-16 pb-24">
                {/* --- Core Filters --- */}
                <div className="space-y-2">
                    <FilterSection title="근무지역" count={`0/10`}>
                        <AddButton />
                    </FilterSection>

                    <FilterSection title="업직종" count={`0/10`}>
                        <AddButton />
                    </FilterSection>

                    <FilterSection title="근무기간" count={`${selectedPeriods.length}/${maxPeriods}`}>
                        <div className="flex flex-wrap gap-2">
                            {WORK_PERIODS.map((period) => (
                                <Chip
                                    key={period}
                                    label={period}
                                    isActive={selectedPeriods.includes(period)}
                                    onClick={() => handleTogglePeriod(period)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="근무요일" count={`${workDaysCount}/${maxDays}`}>
                        <div className="flex border-b">
                            <button
                                onClick={() => handleDayTabSwitch('list')}
                                className={`flex-1 py-2 text-center text-sm font-bold transition-colors ${activeDayTab === 'list' ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                목록에서 선택
                            </button>
                            <button
                                onClick={() => handleDayTabSwitch('direct')}
                                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${activeDayTab === 'direct'
                                    ? 'border-b-2 border-brand-orange text-brand-orange font-bold'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                직접 선택
                            </button>
                        </div>

                        {activeDayTab === 'list' && (
                            <div className="pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {WORK_DAYS.map((day) => (
                                        <Chip
                                            key={day}
                                            label={day}
                                            isActive={selectedDays.includes(day)}
                                            onClick={(e) => handleToggleDay(day, e)}
                                        />
                                    ))}
                                </div>
                                <div className="mt-3 space-y-2">
                                    {selectedDays
                                        .filter((day) => POPUP_TRIGGER_DAYS.includes(day) && (preferredDaysMap[day]?.length || 0) > 0)
                                        .map((day) => (
                                            <div key={day} className="rounded-lg bg-gray-100 p-3">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {`${day} 선호 요일`}: <span className="font-bold text-brand-orange">{preferredDaysMap[day]!.join(', ')}</span>
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {activeDayTab === 'direct' && (
                            <div className="pt-4">
                                {/* 7등분 고정 그리드 */}
                                <div className="grid grid-cols-7 gap-2">
                                    {DAYS_OF_WEEK.map((day) => {
                                        const active = directlySelectedWeekdays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                onClick={() =>
                                                    createToggleHandler(directlySelectedWeekdays, setDirectlySelectedWeekdays, 7)(day)
                                                }
                                                className={`h-9 w-full rounded-full border text-sm font-medium transition-colors
                                                        ${active
                                                        ? 'border-brand-orange bg-brand-orange text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                aria-pressed={active}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </FilterSection>

                    <FilterSection title="근무시간" count={`${workHoursCount}/${maxWorkHours}`}>
                        <div className="flex border-b">
                            <button
                                onClick={() => handleHourTabSwitch('list')}
                                className={`flex-1 py-2 text-center text-sm font-bold transition-colors ${activeHourTab === 'list' ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                목록에서 선택
                            </button>
                            <button
                                onClick={() => handleHourTabSwitch('direct')}
                                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${activeHourTab === 'direct'
                                    ? 'border-b-2 border-brand-orange text-brand-orange font-bold'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                직접 선택
                            </button>
                        </div>

                        {activeHourTab === 'list' && (
                            <div className="space-y-4 pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {WORK_HOURS.map((hour) => (
                                        <Chip
                                            key={hour}
                                            label={hour}
                                            isActive={selectedWorkHours.includes(hour)}
                                            onClick={() => handleToggleWorkHour(hour)}
                                        />
                                    ))}
                                </div>
                                <CustomCheckbox label="협의제외" isChecked={excludeNegotiable} onChange={handleToggleExcludeNegotiable} />
                            </div>
                        )}

                        {activeHourTab === 'direct' && (
                            <div className="space-y-4 pt-4">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="start-time" className="mb-1 block text-sm font-medium text-gray-700">시작 시간</label>
                                        <div className="relative">
                                            <select
                                                id="start-time"
                                                value={directStartTime}
                                                onChange={(e) => setDirectStartTime(e.target.value)}
                                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:ring-brand-orange"
                                            >
                                                <option value="" disabled>선택</option>
                                                {timeOptions.map((time) => (
                                                    <option key={`start-${time}`} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="end-time" className="mb-1 block text-sm font-medium text-gray-700">종료 시간</label>
                                        <div className="relative">
                                            <select
                                                id="end-time"
                                                value={directEndTime}
                                                onChange={(e) => setDirectEndTime(e.target.value)}
                                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:ring-brand-orange"
                                            >
                                                <option value="" disabled>선택</option>
                                                {timeOptions.map((time) => (
                                                    <option key={`end-${time}`} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddTimeRange}
                                        disabled={!directStartTime || !directEndTime || directStartTime >= directEndTime || selectedTimeRanges.length >= maxWorkHours}
                                        className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                    >
                                        추가
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {selectedTimeRanges.map((range, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
                                            <p className="text-sm font-semibold text-gray-800">
                                                <span className="font-bold text-brand-orange">{range.start} ~ {range.end}</span>
                                            </p>
                                            <button onClick={() => handleRemoveTimeRange(index)} className="text-gray-400 hover:text-gray-600" aria-label="시간대 제거">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </FilterSection>
                </div>

                {/* Additional Filters */}
                <div className="mt-4">
                    <Accordion title="추가 조건 더보기">
                        <div className="space-y-2 pt-2">
                            <FilterSection title="인적 조건" count={``}>
                                <div className="flex items-start gap-4">
                                    {/* 성별 */}
                                    <div className="flex-[2]">
                                        <h3 className="mb-2 font-semibold text-gray-700">성별</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {GENDERS.map((gender) => (
                                                <Chip
                                                    key={gender}
                                                    label={gender}
                                                    isActive={selectedGender === gender}
                                                    onClick={() => setSelectedGender(gender)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 연령 */}
                                    <div className="w-28"> {/* 또는 flex-[1] */}
                                        <h3 className="mb-2 font-semibold text-gray-700">연령(만 나이)</h3>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="ex) 20"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-brand-orange focus:ring-brand-orange"
                                        />
                                    </div>
                                </div>
                            </FilterSection>


                            <FilterSection title="고용형태" count={`${selectedEmploymentTypes.length}/${maxEmploymentTypes}`}>
                                <div className="flex flex-wrap gap-2">
                                    {EMPLOYMENT_TYPES.map((type) => (
                                        <Chip key={type} label={type} isActive={selectedEmploymentTypes.includes(type)} onClick={() => handleToggleEmployment(type)} />
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="키워드" count="">
                                {/* 설명 */}
                                <p className="mb-4 text-sm text-gray-500">
                                    여러 개의 키워드를 포함하거나 제외할 수 있습니다.
                                </p>

                                {/* 포함 */}
                                <div className="mb-1 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-800">포함</h4>
                                    <span className="text-xs text-gray-400">{includeKeywords.length}/{MAX_INCLUDE}</span>
                                </div>
                                <input
                                    type="text"
                                    value={includeInput}
                                    onChange={(e) => setIncludeInput(e.target.value)}
                                    onKeyDown={onKeyDownAdd('include')}
                                    placeholder="입력 단어 포함 공고만 검색합니다."
                                    className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:border-brand-orange focus:ring-brand-orange"
                                />
                                {/* 포함 태그 */}
                                {includeKeywords.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {includeKeywords.map((kw, i) => (
                                            <span
                                                key={`in-${kw}-${i}`}
                                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                            >
                                                {kw}
                                                <button
                                                    onClick={() => removeKeyword('include', i)}
                                                    aria-label="포함 키워드 제거"
                                                    className="ml-1 text-gray-400 hover:text-gray-600"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* 제외 */}
                                <div className="mb-1 mt-4 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-800">제외</h4>
                                    <span className="text-xs text-gray-400">{excludeKeywords.length}/{MAX_EXCLUDE}</span>
                                </div>
                                <div className="mb-2 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={excludeInput}
                                        onChange={(e) => setExcludeInput(e.target.value)}
                                        onKeyDown={onKeyDownAdd('exclude')}
                                        placeholder="추가 단어 포함 공고를 제외합니다."
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:border-brand-orange focus:ring-brand-orange"
                                    />
                                    <button
                                        onClick={() => addKeyword('exclude')}
                                        className="h-10 rounded-lg bg-black px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
                                        disabled={!excludeInput.trim() || excludeKeywords.length >= MAX_EXCLUDE}
                                    >
                                        추가
                                    </button>
                                </div>
                                {/* 제외 태그 */}
                                {excludeKeywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {excludeKeywords.map((kw, i) => (
                                            <span
                                                key={`ex-${kw}-${i}`}
                                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                            >
                                                {kw}
                                                <button
                                                    onClick={() => removeKeyword('exclude', i)}
                                                    aria-label="제외 키워드 제거"
                                                    className="ml-1 text-gray-400 hover:text-gray-600"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </FilterSection>


                            <div className="p-4">
                                <button className="w-full rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                                    내 이력서에서 불러오기
                                </button>
                                <p className="mt-2 text-center text-xs text-gray-400">모든 채용메뉴에 공통 반영됩니다.</p>
                            </div>
                        </div>
                    </Accordion>
                </div>
            </main>

            {/* Popup: anchor와 대상이 있을 때만 렌더 */}
            {activeWorkDayForPopup && dayPickerAnchor && (
                <DayPickerPopup
                    anchorEl={dayPickerAnchor}
                    selectedDays={preferredDaysMap[activeWorkDayForPopup] ?? []}
                    onToggleDay={handleTogglePreferredDay}
                    onClose={handleCloseDayPicker}
                />
            )}

            <Footer resultCount={0} />
        </div>
    );
};

export default SearchUI;
