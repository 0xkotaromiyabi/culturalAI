'use client';

import { useState, useEffect } from 'react';
import { chatHistory, type ChatHistoryItem } from '@/lib/chat-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, Clock } from 'lucide-react';

interface ChatHistoryPanelProps {
    onSelectHistory: (messages: Array<{ role: string; content: string }>) => void;
}

export function ChatHistoryPanel({ onSelectHistory }: ChatHistoryPanelProps) {
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);

    const loadHistory = () => {
        setHistory(chatHistory.getAll());
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleDelete = (id: string) => {
        chatHistory.delete(id);
        loadHistory();
    };

    const handleClearAll = () => {
        if (confirm('Clear all chat history?')) {
            chatHistory.clear();
            loadHistory();
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold tracking-tight">Chat History</h2>
                    </div>
                    {history.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="text-xs"
                        >
                            Clear All
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground font-light">
                    Last {history.length} conversation{history.length !== 1 ? 's' : ''} (max 5)
                </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {history.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">No chat history yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Your conversations will appear here
                        </p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div
                            key={item.id}
                            className="group floating-panel p-4 cursor-pointer hover:shadow-soft-lg transition-all"
                            onClick={() => onSelectHistory(item.messages)}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-sm font-medium line-clamp-2 flex-1">
                                    {item.preview}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(item.timestamp)}</span>
                                <span>•</span>
                                <span>{item.messages.length} messages</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
