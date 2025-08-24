
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

interface FilterSectionProps {
    title: string;
    children: ReactNode;
    count?: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, count, children }) => (
    <section className="bg-white p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {count && <span className="text-sm font-medium text-brand-orange">{count}</span>}
        </div>
        <div>{children}</div>
    </section>
);

interface ChipProps {
    label: string;
    isActive: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Chip: React.FC<ChipProps> = ({ label, isActive, onClick }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-full border cursor-pointer transition-colors";
    const activeClasses = "bg-orange-50 border-brand-orange text-brand-orange";
    const inactiveClasses = "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
    );
};

interface AccordionProps {
    title: string;
    children: ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-t border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50"
            >
                <span>{title}</span>
                <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
            </button>
            <div className={`bg-white transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                {children}
            </div>
        </div>
    );
};

interface DayPickerPopupProps {
    anchorEl: HTMLElement | null;
    selectedDays: DayOfWeek[];
    onToggleDay: (day: DayOfWeek) => void;
    onClose: () => void;
}

export const DayPickerPopup: React.FC<DayPickerPopupProps> = ({ anchorEl, selectedDays, onToggleDay, onClose }) => {
    if (!anchorEl) return null;

    const rect = anchorEl.getBoundingClientRect();
    const popupStyle = {
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${rect.left + window.scrollX}px`,
        transform: rect.left > window.innerWidth / 2 ? `translateX(calc(-100% + ${rect.width}px))` : 'none',
    };

    return (
        <div
            className="fixed inset-0 z-20"
            onClick={onClose}
        >
            <div
                style={popupStyle}
                className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-30 w-max"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-sm font-semibold text-gray-700 mb-2">원하는 요일을 선택하세요 (중복선택 가능)</p>
                <div className="flex gap-1">
                    {DAYS_OF_WEEK.map(day => (
                        <button
                            key={day}
                            onClick={() => onToggleDay(day)}
                            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full border transition-colors ${selectedDays.includes(day)
                                ? 'bg-brand-orange text-white border-brand-orange'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                    확인
                </button>
            </div>
        </div>
    );
};

interface CustomCheckboxProps {
    label: string;
    isChecked: boolean;
    onChange: () => void;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, isChecked, onChange }) => (
    <div className="flex items-center cursor-pointer" onClick={onChange}>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-colors ${isChecked ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-300'}`}>
            {isChecked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <span className={`text-sm font-medium ${isChecked ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
    </div>
);