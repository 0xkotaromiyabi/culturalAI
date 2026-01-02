export interface ChatHistoryItem {
    id: string;
    timestamp: number;
    preview: string;
    messages: Array<{
        role: string;
        content: string;
    }>;
}

const MAX_HISTORY = 5;
const STORAGE_KEY = 'chat_history';

export const chatHistory = {
    getAll(): ChatHistoryItem[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    save(messages: Array<{ role: string; content: string }>): void {
        if (typeof window === 'undefined') return;
        if (messages.length === 0) return;

        const history = this.getAll();
        const userMessage = messages.find(m => m.role === 'user')?.content || 'No message';
        const preview = userMessage.length > 60 ? userMessage.substring(0, 60) + '...' : userMessage;

        const newItem: ChatHistoryItem = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            preview,
            messages,
        };

        // Add to beginning and limit to MAX_HISTORY
        const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    },

    delete(id: string): void {
        if (typeof window === 'undefined') return;
        const history = this.getAll().filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    },

    clear(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    },
};
