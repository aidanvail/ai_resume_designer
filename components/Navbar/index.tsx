/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ThemeSwitch from '../ThemeSwitch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import router from 'next/router';

interface Settings {
  displayName: string | null | undefined;
  defaultTemplate: string;
}

interface NavLink {
  title: string;
  href: string;
}

const navLinks: NavLink[] = [
  { title: 'Home', href: '/' },
 
 
  
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    displayName: '',
    defaultTemplate: 'modern'
  });

  useEffect(() => {
    setMounted(true);
    setSettings({
      displayName: window.localStorage.getItem("resumeitnow_name") || session?.user?.name,
      defaultTemplate: window.localStorage.getItem("resumeitnow_template") || 'modern'
    });
  }, [session]);

  // Check if we're in the resume builder
  const isResumeBuilder = typeof window !== 'undefined' && window.location.pathname.includes('/resume-builder');

  if (!mounted) return null;

  const handleSignOut = async () => {
    localStorage.clear();
    await signOut({ redirect: false });
    router.push('/');
  };

  // If we're in the resume builder, show a minimal navbar
  if (isResumeBuilder) {
    return (
      <header className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          {session ? (
            <UserMenu />
          ) : (
            <Button variant="outline" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </div>
      </header>
    );
  }

  // Regular navbar for other pages
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <nav className="flex items-center gap-6">
          {navLinks.map((link, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => router.push(link.href)}
            >
              {link.title}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          {session ? (
            <UserMenu />
          ) : (
            <Button variant="outline" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full md:w-auto">
        {settings.displayName || session?.user?.name || 'User'}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-400 cursor-pointer" onClick={handleSignOut}>
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

function handleSignOut(event: React.MouseEvent<HTMLDivElement>): void {
  throw new Error('Function not implemented.');
}
