'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { MinimalistTemplate } from './MinimalistTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ATSFriendlyTemplate } from './ATSFriendlyTemplate';
import { StudentTemplate } from './StudentTemplate';
import { TechTemplate } from './TechTemplate';

interface CVRendererProps {
  data: CVData;
  scale?: number;
  containerId?: string;
}

export const CVRenderer: React.FC<CVRendererProps> = ({
  data,
  scale = 1,
  containerId = 'cv-document-sheet',
}) => {
  const accentColor = data.accentColor || '#6685FF';

  const renderTemplateContent = () => {
    switch (data.templateId) {
      case 'corporate':
        return <CorporateTemplate data={data} accentColor={accentColor} />;
      case 'creative':
        return <CreativeTemplate data={data} accentColor={accentColor} />;
      case 'ats':
        return <ATSFriendlyTemplate data={data} accentColor={accentColor} />;
      case 'student':
        return <StudentTemplate data={data} accentColor={accentColor} />;
      case 'tech':
        return <TechTemplate data={data} accentColor={accentColor} />;
      case 'minimalist':
      default:
        return <MinimalistTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div
      className="flex justify-center transition-transform duration-200 origin-top"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <div
        id={containerId}
        className="a4-document-sheet relative rounded-md overflow-hidden bg-white"
        style={{
          width: '210mm',
          minHeight: '297mm',
        }}
      >
        {renderTemplateContent()}
      </div>
    </div>
  );
};
