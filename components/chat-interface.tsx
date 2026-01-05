'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatHistory } from '@/lib/chat-history';
import ReactMarkdown from 'react-markdown';

export function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        onError: (err) => {
            console.error('Chat error:', err);
        },
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Save to history when messages change
    useEffect(() => {
        if (messages.length > 0) {
            chatHistory.save(messages as any);
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header - Claude.ai style minimal */}
            <div className="flex-none border-b border-border/40 px-4 md:px-6 lg:px-8 py-3 md:py-4">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                        <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm md:text-base font-semibold text-foreground">
                            Cultural-Linguistic Reasoning
                        </h1>
                    </div>
                </div>
            </div>

            {/* Messages Area - Scrollable with Claude.ai spacing */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
                <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
                    {messages.length === 0 && (
                        <div className="text-center py-12 md:py-20">
                            <div className="inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 mb-4 md:mb-6">
                                <Bot className="h-8 w-8 md:h-10 md:w-10 text-violet-600" />
                            </div>
                            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                                Selamat Datang
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                                Saya dapat membantu Anda dengan analisis budaya-linguistik,
                                terjemahan kontekstual, dan penjelasan perbedaan lintas-budaya.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-4 md:p-5">
                            <p className="text-sm md:text-base font-medium text-red-900 dark:text-red-200">
                                ❌ Terjadi kesalahan
                            </p>
                            <p className="text-xs md:text-sm mt-2 text-red-700 dark:text-red-300">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div key={message.id} className="group">
                            {message.role === 'user' ? (
                                /* User Message - Right aligned */
                                <div className="flex justify-end">
                                    <div className="flex gap-3 md:gap-4 max-w-[85%] md:max-w-[75%]">
                                        <div className="rounded-2xl bg-violet-600 text-white px-4 md:px-5 py-3 md:py-3.5 shadow-sm">
                                            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                        </div>
                                        <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                                            <User className="h-4 w-4 md:h-4.5 md:w-4.5 text-violet-600" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* AI Message - Left aligned with enhanced formatting */
                                <div className="flex gap-3 md:gap-4">
                                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-purple-600/10">
                                        <Bot className="h-4 w-4 md:h-4.5 md:w-4.5 text-violet-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {/* Claude.ai-style markdown rendering */}
                                        <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert
                                            prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-6 prose-headings:mb-3
                                            prose-h2:text-base md:prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4
                                            prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:my-4
                                            prose-ul:my-4 prose-li:my-1.5 prose-li:text-foreground/90
                                            prose-strong:text-foreground prose-strong:font-semibold
                                            prose-code:text-violet-600 prose-code:bg-violet-50 dark:prose-code:bg-violet-950/30
                                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 md:gap-4">
                            <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-purple-600/10">
                                <Bot className="h-4 w-4 md:h-4.5 md:w-4.5 text-violet-600 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-muted/50">
                                <div className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area - Claude.ai style sticky footer */}
            <div className="flex-none border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative flex items-center gap-2 md:gap-3">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Tulis pertanyaan Anda..."
                                disabled={isLoading}
                                className="flex-1 rounded-xl md:rounded-2xl border-border/60 bg-background px-4 md:px-5 py-3 md:py-3.5 pr-12 md:pr-14
                                    text-sm md:text-base placeholder:text-muted-foreground/60
                                    focus-visible:ring-violet-500 focus-visible:border-violet-500
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    shadow-sm transition-all"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                size="icon"
                                className="absolute right-2 md:right-2.5 h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl
                                    bg-violet-600 hover:bg-violet-700 text-white shadow-sm
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all"
                            >
                                <Send className="h-4 w-4 md:h-4.5 md:w-4.5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground/60 mt-2 md:mt-3 text-center">
                            Tekan Enter untuk mengirim
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
