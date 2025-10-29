'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateAIDescription, createProduct } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Upload, Loader2, CheckCircle2 } from 'lucide-react';

export default function UploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected successfully');
    }
  };

  const handleGenerateAI = async () => {
    if (!user) {
      toast.error('Please sign in to use AI features', {
        description: 'You need to be authenticated to generate AI descriptions',
      });
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }

    setAiGenerating(true);
    const toastId = toast.loading('AI is analyzing your product image...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          const result = await generateAIDescription(base64Image);
          
          setTitle(result.title);
          setDescription(result.description);
          if (result.keywords) {
            setKeywords(result.keywords.join(', '));
          }
          
          toast.success('AI description generated!', {
            id: toastId,
            description: 'Your product details have been filled automatically',
            icon: <Sparkles className="h-4 w-4" />,
          });
        } catch (err: any) {
          console.error('AI generation error:', err);
          
          if (err.response?.status === 401) {
            toast.error('Authentication required', {
              id: toastId,
              description: 'Please sign in again to use AI features',
            });
          } else {
            toast.error('AI generation failed', {
              id: toastId,
              description: err.response?.data?.detail || 'Could not analyze the image. Please try again.',
            });
          }
        } finally {
          setAiGenerating(false);
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      toast.error('Failed to read image', { id: toastId });
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please sign in to upload products',
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/auth/login',
        },
      });
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    const toastId = toast.loading('Uploading your product...');

    try {
      setUploadProgress(25);
      const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${imageFile.name}`);
      
      toast.loading('Uploading image to storage...', { id: toastId });
      await uploadBytes(storageRef, imageFile);
      setUploadProgress(50);
      
      toast.loading('Getting image URL...', { id: toastId });
      const imageUrl = await getDownloadURL(storageRef);
      setUploadProgress(75);

      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);

      toast.loading('Creating product...', { id: toastId });
      await createProduct({
        title,
        description,
        keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
        image_url: imageUrl,
        user_id: user.uid,
      });
      setUploadProgress(100);

      toast.success('Product created successfully!', {
        id: toastId,
        description: `"${title}" is now live on your dashboard`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

      setTitle('');
      setDescription('');
      setKeywords('');
      setImageFile(null);
      setImagePreview('');
      setUploadProgress(0);
      
      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (err: any) {
      console.error('Product creation error:', err);
      setUploadProgress(0);
      
      if (err.response?.status === 401 || err.code === 'auth/id-token-expired') {
        toast.error('Session expired', {
          id: toastId,
          description: 'Please sign in again to continue',
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/auth/login',
          },
        });
      } else if (err.code?.includes('storage')) {
        toast.error('Storage error', {
          id: toastId,
          description: 'Failed to upload image. Please check Firebase Storage permissions.',
        });
      } else {
        toast.error('Failed to create product', {
          id: toastId,
          description: err.response?.data?.detail || err.message || 'Please try again',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Product
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Product Image *
            </Label>
            <div className="relative">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                disabled={loading}
                className="cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              />
            </div>
            {imagePreview && (
              <div className="mt-3 relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-64 object-contain rounded-lg border-2 border-gray-200 shadow-sm mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateAI}
            disabled={!imageFile || aiGenerating || loading}
            className="w-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            {aiGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Description with AI
              </>
            )}
          </Button>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Product Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              required
              disabled={loading}
              className="transition-all focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Product Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              required
              disabled={loading}
              className="transition-all focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm font-medium">
              Keywords (comma-separated)
            </Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., electronics, gadget, smartphone"
              disabled={loading}
              className="transition-all focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Upload Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-white" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create Product
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
