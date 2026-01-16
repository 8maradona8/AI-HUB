'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    const modalRef = useRef(null);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={modalRef}
                className="bg-card rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-card-border w-full max-w-lg mx-4 transform transition-all duration-300 scale-100 overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-card-border bg-background/50">
                    <h3 className="text-2xl font-black text-foreground tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-foreground transition-all p-2 rounded-xl hover:bg-background border border-transparent hover:border-card-border"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
}
