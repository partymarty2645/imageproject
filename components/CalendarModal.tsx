import React from 'react';
import { CalendarModalProps } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, onDateSelect, availableDates, currentDate }) => {
    // For simplicity, we'll just show the current month. A full implementation would have month navigation.
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => null); // Adjust for Sunday start
    const calendarDays = [...blanks, ...days];
    const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full max-w-sm p-6">
                <DialogHeader>
                    <DialogTitle className="text-center text-purple-200 font-serif text-xl">
                        {today.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => (
                        <div key={day} className="flex items-center justify-center h-10 text-purple-300 font-bold">
                            {day}
                        </div>
                    ))}
                    {calendarDays.map((day, index) => {
                        if (!day) return <div key={`blank-${index}`} className="h-10"></div>;
                        
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isAvailable = availableDates.includes(dateStr);
                        const isCurrent = dateStr === currentDate;
                        
                        return (
                            <div 
                                key={day} 
                                className={`flex items-center justify-center h-10 relative ${
                                    isAvailable 
                                        ? 'cursor-pointer text-white hover:bg-purple-500/20 rounded-full' 
                                        : 'text-purple-400 cursor-not-allowed'
                                } ${isCurrent ? 'bg-purple-500/30 rounded-full' : ''}`}
                                onClick={() => isAvailable && onDateSelect(dateStr)}
                            >
                                {isAvailable && <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-200 rounded-full"></span>}
                                {day}
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarModal;
