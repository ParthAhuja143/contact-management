import React from 'react'

interface InfoBoxProps {
    title: string;
    cases: number;
    total: number;
    onClick: () => void;
    active: boolean;
    isRed: boolean;
    darkMode: boolean;
}

function InfoBox({ title, cases, total, onClick, active, isRed, darkMode }: InfoBoxProps) {
    return (
        <div className={`border rounded-lg p-4 cursor-pointer ${active ? 'bg-blue-500' : 'bg-white'} ${isRed ? 'border-red-500' : 'border-gray-300'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} onClick={onClick}>
            <div className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {title}
            </div>

            <h2 className={`text-2xl ${!isRed ? 'text-green-500' : 'text-red-500'}`}>{cases}</h2>

            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {total} Total
            </div>
        </div>
    )
}

export default InfoBox