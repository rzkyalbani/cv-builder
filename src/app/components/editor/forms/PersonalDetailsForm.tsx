import { PersonalDetail } from '@/types/resume';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface PersonalDetailsFormProps {
  data: PersonalDetail;
  onChange: (newData: Partial<PersonalDetail>) => void;
}

export default function PersonalDetailsForm({ data, onChange }: PersonalDetailsFormProps) {
  const handleChange = (field: keyof PersonalDetail, value: string) => {
    onChange({ [field]: value });
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
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input
          id="photoUrl"
          type="text"
          value={data.photoUrl || ''}
          onChange={(e) => handleChange('photoUrl', e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
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