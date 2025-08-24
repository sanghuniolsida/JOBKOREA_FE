import React, { useState, useMemo } from 'react';
import type { WorkPeriod, WorkDay, WorkHour, EmploymentType, Gender, DayOfWeek } from '../types';
import { WORK_PERIODS, WORK_DAYS, WORK_HOURS, EMPLOYMENT_TYPES, GENDERS, DAYS_OF_WEEK } from '../constants';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSection, Chip, Accordion, PlusIcon, DayPickerPopup, CustomCheckbox } from '../components/FilterComponents';

const SearchUI: React.FC = () => {
    // Core Filters State
    const [selectedPeriods, setSelectedPeriods] = useState<WorkPeriod[]>([]);
    const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([]);
    const [selectedGender, setSelectedGender] = useState<Gender>(GENDERS[0]); // '무관'
    const [age, setAge] = useState('');

    // Work Day State
    const [activeDayTab, setActiveDayTab] = useState<'list' | 'direct'>('list');
    const [selectedDays, setSelectedDays] = useState<WorkDay[]>([]);
    const [directlySelectedWeekdays, setDirectlySelectedWeekdays] = useState<DayOfWeek[]>([]);
    const [preferredDaysMap, setPreferredDaysMap] = useState<Partial<Record<WorkDay, DayOfWeek[]>>>({});
    const [dayPickerAnchor, setDayPickerAnchor] = useState<HTMLElement | null>(null);
    const [activeWorkDayForPopup, setActiveWorkDayForPopup] = useState<WorkDay | null>(null);

    // Work Hours State
    const [activeHourTab, setActiveHourTab] = useState<'list' | 'direct'>('list');
    const [selectedWorkHours, setSelectedWorkHours] = useState<WorkHour[]>([]);
    const [excludeNegotiable, setExcludeNegotiable] = useState(false);
    const [selectedTimeRanges, setSelectedTimeRanges] = useState<{ start: string; end: string }[]>([]);
    const [directStartTime, setDirectStartTime] = useState('');
    const [directEndTime, setDirectEndTime] = useState('');

    // Limits
    const maxPeriods = 6;
    const maxDays = 3;
    const maxWorkHours = 3;
    const maxEmploymentTypes = 3;

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

    // --- Generic Handlers ---
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
    const handleToggleEmployment = createToggleHandler(
        selectedEmploymentTypes,
        setSelectedEmploymentTypes,
        maxEmploymentTypes
    );

    // --- Work Day Handlers ---
    const handleCloseDayPicker = () => {
        setDayPickerAnchor(null);
        setActiveWorkDayForPopup(null);
    };

    const POPUP_TRIGGER_DAYS: WorkDay[] = ['주1일', '주2일', '주3일', '주4일', '주5일', '주6일'];

    const handleToggleDay = (day: WorkDay, event: React.MouseEvent<HTMLButtonElement>) => {
        const isCurrentlySelected = selectedDays.includes(day);
        const isPopupTrigger = POPUP_TRIGGER_DAYS.includes(day);

        if (isCurrentlySelected) {
            setSelectedDays((prev) => prev.filter((d) => d !== day));
            if (isPopupTrigger) {
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

        if (isPopupTrigger) {
            setDayPickerAnchor(event.currentTarget);
            setActiveWorkDayForPopup(day);
        } else {
            handleCloseDayPicker();
        }
    };

    const handleTogglePreferredDay = (day: DayOfWeek) => {
        if (!activeWorkDayForPopup) return;
        setPreferredDaysMap((prevMap) => {
            const currentPreferred = prevMap[activeWorkDayForPopup] || [];
            const newPreferred = currentPreferred.includes(day)
                ? currentPreferred.filter((d) => d !== day)
                : [...currentPreferred, day];
            return { ...prevMap, [activeWorkDayForPopup]: newPreferred };
        });
    };

    const handleToggleDirectWeekday = createToggleHandler(
        directlySelectedWeekdays,
        setDirectlySelectedWeekdays,
        7
    );

    const handleDayTabSwitch = (tab: 'list' | 'direct') => {
        if (activeDayTab === tab) return;
        setActiveDayTab(tab);
        setSelectedDays([]);
        setPreferredDaysMap({});
        setDirectlySelectedWeekdays([]);
        handleCloseDayPicker();
    };

    // --- Work Hour Handlers ---
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

    // --- Render Helpers ---
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
            <Header />
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
                                <div className="flex flex-wrap gap-2">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <Chip
                                            key={day}
                                            label={day}
                                            isActive={directlySelectedWeekdays.includes(day)}
                                            onClick={() => createToggleHandler(directlySelectedWeekdays, setDirectlySelectedWeekdays, 7)(day)}
                                        />
                                    ))}
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
                                        <label htmlFor="start-time" className="mb-1 block text-sm font-medium text-gray-700">
                                            시작 시간
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="start-time"
                                                value={directStartTime}
                                                onChange={(e) => setDirectStartTime(e.target.value)}
                                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:ring-brand-orange"
                                            >
                                                <option value="" disabled>
                                                    선택
                                                </option>
                                                {timeOptions.map((time) => (
                                                    <option key={`start-${time}`} value={time}>
                                                        {time}
                                                    </option>
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
                                        <label htmlFor="end-time" className="mb-1 block text-sm font-medium text-gray-700">
                                            종료 시간
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="end-time"
                                                value={directEndTime}
                                                onChange={(e) => setDirectEndTime(e.target.value)}
                                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:ring-brand-orange"
                                            >
                                                <option value="" disabled>
                                                    선택
                                                </option>
                                                {timeOptions.map((time) => (
                                                    <option key={`end-${time}`} value={time}>
                                                        {time}
                                                    </option>
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
                                                <span className="font-bold text-brand-orange">
                                                    {range.start} ~ {range.end}
                                                </span>
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

                {/* --- Additional Filters (Accordion) --- */}
                <div className="mt-4">
                    <Accordion title="추가 조건 더보기">
                        <div className="space-y-2 pt-2">
                            <FilterSection title="인적 조건" count={``}>
                                <div className="flex items-start gap-8">
                                    <div className="flex-1">
                                        <h3 className="mb-2 font-semibold text-gray-700">성별</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {GENDERS.map((gender) => (
                                                <Chip key={gender} label={gender} isActive={selectedGender === gender} onClick={() => setSelectedGender(gender)} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 font-semibold text-gray-700">연령(만 나이)</h3>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="ex) 20"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:border-brand-orange focus:ring-brand-orange"
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

                            <FilterSection title="키워드" count={``}>
                                <input
                                    type="text"
                                    placeholder="키워드를 입력하세요 (예: 카페, 단기)"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-orange focus:ring-brand-orange"
                                />
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

            {/* Popup: anchor와 선택 대상이 있을 때만 렌더링 */}
            {activeWorkDayForPopup && dayPickerAnchor && (
                <DayPickerPopup
                    anchorEl={dayPickerAnchor}
                    selectedDays={preferredDaysMap[activeWorkDayForPopup] ?? []}
                    onToggleDay={handleTogglePreferredDay}
                    onClose={handleCloseDayPicker}
                />
            )}

            <Footer resultCount={234615} />
        </div>
    );
};

export default SearchUI;