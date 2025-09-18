"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiClient, Interview, Candidate } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { SearchIcon, PlusIcon, VideoIcon, CalendarIcon, FilterIcon } from 'lucide-react';

const InterviewsPage: React.FC = () => {
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [interviewsResponse, candidatesResponse] = await Promise.all([
                apiClient.getInterviews(),
                apiClient.getCandidates()
            ]);

            if (interviewsResponse.success && interviewsResponse.data) {
                setInterviews(interviewsResponse.data);
            }

            if (candidatesResponse.success && candidatesResponse.data) {
                setCandidates(candidatesResponse.data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: Interview['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'scheduled': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredInterviews = interviews.filter(interview => {
        const candidate = candidates.find(c => c.id === interview.candidate_id);
        const matchesSearch = !searchTerm || 
            candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate?.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and monitor all interview sessions
                    </p>
                </div>
                <Button onClick={() => router.push('/interviews/new')} className="gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Schedule New Interview
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search by candidate name or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Interviews Grid */}
            {filteredInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInterviews.map((interview) => {
                        const candidate = candidates.find(c => c.id === interview.candidate_id);
                        return (
                            <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">
                                                {candidate?.name || 'Unknown Candidate'}
                                            </CardTitle>
                                            <CardDescription>
                                                {candidate?.position || 'Position not specified'}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(interview.status)}>
                                            {interview.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="w-4 h-4" />
                                            {new Date(interview.scheduled_at).toLocaleString()}
                                        </div>
                                        
                                        {interview.room_name && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <VideoIcon className="w-4 h-4" />
                                                Room: {interview.room_name}
                                            </div>
                                        )}

                                        {interview.questions.length > 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                {interview.questions.length} questions prepared
                                            </p>
                                        )}

                                        {interview.evaluation && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Overall Score: </span>
                                                <span className="font-medium">
                                                    {interview.evaluation.overall_score}/10
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2 mt-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => router.push(`/interviews/${interview.id}`)}
                                            className="flex-1"
                                        >
                                            View Details
                                        </Button>
                                        
                                        {interview.status === 'scheduled' && (
                                            <Button 
                                                size="sm"
                                                onClick={() => router.push(`/interviews/${interview.id}/start`)}
                                                className="flex-1 gap-1"
                                            >
                                                <VideoIcon className="w-3 h-3" />
                                                Start
                                            </Button>
                                        )}
                                        
                                        {interview.status === 'in_progress' && (
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => router.push(`/interviews/${interview.id}/join`)}
                                                className="flex-1 gap-1"
                                            >
                                                <VideoIcon className="w-3 h-3" />
                                                Join
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No interviews found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== 'all' 
                                ? "Try adjusting your search or filters" 
                                : "Schedule your first interview to get started"}
                        </p>
                        <Button onClick={() => router.push('/interviews/new')}>
                            Schedule New Interview
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default InterviewsPage;