
import React from 'react';

interface FooterProps {
    resultCount: number;
}

export const Footer: React.FC<FooterProps> = ({ resultCount }) => {
    return (
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[420px] h-24 bg-white border-t border-gray-200 p-4 z-10">
            <button className="w-full h-full bg-brand-orange text-white text-lg font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                {resultCount.toLocaleString()}건의 결과보기
            </button>
        </footer>
    );
};
