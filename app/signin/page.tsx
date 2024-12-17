"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const email = session?.user?.email;
    if (typeof email === "string") {
      const loadSettings = async () => {
        try {
          const docRef = doc(db, 'users', email, 'settings', 'preferences');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(data);

            // Also set to localStorage as backup
            localStorage.setItem('resumeitnow_name', data.displayName);
            localStorage.setItem('resumeitnow_template', data.defaultTemplate);
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      };
      loadSettings();
      router.push('/profile');
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#162F44] px-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Welcome Back
          </h1>
          <p className="text-[#BFBFBF]">
            Sign in to save and manage your resumes
          </p>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => signIn('google')}
            className="w-full bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white"
          >
            Sign in with Google
          </Button>
          <p className="text-xs text-[#697782]">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
