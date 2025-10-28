'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Product } from '@/types';
import AdminReviewCard from '@/components/AdminReviewCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    let q;
    if (filter === 'pending') {
      q = query(
        collection(db, 'products'),
        where('status', '==', 'pending'),
        where('is_deleted', '==', false)
      );
    } else {
      q = query(
        collection(db, 'products'),
        where('is_deleted', '==', false)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      productsData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setProducts(productsData);
      setProductsLoading(false);
    });

    return () => unsubscribe();
  }, [user, filter]);

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Review</h2>
            <div className="flex gap-2">
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pending Only
              </Button>
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All Products
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Review and approve or reject product listings. Real-time updates.
          </p>
        </div>

        {productsLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === 'pending' ? 'No pending products' : 'No products'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <AdminReviewCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
