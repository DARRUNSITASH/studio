'use client';
import { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AppContext } from '@/context/AppContext';
import { useTranslation } from '@/hooks/use-translation';
import { Clock, MessageSquare, User, Send, CheckCircle2, AlertCircle, WifiOff, Cloud, RefreshCw } from 'lucide-react';
import { CareCase, CaseMessage } from '@/lib/types';
import { format } from 'date-fns';

export default function CasesPage() {
    const { t } = useTranslation();
    const { user, cases, addMessageToCase, updateCase, addCase, doctors, syncState, triggerSync } = useContext(AppContext);
    const [selectedCase, setSelectedCase] = useState<CareCase | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showNewCaseForm, setShowNewCaseForm] = useState(false);

    // New case form state
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');

    const userRole = user?.role || 'patient';

    const filteredCases = cases.filter(c =>
        userRole === 'doctor' ? c.doctorId === user?.id : c.patientId === user?.id
    );

    const handleSendMessage = () => {
        if (!selectedCase || !newMessage.trim()) return;

        const message: CaseMessage = {
            id: Math.random().toString(36).substr(2, 9),
            senderId: user?.id || 'unknown',
            senderName: user?.name || 'Unknown',
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        addMessageToCase(selectedCase.id, message);
        setNewMessage('');
    };

    const handleMarkResolved = (caseId: string) => {
        updateCase(caseId, { status: 'resolved' });
        if (selectedCase?.id === caseId) {
            setSelectedCase(prev => prev ? { ...prev, status: 'resolved' } : null);
        }
    };

    const handleSync = () => {
        triggerSync();
    };

    const handleCreateCase = () => {
        // For patients: need doctor selection
        if (userRole === 'patient' && (!subject || !description || !selectedDoctorId)) return;

        // For doctors: need patient ID (can be entered manually or selected)
        if (userRole === 'doctor' && (!subject || !description || !selectedPatientId)) return;

        const selectedDoctor = userRole === 'patient'
            ? doctors.find(d => d.id === selectedDoctorId)
            : { id: user?.id || '', name: user?.name || 'Unknown Doctor' };

        const newCase: CareCase = {
            id: `c${Date.now()}`,
            patientId: userRole === 'patient' ? (user?.id || 'unknown') : selectedPatientId,
            patientName: userRole === 'patient' ? (user?.name || 'Unknown Patient') : `Patient ${selectedPatientId}`,
            doctorId: userRole === 'patient' ? selectedDoctorId : (user?.id || 'unknown'),
            doctorName: userRole === 'patient' ? (selectedDoctor?.name || 'Unknown') : (user?.name || 'Unknown Doctor'),
            subject,
            description,
            status: 'pending',
            urgency: 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [{
                id: 'm' + Date.now(),
                senderId: user?.id || 'unknown',
                senderName: user?.name || 'Unknown',
                content: description,
                timestamp: new Date().toISOString()
            }]
        };

        addCase(newCase);
        setShowNewCaseForm(false);
        setSubject('');
        setDescription('');
        setSelectedDoctorId('');
        setSelectedPatientId('');
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'emergency': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    if (showNewCaseForm) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        {userRole === 'doctor' ? 'Start New Consultation' : 'Submit New Consultation Case'}
                    </h2>
                    <Button variant="ghost" onClick={() => setShowNewCaseForm(false)}>Cancel</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Case Details</CardTitle>
                        <CardDescription>
                            {userRole === 'doctor'
                                ? 'Create a new consultation case for a patient.'
                                : 'Describe your condition and select a doctor to review it asynchronously.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                placeholder={userRole === 'doctor' ? 'e.g., Follow-up consultation' : 'e.g., Persistent skin rash'}
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                            />
                        </div>

                        {userRole === 'doctor' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Patient ID</label>
                                <Input
                                    placeholder="Enter patient ID (e.g., p123)"
                                    value={selectedPatientId}
                                    onChange={e => setSelectedPatientId(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the patient's ID to create a consultation for them.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Doctor</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={selectedDoctorId}
                                    onChange={e => setSelectedDoctorId(e.target.value)}
                                >
                                    <option value="">Select a doctor...</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder={userRole === 'doctor'
                                    ? 'Describe the consultation purpose...'
                                    : 'Describe your symptoms in detail...'}
                                rows={5}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleCreateCase}>
                            {userRole === 'doctor' ? 'Create Consultation' : 'Submit Case'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (selectedCase) {
        // Find current version of selected case from context
        const currentCase = cases.find(c => c.id === selectedCase.id) || selectedCase;

        return (
            <div className="space-y-4 h-[calc(100vh-12rem)] flex flex-col">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setSelectedCase(null)}>← {t('back-to-inbox')}</Button>
                    <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <WifiOff className="mr-1 h-3 w-3" /> {t('available-offline')}
                        </Badge>
                        {userRole === 'doctor' && currentCase.status !== 'resolved' && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkResolved(currentCase.id)}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
                            </Button>
                        )}
                        <Badge className={getUrgencyColor(currentCase.urgency)}>{currentCase.urgency}</Badge>
                    </div>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="border-bottom bg-muted/30">
                        <CardTitle>{currentCase.subject}</CardTitle>
                        <CardDescription>
                            Started on {format(new Date(currentCase.createdAt), 'PPP')} • {userRole === 'doctor' ? `Patient: ${currentCase.patientName}` : `Doctor: ${currentCase.doctorName}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {currentCase.messages.map((m) => (
                            <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 ${m.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                                    <div className="text-xs opacity-70 mb-1 font-bold">{m.senderName}</div>
                                    <div className="text-sm">{m.content}</div>
                                    <div className="text-[10px] opacity-70 mt-1 text-right">
                                        {format(new Date(m.timestamp), 'p')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t bg-background">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type your response..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{t('offline-message-center')}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Cloud className="h-3 w-3" /> {t('sync-status')}:
                        <span className={`font-medium flex items-center ${syncState.status === 'syncing' ? 'text-blue-600' :
                            syncState.status === 'error' ? 'text-red-600' :
                                syncState.status === 'offline' ? 'text-orange-600' :
                                    'text-green-600'
                            }`}>
                            {syncState.status === 'syncing' && t('analyzing')}
                            {syncState.status === 'offline' && `🔴 Offline (${syncState.pendingCount} pending)`}
                            {syncState.status === 'error' && `⚠️ ${syncState.error}`}
                            {syncState.status === 'idle' && t('available-offline')}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSync} disabled={syncState.status === 'syncing'}>
                        <RefreshCw className={`h-4 w-4 ${syncState.status === 'syncing' ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setShowNewCaseForm(true)}>{t('new-consultation')}</Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredCases.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-10 text-center text-muted-foreground">
                            <AlertCircle className="mx-auto h-10 w-10 mb-4 opacity-20" />
                            <p>No active consultation cases found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCases.map((c) => (
                        <Card key={c.id} className="cursor-pointer hover:border-primary transition-colors relative overflow-hidden" onClick={() => setSelectedCase(c)}>
                            <div className="absolute top-0 right-0 p-1">
                                <WifiOff className="h-3 w-3 text-muted-foreground/30" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-sm font-medium">
                                        {userRole === 'doctor' ? c.patientName : c.doctorName}
                                    </CardTitle>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Badge variant="outline" className="capitalize">{c.status}</Badge>
                                    <Badge className={getUrgencyColor(c.urgency)}>{c.urgency}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-bold text-primary">{c.subject}</div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{c.description}</p>
                                <div className="flex items-center text-[10px] text-muted-foreground mt-3">
                                    <Clock className="mr-1 h-3 w-3" /> Updated {format(new Date(c.updatedAt), 'PPp')}
                                    <MessageSquare className="ml-4 mr-1 h-3 w-3" /> {c.messages.length} messages
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
