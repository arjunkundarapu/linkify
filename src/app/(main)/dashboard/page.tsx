"use client"

import React, { useState } from 'react';
import RecruiterDashboard from "@/components/dashboard/recruiter-dashboard";
import ApplicantDashboard from "@/components/dashboard/applicant-dashboard";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>('recruiter');

    return (
        <div className="w-full">
            {/* Role Selector for Demo */}
            <div className="mb-6 p-4 bg-card rounded-lg border">
                <h2 className="text-lg font-semibold mb-3">Dashboard View</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Select a role to view the corresponding dashboard:
                </p>
                <div className="flex gap-2">
                    <Button 
                        variant={selectedRole === 'recruiter' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('recruiter')}
                        size="sm"
                    >
                        Recruiter Dashboard
                    </Button>
                    <Button 
                        variant={selectedRole === 'applicant' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('applicant')}
                        size="sm"
                    >
                        Applicant Dashboard
                    </Button>
                </div>
            </div>

            {/* Render appropriate dashboard based on selected role */}
            {selectedRole === 'recruiter' ? (
                <RecruiterDashboard />
            ) : (
                <ApplicantDashboard />
            )}
        </div>
    );
};

export default DashboardPage;
