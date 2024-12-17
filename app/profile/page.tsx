'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Mail, User, Trash2, Plus, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from "@/components/ui/toaster";

interface Resume {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

function ProfileSkeleton() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    )
  }

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast();
  const settings = {
    displayName: window.localStorage.getItem("resumeitnow_name") || session?.user?.name,
    defaultTemplate: window.localStorage.getItem("resumeitnow_template") || 'modern'
  }

  const deleteResume = async (resumeId: string) => {
    try {
      await deleteDoc(doc(db, `users/${session?.user?.email}/resumes/${resumeId}`));
      toast({
        title: "Success",
        description: "Resume deleted successfully!",
        duration: 3000,
      });
      
      // Remove the deleted resume from the list
      setResumes((prevResumes) => prevResumes.filter((resume) => resume.id !== resumeId));
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error deleting resume. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  

  useEffect(() => {
    const fetchResumes = async () => {
      if (!session?.user?.name) return

      try {
        const q = query(
          collection(db, `users/${session.user.email}/resumes`),
          where("userId", "==", session.user.email)
        );

        const querySnapshot = await getDocs(q);
        const resumeData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Resume[]

        setResumes(resumeData)
      } catch (error) {
        console.error('Error fetching resumes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResumes()
  }, [session?.user?.email, session?.user?.name])

  if (status === 'loading') {
    return <ProfileSkeleton />
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-[#162F44] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">My Resumes</h1>
          <p className="text-[#BFBFBF]">Manage and edit your resumes</p>
        </div>

        <div className="grid gap-4">
          <Card className="bg-[#BFBFBF] hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#162F44]">
                <Plus className="h-5 w-5" />
                Create New Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/resume/create")}
                className="w-full bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {resumes.map((resume) => (
            <Card key={resume.id} className="bg-[#BFBFBF] hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#162F44]">
                  <FileText className="h-5 w-5" />
                  Resume {resume.id.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-[#697782] text-sm">
                  Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/resume/${resume.id}`)}
                    className="w-full bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white"
                  >
                    Edit Resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(resume.id);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  )
}