'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Product } from '@/types';
import ListingCard from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'products'),
      where('user_id', '==', user.uid),
      where('is_deleted', '==', false)
    );

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
  }, [user]);

  if (loading || !user) {
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
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/upload">
              <Button>Upload Product</Button>
            </Link>
            {user.isAdmin && (
              <Link href="/admin">
                <Button variant="outline">Admin Panel</Button>
              </Link>
            )}
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">My Products</h2>
          <p className="text-muted-foreground">
            View and manage your product listings. Real-time updates when status changes.
          </p>
        </div>

        {productsLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Link href="/upload">
              <Button>Upload Your First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ListingCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
