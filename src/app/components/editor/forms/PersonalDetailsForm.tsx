import { useState, useRef } from 'react';
import { PersonalDetail } from '@/types/resume';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';
import { getCroppedImg } from '@/lib/canvasUtils';
import Cropper from 'react-easy-crop';
import { Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PersonalDetailsFormProps {
  data: PersonalDetail;
  onChange: (newData: Partial<PersonalDetail>) => void;
}

export default function PersonalDetailsForm({ data, onChange }: PersonalDetailsFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

    // Read file as Data URL and open editor
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsEditorOpen(true);
    };
    reader.readAsDataURL(file);

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedArea: { x: number; y: number; width: number; height: number }, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSavePhoto = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);

    try {
      // Crop the image first
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Convert Blob to File for upload
      const croppedFile = new File([croppedBlob], 'profile-photo.jpg', { type: 'image/jpeg' });
      
      // Upload cropped image to Cloudinary
      const imageUrl = await uploadToCloudinary(croppedFile);
      handleChange('photoUrl', imageUrl);
      
      // Close editor and reset states
      closeEditor();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
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

      {/* Cropper Modal */}
      {isEditorOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Edit Photo</h3>
              <button
                type="button"
                onClick={closeEditor}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="px-6 py-4">
              <div className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={handleCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 space-y-4 border-t border-slate-200">
              {/* Zoom Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Zoom</label>
                  <span className="text-sm text-slate-500">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Save Photo'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}