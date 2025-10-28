'use client';

import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ListingCardProps {
  product: Product;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ListingCard({ product }: ListingCardProps) {
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
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{product.title}</CardTitle>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[product.status]}`}>
            {product.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
        {product.keywords && product.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Created: {new Date(product.created_at).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
