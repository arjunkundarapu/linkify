"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient, Interview } from '@/lib/api/client';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, PhoneOffIcon, LoaderIcon } from 'lucide-react';
import { cn } from '@/utils';

interface VideoInterviewProps {
    interview: Interview;
    onInterviewEnd?: () => void;
    className?: string;
}

interface LiveKitConnectionState {
    connected: boolean;
    connecting: boolean;
    error?: string;
}

export const VideoInterview: React.FC<VideoInterviewProps> = ({
    interview,
    onInterviewEnd,
    className
}) => {
    const [connectionState, setConnectionState] = useState<LiveKitConnectionState>({
        connected: false,
        connecting: false
    });
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        initializeLiveKit();
        return () => {
            disconnect();
        };
    }, [interview.id]);

    const initializeLiveKit = async () => {
        try {
            setConnectionState({ connected: false, connecting: true });
            
            // Get LiveKit token from backend
            const response = await apiClient.getLiveKitToken(
                interview.room_name || `interview-${interview.id}`,
                `interviewer-${Date.now()}`
            );

            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to get LiveKit token');
            }

            setToken(response.data.token);
            
            // Initialize local media
            await setupLocalMedia();
            
            setConnectionState({ connected: true, connecting: false });
        } catch (error) {
            console.error('Failed to initialize LiveKit:', error);
            setConnectionState({
                connected: false,
                connecting: false,
                error: error instanceof Error ? error.message : 'Connection failed'
            });
        }
    };

    const setupLocalMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: videoEnabled,
                audio: audioEnabled
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Failed to access media devices:', error);
            throw error;
        }
    };

    const disconnect = () => {
        if (localVideoRef.current?.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setConnectionState({ connected: false, connecting: false });
    };

    const toggleAudio = () => {
        if (localVideoRef.current?.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !audioEnabled;
            });
            setAudioEnabled(!audioEnabled);
        }
    };

    const toggleVideo = () => {
        if (localVideoRef.current?.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            const videoTracks = stream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !videoEnabled;
            });
            setVideoEnabled(!videoEnabled);
        }
    };

    const endInterview = async () => {
        try {
            await apiClient.endInterview(interview.id);
            disconnect();
            onInterviewEnd?.();
        } catch (error) {
            console.error('Failed to end interview:', error);
        }
    };

    return (
        <Card className={cn("w-full max-w-4xl", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Interview Session</CardTitle>
                        <CardDescription>
                            Room: {interview.room_name || `interview-${interview.id}`}
                        </CardDescription>
                    </div>
                    <Badge variant={connectionState.connected ? "default" : "secondary"}>
                        {connectionState.connecting && "Connecting..."}
                        {connectionState.connected && "Connected"}
                        {!connectionState.connecting && !connectionState.connected && "Disconnected"}
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
                {/* Connection Error */}
                {connectionState.error && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
                        <p className="font-medium">Connection Error</p>
                        <p className="text-sm">{connectionState.error}</p>
                        <Button 
                            onClick={initializeLiveKit}
                            size="sm"
                            className="mt-2"
                        >
                            Retry Connection
                        </Button>
                    </div>
                )}

                {/* Video Containers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Local Video */}
                    <div className="relative">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            You
                        </div>
                        {!videoEnabled && (
                            <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
                                <div className="text-white text-center">
                                    <VideoOffIcon className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-sm">Camera Off</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Remote Video (AI/Candidate) */}
                    <div className="relative">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            AI Assistant
                        </div>
                        {!connectionState.connected && (
                            <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
                                <div className="text-white text-center">
                                    {connectionState.connecting ? (
                                        <>
                                            <LoaderIcon className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                            <p className="text-sm">Connecting...</p>
                                        </>
                                    ) : (
                                        <>
                                            <VideoOffIcon className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-sm">Waiting for connection</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant={audioEnabled ? "primary" : "destructive"} as "primary" | "destructive"
                        size="lg"
                        onClick={toggleAudio}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        {audioEnabled ? (
                            <MicIcon className="w-5 h-5" />
                        ) : (
                            <MicOffIcon className="w-5 h-5" />
                        )}
                    </Button>

                    <Button
                        variant={videoEnabled ? "primary" : "destructive"} as "primary" | "destructive"
                        size="lg"
                        onClick={toggleVideo}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        {videoEnabled ? (
                            <VideoIcon className="w-5 h-5" />
                        ) : (
                            <VideoOffIcon className="w-5 h-5" />
                        )}
                    </Button>

                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={endInterview}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        <PhoneOffIcon className="w-5 h-5" />
                    </Button>
                </div>

                {/* Interview Info */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>Interview started at {new Date(interview.started_at || interview.created_at).toLocaleTimeString()}</p>
                    {token && (
                        <p className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
                            Token: {token.substring(0, 20)}...
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default VideoInterview;