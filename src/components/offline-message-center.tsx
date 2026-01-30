/**
 * Example: Offline Message Center Component
 * Shows how to integrate offline messaging in your cases page
 * Works for both patients and doctors
 */

'use client';
import { useState, useEffect } from 'react';
import { useOfflineMessages } from '@/hooks/use-offline-messages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function OfflineMessageCenter() {
    const {
        messages,
        cases,
        sendMessage,
        loadMessages,
        loadCases,
        pendingCount,
        isOffline,
        isSyncing,
        lastSyncTime,
        syncNow,
        storageInfo,
    } = useOfflineMessages();

    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);

    // Load cases on mount
    useEffect(() => {
        loadCases();
    }, [loadCases]);

    // Load messages when case is selected
    useEffect(() => {
        if (selectedCaseId) {
            loadMessages(selectedCaseId);
        }
    }, [selectedCaseId, loadMessages]);

    const handleSendMessage = async () => {
        if (!selectedCaseId || !messageInput.trim()) return;

        setSending(true);
        try {
            await sendMessage(selectedCaseId, messageInput.trim());
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const selectedCase = cases.find(c => c.id === selectedCaseId);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
            {/* Cases List */}
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Conversations</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={syncNow}
                            disabled={isSyncing}
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Status Bar */}
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            {isOffline ? (
                                <>
                                    <WifiOff className="h-4 w-4 text-orange-500" />
                                    <span className="text-orange-500">Offline Mode</span>
                                </>
                            ) : (
                                <>
                                    <Wifi className="h-4 w-4 text-green-500" />
                                    <span className="text-green-500">Online</span>
                                </>
                            )}
                        </div>

                        {pendingCount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{pendingCount} messages pending sync</span>
                            </div>
                        )}

                        {lastSyncTime && (
                            <div className="text-xs text-muted-foreground">
                                Last synced: {formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}
                            </div>
                        )}

                        {storageInfo.percentage > 80 && (
                            <div className="text-xs text-orange-500">
                                Storage: {storageInfo.percentage.toFixed(1)}% used
                            </div>
                        )}
                    </div>

                    {/* Cases List */}
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                            {cases.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No conversations yet
                                </p>
                            ) : (
                                cases.map(caseItem => (
                                    <div
                                        key={caseItem.id}
                                        onClick={() => setSelectedCaseId(caseItem.id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCaseId === caseItem.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{caseItem.subject}</h4>
                                                <p className="text-sm opacity-80 truncate">
                                                    {caseItem.patientName || caseItem.doctorName}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    caseItem.urgency === 'emergency'
                                                        ? 'destructive'
                                                        : caseItem.urgency === 'medium'
                                                            ? 'default'
                                                            : 'secondary'
                                                }
                                                className="ml-2"
                                            >
                                                {caseItem.urgency}
                                            </Badge>
                                        </div>
                                        <p className="text-xs opacity-70 mt-1">
                                            {formatDistanceToNow(new Date(caseItem.updatedAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Messages Area */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>
                        {selectedCase ? selectedCase.subject : 'Select a conversation'}
                    </CardTitle>
                    {selectedCase && (
                        <p className="text-sm text-muted-foreground">
                            {selectedCase.description}
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    {!selectedCaseId ? (
                        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                            Select a conversation to view messages
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Messages */}
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-3">
                                    {messages.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No messages yet. Start the conversation!
                                        </p>
                                    ) : (
                                        messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === selectedCase?.patientId
                                                        ? 'justify-start'
                                                        : 'justify-end'
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${msg.senderId === selectedCase?.patientId
                                                            ? 'bg-muted'
                                                            : 'bg-primary text-primary-foreground'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium">
                                                            {msg.senderName}
                                                        </span>
                                                        {msg.syncStatus === 'pending' && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Sending...
                                                            </Badge>
                                                        )}
                                                        {msg.syncStatus === 'failed' && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Failed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className="text-xs opacity-70 mt-1">
                                                        {formatDistanceToNow(new Date(msg.timestamp), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder={
                                        isOffline
                                            ? 'Type a message (will send when online)...'
                                            : 'Type a message...'
                                    }
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={sending}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={sending || !messageInput.trim()}
                                >
                                    {sending ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            {isOffline && (
                                <p className="text-xs text-orange-500 text-center">
                                    📴 You're offline. Messages will be sent automatically when you reconnect.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
