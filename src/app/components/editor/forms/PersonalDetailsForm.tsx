import { ChangeEvent } from 'react';
import { PersonalDetail } from '@/types/resume';

interface PersonalDetailsFormProps {
  data: PersonalDetail;
  onChange: (newData: Partial<PersonalDetail>) => void;
}

export default function PersonalDetailsForm({ data, onChange }: PersonalDetailsFormProps) {
  const handleChange = (field: keyof PersonalDetail, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headline
        </label>
        <input
          type="text"
          value={data.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john.doe@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123 Main St, City, Country"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo URL
        </label>
        <input
          type="text"
          value={data.photoUrl || ''}
          onChange={(e) => handleChange('photoUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            type="text"
            value={data.socialLinks?.linkedin || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, linkedin: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="LinkedIn URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub
          </label>
          <input
            type="text"
            value={data.socialLinks?.github || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, github: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="GitHub URL"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio
          </label>
          <input
            type="text"
            value={data.socialLinks?.portfolio || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, portfolio: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Portfolio URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Twitter
          </label>
          <input
            type="text"
            value={data.socialLinks?.twitter || ''}
            onChange={(e) => onChange({
              socialLinks: { ...data.socialLinks, twitter: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Twitter URL"
          />
        </div>
      </div>
    </div>
  );
}