"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import StepForm from '@/components/resume-builder/StepForm';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export default function CreateResume() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showSignInAlert, setShowSignInAlert] = useState(true);

  const createResume = async () => {
    if (!session?.user?.email) return;

    const resumeId = uuidv4();
    const resumeRef = doc(db, "resumes", resumeId);

    await setDoc(resumeRef, {
      id: resumeId,
      userId: session.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {},
    });

    router.push(`/resume/${resumeId}`);
  };

  useEffect(() => {
    if (!session) {
      setShowSignInAlert(true);
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-[#162F44]">
      {!session && showSignInAlert ? (
        <div className="max-w-xl mx-auto p-6">
          <Alert className="bg-[#BFBFBF] border-[#CB3F4A] mb-6">
            <AlertCircle className="h-4 w-4 text-[#CB3F4A]" />
            <AlertTitle className="text-[#162F44] font-bold">Not signed in</AlertTitle>
            <AlertDescription className="text-[#697782]">
              You're not signed in. Your resume won't be saved unless you sign in.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/signin')}
              className="flex-1 bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white !important"
            >
              Sign in to save your progress
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSignInAlert(false)}
              className="flex-1 border-[#CB3F4A] text-white hover:bg-[#CB3F4A]/10"
            >
              Continue anyway
            </Button>
          </div>
        </div>
      ) : null}
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex min-h-screen items-center justify-center bg-[#162F44] px-4">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-white">
                Create Your Resume
              </h1>
              <p className="text-[#BFBFBF]">
                Start building your professional resume with our AI-powered tools
              </p>
            </div>
            <Button
              onClick={createResume}
              className="w-full bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white !important py-6 text-lg"
            >
              Create New Resume
            </Button>
            <p className="text-sm text-[#697782]">
              Your resume will be saved automatically as you type
            </p>
            <StepForm />
          </div>
        </div>
      </div>
    </div>
  );
}
