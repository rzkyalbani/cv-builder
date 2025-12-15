import { useState, useRef } from 'react';
import { PersonalDetail } from '@/types/resume';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';
import { Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PersonalDetailsFormProps {
  data: PersonalDetail;
  onChange: (newData: Partial<PersonalDetail>) => void;
}

export default function PersonalDetailsForm({ data, onChange }: PersonalDetailsFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof PersonalDetail, value: string) => {
    onChange({ [field]: value });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!validateImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      handleChange('photoUrl', imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    handleChange('photoUrl', '');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          type="text"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          type="text"
          value={data.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Main St, City, Country"
        />
      </div>

      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload profile photo"
          />
          
          {data.photoUrl ? (
            // UI State 1: Has Photo - Show image with remove button
            <div className="relative w-24 h-24 group">
              <img
                src={data.photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="w-8 h-8 rounded-full p-0"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            // UI State 2: No Photo - Show upload button
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-slate-400 flex flex-col items-center justify-center relative overflow-hidden"
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                ) : (
                  <Camera className="h-6 w-6 text-slate-400" />
                )}
                <span className="sr-only">Upload photo</span>
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Upload a profile photo (max 5MB, JPEG/PNG/GIF/WebP)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            type="text"
            value={data.socialLinks?.linkedin || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, linkedin: e.target.value }
            })}
            placeholder="LinkedIn URL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            type="text"
            value={data.socialLinks?.github || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, github: e.target.value }
            })}
            placeholder="GitHub URL"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio</Label>
          <Input
            id="portfolio"
            type="text"
            value={data.socialLinks?.portfolio || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, portfolio: e.target.value }
            })}
            placeholder="Portfolio URL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            type="text"
            value={data.socialLinks?.twitter || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, twitter: e.target.value }
            })}
            placeholder="Twitter URL"
          />
        </div>
      </div>
    </div>
  );
}