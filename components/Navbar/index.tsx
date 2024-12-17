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
  { title: 'About', href: '/about' },
  { title: 'Create', href: '/resume/create' },
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

  if (!mounted) return null;

  const handleSignOut = async () => {
    localStorage.clear();
    await signOut({ redirect: false });
    router.push('/');
  };

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

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push(link.href)}
            >
              {link.title}
            </Button>
          ))}
          <div className="mt-4">
            {session ? (
              <UserMenu />
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/signin')}
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="fixed top-4 right-4 z-50">
      {!session ? (
        <Button
          onClick={() => signIn('google')}
          className="bg-[#CB3F4A] hover:bg-[#CB3F4A]/90 text-white"
        >
          Sign In
        </Button>
      ) : null}
    </div>
  );
}