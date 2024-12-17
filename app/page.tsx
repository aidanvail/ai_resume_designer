"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layout, Sparkles, Rocket } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import type { FC } from 'react';

const TemplateTabs = ({ templates }: { templates: string[] }) => {
  return (
    <Tabs defaultValue="modern" className="w-full max-w-3xl">
      <TabsList className="grid w-full grid-cols-3">
        {templates.map((template) => (
          <TabsTrigger key={template} value={template.toLowerCase()}>
            {template}
          </TabsTrigger>
        ))}
      </TabsList>
      {templates.map((template) => (
        <TabsContent key={template} value={template.toLowerCase()}>
          <Card>
            <CardContent className="p-6">
              <div className="aspect-[1366/2739] rounded-lg bg-muted flex items-center justify-center">
                <Image
                  src={`/assets/${template}.png`}
                  alt={template}
                  width={720}
                  height={368}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

interface ResumeCount {
  count: number
}

async function getResumesCreated(): Promise<number> {
  try {
    const infoDoc = await getDoc(doc(db, "info", "resumesCreated"));
    return infoDoc.exists() ? (infoDoc.data() as ResumeCount).count : 0;
  } catch (error) {
    console.error("Error fetching resumes count:", error);
    return 0;
  }
}

const FeatureCard: FC<{
  icon: React.ReactNode;
  title: string;
  features: string[];
}> = ({ icon, title, features }) => (
  <Card className="bg-[#BFBFBF] transition-all duration-300 hover:shadow-lg">
    <CardHeader>
      <div className="h-12 w-12 rounded-full bg-[#CB3F4A]/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <CardTitle className="text-xl text-[#162F44]">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-[#697782]">
            <ArrowRight className="h-4 w-4 text-[#CB3F4A]" />
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const templatesRef = useRef<HTMLDivElement>(null);
  const [resumesCreated, setResumesCreated] = useState(0);
  const templates = ["Modern", "Professional", "Minimal"];

  useEffect(() => {
    const fetchResumesCount = async () => {
      const count = await getResumesCreated();
      setResumesCreated(count);
    };
    fetchResumesCount();
  }, []);

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#162F44]">
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#162F44]">
        <div className="container px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            AI Resume Builder and Enhancer
          </h1>
          <p className="text-xl mb-12 text-[#BFBFBF] max-w-2xl mx-auto">
            Create professional resumes in minutes with our AI-powered resume builder.
            No sign-up required, 100% free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resume/create"
              className="inline-flex items-center justify-center rounded-md bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white px-8 py-2 text-lg font-medium shadow transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-[#CB3F4A] text-white hover:bg-[#CB3F4A]/10"
              onClick={scrollToTemplates}
            >
              View Templates
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#162F44] flex flex-col items-center">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Why Choose AI Resume Builder and Enhancer?</h2>
            <p className="text-[#BFBFBF] max-w-2xl mx-auto">
              Built with modern tools and designed for everyone. Create professional resumes 
              without the hassle of watermarks or hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Layout className="h-6 w-6 text-[#CB3F4A]" />}
              title="Professional Templates"
              features={[
                "ATS-friendly designs",
                "Multiple layout options",
                "Customizable sections",
                "Print-ready formats"
              ]}
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-[#CB3F4A]" />}
              title="AI-Powered"
              features={[
                "Smart content suggestions",
                "Auto Generate Content",
                "Keyword optimization",
                "Powered by Llama 3.1"
              ]}
            />
            <FeatureCard
              icon={<Rocket className="h-6 w-6 text-[#CB3F4A]" />}
              title="Built for Everyone"
              features={[
                "No sign-up required",
                "100% free, forever",
                "Export to PDF",
                "Open-source code"
              ]}
            />
          </div>
        </div>
      </section>

      <section ref={templatesRef} className="py-24 scroll-mt-16 flex flex-col items-center bg-[#162F44]">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Resume Templates</h2>
            <p className="text-[#BFBFBF] max-w-2xl mx-auto">
              Choose from our collection of professional templates.
            </p>
          </div>

          <div className="flex justify-center">
            <TemplateTabs templates={templates} />
          </div>
        </div>
      </section>
    </main>
  );
}