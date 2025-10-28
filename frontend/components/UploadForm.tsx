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

export default function UploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setAiGenerating(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const result = await generateAIDescription(base64Image);
        
        setTitle(result.title);
        setDescription(result.description);
        if (result.keywords) {
          setKeywords(result.keywords.join(', '));
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate AI description');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !user) {
      setError('Please select an image and sign in');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);

      await createProduct({
        title,
        description,
        keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
        image_url: imageUrl,
        user_id: user.uid,
      });

      setTitle('');
      setDescription('');
      setKeywords('');
      setImageFile(null);
      setImagePreview('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-48 object-contain rounded-md border"
                />
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateAI}
            disabled={!imageFile || aiGenerating}
            className="w-full"
          >
            {aiGenerating ? 'Generating with AI...' : 'Generate Description with AI'}
          </Button>

          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., electronics, gadget, smartphone"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Product...' : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
