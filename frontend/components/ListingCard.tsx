'use client';

import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ListingCardProps {
  product: Product;
}

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: AlertCircle,
    label: 'Pending Review'
  },
  approved: {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle2,
    label: 'Approved'
  },
  rejected: {
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle,
    label: 'Rejected'
  },
};

export default function ListingCard({ product }: ListingCardProps) {
  const config = statusConfig[product.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-52 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${config.color} border flex items-center gap-1.5 shadow-md`}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {product.description}
        </p>
        {product.keywords && product.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.keywords.slice(0, 4).map((keyword, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {keyword}
              </span>
            ))}
            {product.keywords.length > 4 && (
              <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{product.keywords.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 bg-gray-50 flex items-center gap-1.5 border-t">
        <Clock className="h-3 w-3" />
        Created: {new Date(product.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </CardFooter>
    </Card>
  );
}
