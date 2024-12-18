"use client";
import React, { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

import { FormValues } from './types';
import { steps } from './schema';
import { NavigationButtons } from './components/NavigationButtons';
import { CareerObjectiveStep } from './form-steps/CareerObjectiveStep';
import { JobTitleStep } from './form-steps/JobTitleStep';
import { 
  PersonalInfoStep, 
  WorkExperienceStep, 
  EducationStep, 
  SkillsStep, 
  ProjectsStep, 
  LanguagesStep, 
  CertificationsStep
} from './form-steps';
import { useRouter } from 'next/navigation';

// Local Storage Helper Functions
const LOCAL_STORAGE_KEY = 'resumeitnow_form_data';

// Type for localStorage storage structure
interface LocalStorageData {
  formData: Partial<FormValues>;
  currentStep: number;
  timestamp: string;
}

const saveFormDataToLocalStorage = (data: Partial<FormValues>, currentStep: number) => {
  try {
    const storageData: LocalStorageData = {
      formData: data,
      currentStep,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

const getFormDataFromLocalStorage = (): LocalStorageData | null => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error retrieving form data from localStorage:', error);
    return null;
  }
};

const clearLocalStorageData = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export default function StepForm() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(steps[step].schema),
    defaultValues: {
      personalDetails: {
        fullName: localStorage.getItem("resumeitnow_name") || session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        linkedin: "",
        github: "",
        location: ""
      },
      objective: "",
      jobTitle: "",
      workExperience: [{
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        description: ""
      }],
      education: [{
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        grade: ""
      }],
      skills: [{
        category: "",
        skills: ""
      }],
      projects: [{
        projectName: "",
        description: "",
        link: ""
      }],
      languages: [{
        language: "",
        proficiency: "Basic"
      }],
      certifications: [{
        certificationName: "",
        issuingOrganization: "",
        issueDate: ""
      }]
    }
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = getFormDataFromLocalStorage();
    
    if (savedFormData && savedFormData.formData) {
      // Restore form data and step
      reset(savedFormData.formData);
      setStep(savedFormData.currentStep || 0);
    }
    
    // Mark initial load as complete
    setIsInitialLoad(false);
  }, [reset]);

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    // Skip saving during initial load
    if (isInitialLoad) return;

    // Use strong typing for watch function
    const subscription = watch(() => {
      // Ensure we only save the current step's data
      const currentStepData = { ...getValues() };
      saveFormDataToLocalStorage(currentStepData, step);
    });

    return () => subscription.unsubscribe();
  }, [watch, step, isInitialLoad, getValues]);

  const onSubmit = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = session?.user?.email || "temp_resumes";
      
      const resumeId = `resume_${new Date().getTime()}`;
      const docRef = doc(db, `users/${userId}/resumes/${resumeId}`);

      const countRef = doc(db, "info", "resumesCreated");
      await updateDoc(countRef, {
        count: increment(1)
      });

      // Get all form data
      const completeFormData = getValues();
      
      await setDoc(docRef, {
        ...completeFormData,
        ...completeFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Show success toast
      toast({
        title: "Success",
        description: "Resume saved successfully!.. Redirecting to Resume",
        duration: 3000,
      });

      // Clear localStorage after successful submission
      clearLocalStorageData();

      // Clear localStorage after successful submission
      clearLocalStorageData();

      setTimeout(() => {
        router.push(`/resume/${resumeId}`);
      }, 3000);

    } catch (error) {
      console.error("Error saving resume:", error);
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error saving resume. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({
    control,
    name: 'workExperience'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: skillsFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages'
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: 'certifications'
  });

  const handlePrevious = () => {
    if (step > 0) {
      setStep(prevStep => {
        // Save the current step's data before moving back
        const currentStepData = { ...getValues() };
        saveFormDataToLocalStorage(currentStepData, prevStep - 1);
        return prevStep - 1;
      });
    }
  };

  const renderStep = () => {
    const commonProps = {
      register,
      errors,
      control,
      watch,
      setValue
    };

    switch(step) {
      case 0:
        return <PersonalInfoStep {...commonProps} />;
      case 1:
        return <CareerObjectiveStep {...commonProps} />;
      case 2:
        return <JobTitleStep {...commonProps} />;
      case 3:
        return <WorkExperienceStep {...commonProps} fields={workExperienceFields} append={appendWorkExperience} remove={removeWorkExperience}/>;
      case 4:
        return <ProjectsStep {...commonProps} fields={projectFields} append={appendProject} remove={removeProject}/>;
      case 5:
        return <EducationStep {...commonProps} fields={educationFields} append={appendEducation} remove={removeEducation}/>;
      case 6:
        return <SkillsStep {...commonProps} fields={skillsFields} append={appendSkill} remove={removeSkill}/>;
      case 7:
        return <LanguagesStep {...commonProps} fields={languageFields} append={appendLanguage} remove={removeLanguage}/>;
      case 8:
        return <CertificationsStep {...commonProps} fields={certificationFields} append={appendCertification} remove={removeCertification}/>;
      default:
        return null;
    }
  };

  // Progress calculation
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Slider */}
        <div className="mb-12">
          <div className="relative">
            {/* Progress bar */}
            <div className="h-1 w-full bg-[#E5E7EB] rounded-full">
              <div
                className="h-full bg-[#CB3F4A] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step markers */}
            <div className="absolute top-0 left-0 w-full flex justify-between -mt-2">
              {steps.map((stepInfo, index) => {
                const isCompleted = index < step;
                const isCurrent = index === step;
                const stepPosition = (index / (steps.length - 1)) * 100;
                
                return (
                  <div
                    key={index}
                    className="relative"
                    style={{ left: `${stepPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Step marker */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#CB3F4A] border-[#CB3F4A]"
                          : isCurrent
                          ? "bg-white border-[#CB3F4A]"
                          : "bg-white border-[#E5E7EB]"
                      }`}
                    />
                    
                    {/* Step label */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium ${
                          isCurrent ? "text-[#CB3F4A]" : "text-gray-500"
                        }`}
                      >
                        {stepInfo.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">{steps[step].title}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}
            <NavigationButtons
              step={step}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              isSubmitting={isSubmitting}
            />
          </form>
        </Card>
      </div>
      <Toaster />
    </main>
  );
}