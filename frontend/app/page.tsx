'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Product Listing Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered product descriptions with Firebase storage and real-time updates
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/auth/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
