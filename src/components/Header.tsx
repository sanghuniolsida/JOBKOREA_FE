import React from 'react';

const ArrowLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
    return (
        <header className="fixed top-0 left-1/2 z-10 flex h-16 w-[420px] -translate-x-1/2 transform items-center justify-between border-b border-gray-200 bg-white px-4">
            <button className="p-2 text-gray-700" aria-label="뒤로가기">
                <ArrowLeftIcon />
            </button>
            <h1 className="text-lg font-bold text-gray-800">검색조건설정</h1>
            <button
                onClick={onReset}
                className="text-sm font-medium text-gray-600 hover:text-brand-orange"
            >
                초기화
            </button>
        </header>
    );
};