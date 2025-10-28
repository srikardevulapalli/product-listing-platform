'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateProductStatus } from '@/lib/api';

interface AdminReviewCardProps {
  product: Product;
  onStatusChange?: () => void;
}

export default function AdminReviewCard({ product, onStatusChange }: AdminReviewCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    setLoading(true);
    setError('');

    try {
      await updateProductStatus(product.id, status);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={product.image_url}
          alt={product.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {product.description}
        </p>
        {product.keywords && product.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-secondary rounded-md"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground pt-2">
          Created: {new Date(product.created_at).toLocaleDateString()}
        </p>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => handleStatusChange('approved')}
          disabled={loading}
          className="flex-1"
        >
          Approve
        </Button>
        <Button
          onClick={() => handleStatusChange('rejected')}
          disabled={loading}
          variant="destructive"
          className="flex-1"
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
