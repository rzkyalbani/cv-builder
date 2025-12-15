import { forwardRef } from 'react';
import { ResumeContent } from '@/types/resume';
import ModernTemplate from '@/app/components/templates/ModernTemplate';
import ClassicTemplate from '@/app/components/templates/ClassicTemplate';

interface ResumePreviewProps {
  data: ResumeContent;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
  const layout = data.settings?.layout || 'modern';

  return (
    <div ref={ref}>
      {layout === 'classic' ? (
        <ClassicTemplate data={data} />
      ) : (
        <ModernTemplate data={data} />
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
