"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { apiClient, Interview } from "@/lib/api/client";
import { CalendarIcon, VideoIcon, BrainCircuitIcon, ClockIcon, FileTextIcon, TrendingUpIcon } from "lucide-react";

const ApplicantDashboard: React.FC = () => {
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Get interviews for the current user
            const interviewsResponse = await apiClient.getInterviews();

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

    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    const inProgressInterviews = interviews.filter(i => i.status === 'in_progress');
    const recentInterviews = interviews.slice(0, 3);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading applicant dashboard...</p>
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
                        Applicant Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back! Track your interview progress
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                        <VideoIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{interviews.length}</div>
                        <p className="text-xs text-muted-foreground">All time interviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <BrainCircuitIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedInterviews.length}</div>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
                        <p className="text-xs text-muted-foreground">Scheduled interviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressInterviews.length}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Interviews */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            Upcoming Interviews
                        </CardTitle>
                        <CardDescription>
                            Your scheduled interview sessions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {upcomingInterviews.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingInterviews.map((interview) => (
                                    <div key={interview.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${getInterviewStatusColor(interview.status)}`}></div>
                                            <div>
                                                <p className="font-medium">Interview #{interview.id.slice(0, 8)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(interview.scheduled_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-1">
                                                {interview.status.replace('_', ' ')}
                                            </Badge>
                                            <div>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => router.push(`/interviews/${interview.id}`)}
                                                >
                                                    Join
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No upcoming interviews</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    You'll see your scheduled interviews here
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUpIcon className="w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Your latest interview activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentInterviews.length > 0 ? (
                            <div className="space-y-4">
                                {recentInterviews.map((interview) => (
                                    <div key={interview.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${getInterviewStatusColor(interview.status)}`}></div>
                                            <div>
                                                <p className="font-medium">Interview #{interview.id.slice(0, 8)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(interview.scheduled_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-1">
                                                {interview.status.replace('_', ' ')}
                                            </Badge>
                                            {interview.status === 'completed' && (
                                                <div>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => router.push(`/interviews/${interview.id}/results`)}
                                                    >
                                                        View Results
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileTextIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No recent activity</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Your interview history will appear here
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Performance Overview */}
            {completedInterviews.length > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUpIcon className="w-5 h-5" />
                            Performance Overview
                        </CardTitle>
                        <CardDescription>
                            Your interview performance summary
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{completedInterviews.length}</div>
                                <p className="text-sm text-muted-foreground">Completed Interviews</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {Math.round((completedInterviews.length / interviews.length) * 100)}%
                                </div>
                                <p className="text-sm text-muted-foreground">Completion Rate</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">AI</div>
                                <p className="text-sm text-muted-foreground">Powered Insights</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ApplicantDashboard;