import type { PersonalInfo, Resume, ResumeSection } from '@/types';
import { cn } from '@/utils/helpers';

interface ResumePreviewProps {
  resume: Resume;
  sections: ResumeSection[];
  className?: string;
}

function ContactLine({ info }: { info: PersonalInfo }) {
  const parts = [info.email, info.phone, info.location, info.linkedin, info.github, info.website]
    .filter(Boolean);
  if (parts.length === 0) return null;
  return <p className="mt-1 text-sm text-slate-600">{parts.join(' · ')}</p>;
}

function SectionItems({ section }: { section: ResumeSection }) {
  const items = (section.content.items as Array<Record<string, unknown>>) || [];
  if (items.length === 0) return null;

  if (section.section_type === 'skills') {
    const skills = items.map((i) => i.name as string).filter(Boolean);
    return (
      <p className="text-sm text-slate-700">{skills.join(', ')}</p>
    );
  }

  if (section.section_type === 'languages') {
    return (
      <div className="space-y-1">
        {items.map((item, i) => (
          <p key={i} className="text-sm text-slate-700">
            {item.language as string} — {item.proficiency as string}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          {section.section_type === 'experience' && (
            <>
              <div className="flex justify-between">
                <p className="font-medium text-slate-900">{item.title as string}</p>
                <p className="text-sm text-slate-500">
                  {item.start_date as string} — {item.current ? 'Present' : (item.end_date as string)}
                </p>
              </div>
              <p className="text-sm text-slate-600">{item.company as string}{item.location ? ` · ${item.location}` : ''}</p>
              {item.description && <p className="mt-1 text-sm text-slate-700 whitespace-pre-line">{item.description as string}</p>}
            </>
          )}
          {section.section_type === 'education' && (
            <>
              <div className="flex justify-between">
                <p className="font-medium text-slate-900">{item.degree as string} in {item.field as string}</p>
                <p className="text-sm text-slate-500">{item.start_date as string} — {item.end_date as string || 'Present'}</p>
              </div>
              <p className="text-sm text-slate-600">{item.institution as string}</p>
              {item.description && <p className="mt-1 text-sm text-slate-700">{item.description as string}</p>}
            </>
          )}
          {section.section_type === 'projects' && (
            <>
              <p className="font-medium text-slate-900">{item.name as string}</p>
              {item.technologies && (
                <p className="text-xs text-slate-500">{(item.technologies as string[]).join(', ')}</p>
              )}
              {item.description && <p className="mt-1 text-sm text-slate-700">{item.description as string}</p>}
              {item.url && <p className="text-xs text-primary">{item.url as string}</p>}
            </>
          )}
          {section.section_type === 'certifications' && (
            <>
              <p className="font-medium text-slate-900">{item.name as string}</p>
              <p className="text-sm text-slate-600">{item.issuer as string} · {item.date as string}</p>
            </>
          )}
          {section.section_type === 'achievements' && (
            <>
              <p className="font-medium text-slate-900">{item.title as string}</p>
              {item.description && <p className="text-sm text-slate-700">{item.description as string}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function ResumePreview({ resume, sections, className }: ResumePreviewProps) {
  const info = resume.personal_info;
  const isModern = resume.template === 'modern';
  const isMinimal = resume.template === 'minimal';

  return (
    <div
      id="resume-preview"
      className={cn(
        'mx-auto w-full max-w-[210mm] bg-white text-slate-900 shadow-card',
        isModern && 'rounded-lg overflow-hidden',
        className,
      )}
    >
      {isModern && (
        <div className="bg-primary px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">{info.full_name || 'Your Name'}</h1>
          <ContactLine info={info} />
        </div>
      )}

      <div className={cn('px-8 py-6', isMinimal && 'px-10 py-8')}>
        {!isModern && (
          <header className={cn('mb-6', isMinimal ? 'text-center' : 'border-b border-slate-200 pb-4')}>
            <h1 className={cn('font-bold text-slate-900', isMinimal ? 'text-3xl' : 'text-2xl')}>
              {info.full_name || 'Your Name'}
            </h1>
            <ContactLine info={info} />
          </header>
        )}

        {info.summary && (
          <section className="mb-6">
            <h2 className={cn(
              'mb-2 font-semibold uppercase tracking-wide text-slate-800',
              isMinimal ? 'text-sm' : 'text-sm border-b border-slate-200 pb-1',
            )}>
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">{info.summary}</p>
          </section>
        )}

        {sections.map((section) => (
          <section key={section.id} className="mb-5">
            <h2 className={cn(
              'mb-2 font-semibold uppercase tracking-wide text-slate-800',
              isMinimal ? 'text-sm' : 'text-sm border-b border-slate-200 pb-1',
            )}>
              {section.title}
            </h2>
            <SectionItems section={section} />
          </section>
        ))}
      </div>
    </div>
  );
}
