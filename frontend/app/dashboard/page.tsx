'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Product } from '@/types';
import ListingCard from '@/components/ListingCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Upload, 
  ShieldCheck, 
  LogOut, 
  Package,
  TrendingUp,
  Loader2 
} from 'lucide-react';

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

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        productsData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setProducts(productsData);
        setProductsLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products', {
          description: 'Please refresh the page to try again',
        });
        setProductsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const approvedProducts = products.filter(p => p.status === 'approved');
  const pendingProducts = products.filter(p => p.status === 'pending');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  My Dashboard
                </h1>
                <p className="text-sm text-gray-500">Welcome back, {user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Product
                </Button>
              </Link>
              {user.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="border-2 hover:bg-purple-50 hover:border-purple-300 transition-all">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedProducts.length}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingProducts.length}</p>
              </div>
              <Loader2 className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedProducts.length}</p>
              </div>
              <ShieldCheck className="h-12 w-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            My Products
          </h2>
          <p className="text-gray-600">Manage and track your product listings</p>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start by uploading your first product. Our AI will help you create amazing descriptions!
            </p>
            <Link href="/upload">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md text-white">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <ListingCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
