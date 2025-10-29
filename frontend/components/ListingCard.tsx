'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/lib/api';
import { toast } from 'sonner';

interface ListingCardProps {
  product: Product;
  onDelete?: () => void;
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

export default function ListingCard({ product, onDelete }: ListingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const config = statusConfig[product.status];
  const StatusIcon = config.icon;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    const toastId = toast.loading('Deleting product...');

    try {
      await deleteProduct(product.id);
      toast.success('Product deleted', {
        id: toastId,
        description: `"${product.title}" has been removed`,
      });
      if (onDelete) {
        onDelete();
      }
    } catch (err: any) {
      toast.error('Failed to delete product', {
        id: toastId,
        description: err.response?.data?.detail || 'Please try again',
      });
    } finally {
      setDeleting(false);
    }
  };

  const shouldTruncate = product.description.length > 150;

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
        <p className={`text-sm text-gray-600 leading-relaxed ${!expanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
          {product.description}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
        {product.keywords && product.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(showAllTags ? product.keywords : product.keywords.slice(0, 4)).map((keyword, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {keyword}
              </span>
            ))}
            {product.keywords.length > 4 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                {showAllTags ? 'Show less' : `+${product.keywords.length - 4} more`}
              </button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 bg-gray-50 flex items-center justify-between border-t">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          Created: {new Date(product.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          disabled={deleting}
          className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
