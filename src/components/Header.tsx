
import React from 'react';

const ArrowLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
            <button className="p-2 text-gray-700">
                <ArrowLeftIcon />
            </button>
            <h1 className="text-lg font-bold text-gray-800">검색조건설정</h1>
            <button className="text-sm font-medium text-gray-600 hover:text-brand-orange">
                초기화
            </button>
        </header>
    );
};