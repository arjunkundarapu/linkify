"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiClient, Candidate, Interview } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { SearchIcon, PlusIcon, UserIcon, MailIcon, BriefcaseIcon, CalendarIcon } from 'lucide-react';

const CandidatesPage: React.FC = () => {
    const router = useRouter();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [candidatesResponse, interviewsResponse] = await Promise.all([
                apiClient.getCandidates(),
                apiClient.getInterviews()
            ]);

            if (candidatesResponse.success && candidatesResponse.data) {
                setCandidates(candidatesResponse.data);
            }

            if (interviewsResponse.success && interviewsResponse.data) {
                setInterviews(interviewsResponse.data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCandidateInterviews = (candidateId: string) => {
        return interviews.filter(interview => interview.candidate_id === candidateId);
    };

    const getLatestInterviewStatus = (candidateId: string) => {
        const candidateInterviews = getCandidateInterviews(candidateId);
        if (candidateInterviews.length === 0) return null;
        
        const latest = candidateInterviews.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        return latest.status;
    };

    const filteredCandidates = candidates.filter(candidate => 
        !searchTerm || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'scheduled': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

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
                    <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your candidate database and interview history
                    </p>
                </div>
                <Button onClick={() => router.push('/candidates/new')} className="gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Add Candidate
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search by name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Candidates Grid */}
            {filteredCandidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map((candidate) => {
                        const candidateInterviews = getCandidateInterviews(candidate.id);
                        const latestStatus = getLatestInterviewStatus(candidate.id);
                        
                        return (
                            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <UserIcon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                                                <CardDescription>{candidate.position}</CardDescription>
                                            </div>
                                        </div>
                                        {latestStatus && (
                                            <Badge className={getStatusColor(latestStatus)}>
                                                {latestStatus.replace('_', ' ')}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MailIcon className="w-4 h-4" />
                                            {candidate.email}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <BriefcaseIcon className="w-4 h-4" />
                                            {candidate.position}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="w-4 h-4" />
                                            Added {new Date(candidate.created_at).toLocaleDateString()}
                                        </div>

                                        {candidateInterviews.length > 0 && (
                                            <div className="pt-2 border-t">
                                                <p className="text-sm font-medium">
                                                    {candidateInterviews.length} interview{candidateInterviews.length !== 1 ? 's' : ''} conducted
                                                </p>
                                                {candidateInterviews.some(i => i.evaluation) && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Latest score: {
                                                            candidateInterviews
                                                                .filter(i => i.evaluation)
                                                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                                                                ?.evaluation?.overall_score
                                                        }/10
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2 mt-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => router.push(`/candidates/${candidate.id}`)}
                                            className="flex-1"
                                        >
                                            View Profile
                                        </Button>
                                        
                                        <Button 
                                            size="sm"
                                            onClick={() => router.push(`/interviews/new?candidate=${candidate.id}`)}
                                            className="flex-1"
                                        >
                                            Schedule Interview
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <UserIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No candidates found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm 
                                ? "Try adjusting your search terms" 
                                : "Add your first candidate to get started"}
                        </p>
                        <Button onClick={() => router.push('/candidates/new')}>
                            Add Candidate
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CandidatesPage;