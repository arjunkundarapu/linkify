import { API_BASE_URL } from "@/utils/constants/site";

// Types for API responses
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    position: string;
    resume_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Interview {
    id: string;
    candidate_id: string;
    status: "scheduled" | "in_progress" | "completed" | "cancelled";
    scheduled_at: string;
    started_at?: string;
    ended_at?: string;
    room_name?: string;
    questions: InterviewQuestion[];
    responses: InterviewResponse[];
    evaluation?: InterviewEvaluation;
    created_at: string;
    updated_at: string;
}

export interface InterviewQuestion {
    id: string;
    question: string;
    type: "technical" | "behavioral" | "general";
    order: number;
}

export interface InterviewResponse {
    question_id: string;
    response: string;
    timestamp: string;
    confidence_score?: number;
}

export interface InterviewEvaluation {
    overall_score: number;
    technical_score: number;
    communication_score: number;
    problem_solving_score: number;
    feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
}

export interface LiveKitToken {
    token: string;
    room_name: string;
    participant_name: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.detail || data.message || "Request failed",
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Network error",
            };
        }
    }

    // Candidate endpoints
    async getCandidates(): Promise<ApiResponse<Candidate[]>> {
        return this.request("/api/candidates");
    }

    async getCandidate(id: string): Promise<ApiResponse<Candidate>> {
        return this.request(`/api/candidates/${id}`);
    }

    async createCandidate(candidate: Omit<Candidate, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Candidate>> {
        return this.request("/api/candidates", {
            method: "POST",
            body: JSON.stringify(candidate),
        });
    }

    async updateCandidate(id: string, updates: Partial<Candidate>): Promise<ApiResponse<Candidate>> {
        return this.request(`/api/candidates/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
    }

    async deleteCandidate(id: string): Promise<ApiResponse<void>> {
        return this.request(`/api/candidates/${id}`, {
            method: "DELETE",
        });
    }

    // Interview endpoints
    async getInterviews(): Promise<ApiResponse<Interview[]>> {
        return this.request("/api/interviews");
    }

    async getInterview(id: string): Promise<ApiResponse<Interview>> {
        return this.request(`/api/interviews/${id}`);
    }

    async createInterview(interview: Omit<Interview, "id" | "created_at" | "updated_at" | "responses" | "evaluation">): Promise<ApiResponse<Interview>> {
        return this.request("/api/interviews", {
            method: "POST",
            body: JSON.stringify(interview),
        });
    }

    async updateInterview(id: string, updates: Partial<Interview>): Promise<ApiResponse<Interview>> {
        return this.request(`/api/interviews/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
    }

    async startInterview(id: string): Promise<ApiResponse<{ room_name: string }>> {
        return this.request(`/api/interviews/${id}/start`, {
            method: "POST",
        });
    }

    async endInterview(id: string): Promise<ApiResponse<Interview>> {
        return this.request(`/api/interviews/${id}/end`, {
            method: "POST",
        });
    }

    // LiveKit integration
    async getLiveKitToken(room_name: string, participant_name: string): Promise<ApiResponse<LiveKitToken>> {
        return this.request("/api/livekit/token", {
            method: "POST",
            body: JSON.stringify({
                room_name,
                participant_name,
            }),
        });
    }

    // AI Interview endpoints
    async submitResponse(interview_id: string, question_id: string, response: string): Promise<ApiResponse<void>> {
        return this.request(`/api/interviews/${interview_id}/responses`, {
            method: "POST",
            body: JSON.stringify({
                question_id,
                response,
            }),
        });
    }

    async getEvaluation(interview_id: string): Promise<ApiResponse<InterviewEvaluation>> {
        return this.request(`/api/interviews/${interview_id}/evaluation`);
    }

    // Analytics endpoints
    async getInterviewAnalytics(interview_id?: string): Promise<ApiResponse<any>> {
        const endpoint = interview_id 
            ? `/api/analytics/interviews/${interview_id}`
            : "/api/analytics/interviews";
        return this.request(endpoint);
    }

    async getCandidateAnalytics(candidate_id?: string): Promise<ApiResponse<any>> {
        const endpoint = candidate_id 
            ? `/api/analytics/candidates/${candidate_id}`
            : "/api/analytics/candidates";
        return this.request(endpoint);
    }
}

export const apiClient = new ApiClient();
export default apiClient;