'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User } from 'lucide-react';
import { chatHistory } from '@/lib/chat-history';

export function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
        onError: (err) => {
            console.error('Chat error:', err);
        },
    });

    // Save to history when messages change
    useEffect(() => {
        if (messages.length > 0) {
            chatHistory.save(messages as any);
        }
    }, [messages]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Translation Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Welcome to AI Translation Assistant</p>
                        <p className="text-sm">
                            I can help you translate between Indonesian, English, and Mandarin,
                            and detect errors in grammar, context, culture, semantics, and pragmatics.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                        <p className="text-destructive font-medium">❌ Error:</p>
                        <p className="text-sm mt-1">{error.message}</p>
                        <p className="text-xs mt-2 text-muted-foreground">
                            Check browser console (F12) for more details
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                        >
                            <div
                                className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}
                            >
                                {message.role === 'user' ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <Bot className="w-4 h-4" />
                                )}
                            </div>
                            <div
                                className={`rounded-lg px-4 py-2 ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}
                            >
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    {message.content}
                                </div>

                                {/* Display tool invocations */}
                                {message.toolInvocations && message.toolInvocations.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {message.toolInvocations.map((toolInvocation: any) => {
                                            const { toolName, toolCallId, state } = toolInvocation;

                                            if (state === 'result') {
                                                const result = toolInvocation.result;

                                                return (
                                                    <div key={toolCallId} className="bg-background/50 rounded p-3 text-sm">
                                                        <Badge className="mb-2">{toolName}</Badge>
                                                        {toolName === 'detectErrors' && result.errors && (
                                                            <div className="space-y-2 mt-2">
                                                                <p className="font-medium">Detected Errors:</p>
                                                                {result.errors.map((error: any, idx: number) => (
                                                                    <div key={idx} className="pl-3 border-l-2 border-destructive">
                                                                        <p className="text-xs font-medium uppercase">{error.type}</p>
                                                                        <p className="text-xs">{error.description}</p>
                                                                        {error.suggestion && (
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                💡 {error.suggestion}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {toolName === 'translate' && result.translatedText && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-muted-foreground mb-1">
                                                                    {result.sourceLanguage} → {result.targetLanguage}
                                                                </p>
                                                                <p className="font-medium">{result.translatedText}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={toolCallId} className="text-xs text-muted-foreground">
                                                    Calling {toolName}...
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                <Bot className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="rounded-lg px-4 py-2 bg-muted">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask me to translate or analyze text..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
