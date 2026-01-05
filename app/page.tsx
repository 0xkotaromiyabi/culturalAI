'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat-interface';
import { FewShotPanel } from '@/components/few-shot-panel';
import { ChatHistoryPanel } from '@/components/chat-history-panel';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* macOS-style Header with frosted glass */}
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* macOS-style app icon - SF Symbols inspired */}
                        <div className="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-[22%] bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-soft-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10"></div>
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base md:text-xl font-semibold tracking-tight text-foreground">
                                Translation Assistant
                            </h1>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-light">
                                AI-Powered Cultural Linguistics
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with responsive spacing */}
            <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Feature Pills - Responsive layout */}
                <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12 justify-center">
                    <div className="floating-panel px-3 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <span className="text-xs md:text-sm font-medium">3 Languages</span>
                    </div>

                    <div className="floating-panel px-3 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <span className="text-xs md:text-sm font-medium">5 Error Types</span>
                    </div>

                    <div className="floating-panel px-3 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-xs md:text-sm font-medium">Cultural Reasoning</span>
                    </div>
                </div>

                {/* Main Interface - Single Column Layout */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Chat Interface - Top */}
                    <div className="animate-float" style={{ animationDelay: '0s' }}>
                        <div className="floating-panel p-4 md:p-6 h-[500px] md:h-[600px]">
                            <ChatInterface />
                        </div>
                    </div>

                    {/* Few-Shot Panel - Below Chat */}
                    <div className="animate-float" style={{ animationDelay: '0.1s' }}>
                        <div className="floating-panel p-4 md:p-6">
                            <FewShotPanel onSelectExample={(example) => {
                                console.log('Selected example:', example);
                            }} />
                        </div>
                    </div>
                </div>

                {/* Chat History Section - Above Example Queries */}
                <div className="mt-12 animate-float" style={{ animationDelay: '0.2s' }}>
                    <div className="floating-panel p-4 md:p-6 max-h-[500px]">
                        <ChatHistoryPanel onSelectHistory={(messages) => {
                            console.log('Selected history:', messages);
                        }} />
                    </div>
                </div>

                {/* Usage Hints - Responsive */}
                <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
                    <div className="floating-panel p-6 md:p-8">
                        <h2 className="text-sm md:text-base font-semibold mb-4 md:mb-6 text-foreground/80 tracking-tight">
                            Example Queries
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="group">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-foreground/60 mb-1">Translation</p>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                    "Translate 'Selamat pagi' to English"
                                </p>
                            </div>

                            <div className="group">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-foreground/60 mb-1">Error Analysis</p>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                    "Why is 'I very agree' incorrect?"
                                </p>
                            </div>

                            <div className="group">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-foreground/60 mb-1">Cultural Context</p>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                    "Why is 'Sudah menikah?' polite in Indonesian?"
                                </p>
                            </div>

                            <div className="group">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-foreground/60 mb-1">Semantic Meaning</p>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                    "Explain the phrase 'It's up to you'"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="border-t border-border/30 mt-20 py-8">
                <div className="container mx-auto px-6">
                    <p className="text-center text-xs text-muted-foreground font-light tracking-wide">
                        Next.js, Vercel AI SDK, dan Google Gemini
                    </p>
                </div>
            </footer>
        </div>
    );
}
