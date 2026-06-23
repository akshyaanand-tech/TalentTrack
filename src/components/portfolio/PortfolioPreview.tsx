import type { Portfolio, PortfolioTheme } from '@/types';
import { cn } from '@/utils/helpers';

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  className?: string;
}

export function PortfolioPreview({ portfolio, className }: PortfolioPreviewProps) {
  const isModern = portfolio.theme === 'modern';
  const isMinimal = portfolio.theme === 'minimal';

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white text-slate-900 shadow-card',
        className,
      )}
    >
      {isModern && (
        <div className="bg-primary px-8 py-10 text-white">
          <h1 className="text-3xl font-bold">{portfolio.title}</h1>
          {portfolio.bio && <p className="mt-3 max-w-lg text-sm leading-relaxed opacity-90">{portfolio.bio}</p>}
          <div className="mt-4 flex gap-4 text-sm">
            {portfolio.github_url && <span>{portfolio.github_url}</span>}
            {portfolio.linkedin_url && <span>{portfolio.linkedin_url}</span>}
          </div>
        </div>
      )}

      <div className={cn('px-8 py-8', isMinimal && 'text-center')}>
        {!isModern && (
          <header className={cn('mb-8', !isMinimal && 'border-b border-slate-200 pb-6')}>
            <h1 className={cn('font-bold', isMinimal ? 'text-4xl' : 'text-3xl')}>{portfolio.title}</h1>
            {portfolio.bio && <p className="mt-3 text-slate-600 leading-relaxed">{portfolio.bio}</p>}
            <div className="mt-3 flex gap-4 text-sm text-primary justify-center sm:justify-start">
              {portfolio.github_url && <span>{portfolio.github_url}</span>}
              {portfolio.linkedin_url && <span>{portfolio.linkedin_url}</span>}
            </div>
          </header>
        )}

        {portfolio.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">Skills</h2>
            <div className={cn('flex flex-wrap gap-2', isMinimal && 'justify-center')}>
              {portfolio.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {portfolio.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                  <h3 className="font-medium text-slate-900">{project.name}</h3>
                  {project.technologies.length > 0 && (
                    <p className="mt-1 text-xs text-slate-500">{project.technologies.join(', ')}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-600">{project.description}</p>
                  {project.url && <p className="mt-2 text-xs text-primary">{project.url}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {portfolio.experience.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">Experience</h2>
            <div className="space-y-4">
              {portfolio.experience.map((exp) => (
                <div key={exp.id}>
                  <p className="font-medium text-slate-900">{exp.title} at {exp.company}</p>
                  <p className="text-sm text-slate-500">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</p>
                  {exp.description && <p className="mt-1 text-sm text-slate-600">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export const PORTFOLIO_THEMES: Array<{ id: PortfolioTheme; name: string }> = [
  { id: 'modern', name: 'Modern' },
  { id: 'professional', name: 'Professional' },
  { id: 'minimal', name: 'Minimal' },
];
