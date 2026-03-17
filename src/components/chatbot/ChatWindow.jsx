
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Loader2 } from "lucide-react";
import MessageBubble from './MessageBubble';
import { useLanguage } from '@/components/common/LanguageProvider';

export default function ChatWindow({ isOpen, onClose, conversation, onSendMessage, agentName }) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isTyping) return;

        const userMessage = message.trim();
        setMessage('');
        setIsTyping(true);

        try {
            await onSendMessage(userMessage);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm">
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a0d6759fb_Screenshot2025-08-23105026.png" 
                            alt="EVE FINANCE Logo" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold">{t('chatbot.greeting_title')} {agentName}</h3>
                        <p className="text-xs text-blue-100">{t('chatbot.greeting_subtitle')}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 h-8 w-8"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation?.messages?.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {isTyping && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{agentName} is typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('chatbot.input_placeholder')}
                        className="flex-1 resize-none min-h-[40px] max-h-[100px]"
                        rows={1}
                    />
                    <Button
                        type="submit"
                        disabled={!message.trim() || isTyping}
                        className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
