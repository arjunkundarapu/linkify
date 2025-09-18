"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { apiClient, Candidate, Interview } from "@/lib/api/client";
import { CalendarIcon, PlusIcon, UsersIcon, VideoIcon, BarChart3Icon, BrainCircuitIcon } from "lucide-react";

const RecruiterDashboard: React.FC = () => {
    const router = useRouter();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
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
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInterviewStatusColor = (status: Interview['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in_progress': return 'bg-blue-500';
            case 'scheduled': return 'bg-yellow-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const recentInterviews = interviews.slice(0, 5);
    const completedInterviews = interviews.filter(i => i.status === 'completed').length;
    const scheduledInterviews = interviews.filter(i => i.status === 'scheduled').length;
    const inProgressInterviews = interviews.filter(i => i.status === 'in_progress').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading recruiter dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Recruiter Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back! Manage your AI-powered recruiting interviews
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push("/interviews/new")} className="gap-2">
                        <PlusIcon className="w-4 h-4" />
                        New Interview
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{candidates.length}</div>
                        <p className="text-xs text-muted-foreground">Registered candidates</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Interviews</CardTitle>
                        <BrainCircuitIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedInterviews}</div>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Interviews</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scheduledInterviews}</div>
                        <p className="text-xs text-muted-foreground">Upcoming sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
                        <VideoIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressInterviews}</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Interviews */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <VideoIcon className="w-5 h-5" />
                            Recent Interviews
                        </CardTitle>
                        <CardDescription>
                            Latest interview sessions and their status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentInterviews.length > 0 ? (
                            <div className="space-y-4">
                                {recentInterviews.map((interview) => {
                                    const candidate = candidates.find(c => c.id === interview.candidate_id);
                                    return (
                                        <div key={interview.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${getInterviewStatusColor(interview.status)}`}></div>
                                                <div>
                                                    <p className="font-medium">{candidate?.name || 'Unknown Candidate'}</p>
                                                    <p className="text-sm text-muted-foreground">{candidate?.position || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className="mb-1">
                                                    {interview.status.replace('_', ' ')}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(interview.scheduled_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No interviews yet</p>
                                <Button 
                                    className="mt-4" 
                                    onClick={() => router.push("/interviews/new")}
                                >
                                    Schedule Your First Interview
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3Icon className="w-5 h-5" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Common recruiting tasks and tools
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button 
                                variant="outline" 
                                className="h-20 flex-col gap-2"
                                onClick={() => router.push("/candidates")}
                            >
                                <UsersIcon className="w-6 h-6" />
                                Manage Candidates
                            </Button>
                            <Button 
                                variant="outline" 
                                className="h-20 flex-col gap-2"
                                onClick={() => router.push("/interviews")}
                            >
                                <VideoIcon className="w-6 h-6" />
                                View All Interviews
                            </Button>
                            <Button 
                                variant="outline" 
                                className="h-20 flex-col gap-2"
                                onClick={() => router.push("/settings")}
                            >
                                <BrainCircuitIcon className="w-6 h-6" />
                                AI Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RecruiterDashboard;