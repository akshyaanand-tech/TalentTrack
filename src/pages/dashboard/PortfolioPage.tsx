import { useEffect, useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createPortfolio,
  deletePortfolio,
  fetchPortfolios,
  updatePortfolio,
} from '@/services/portfolioService';
import { PortfolioPreview, PORTFOLIO_THEMES } from '@/components/portfolio/PortfolioPreview';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Portfolio, PortfolioProject, PortfolioTheme } from '@/types';
import { generateId } from '@/utils/resumeDefaults';
import { formatDate } from '@/utils/helpers';

export function PortfolioPage() {
  const { user, profile } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Portfolio | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<PortfolioTheme>('modern');
  const [skills, setSkills] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchPortfolios(user.id).then(setPortfolios).finally(() => setLoading(false));
  }, [user]);

  function loadPortfolio(p: Portfolio) {
    setActive(p);
    setTitle(p.title);
    setBio(p.bio);
    setTheme(p.theme);
    setSkills(p.skills.join(', '));
    setGithubUrl(p.github_url || '');
    setLinkedinUrl(p.linkedin_url || '');
    setProjects(p.projects);
  }

  function handleNew() {
    setActive(null);
    setTitle(profile?.full_name ? `${profile.full_name}'s Portfolio` : 'My Portfolio');
    setBio(profile?.bio || '');
    setTheme('modern');
    setSkills((profile?.skills || []).join(', '));
    setGithubUrl(profile?.github_url || '');
    setLinkedinUrl(profile?.linkedin_url || '');
    setProjects([]);
  }

  async function handleSave() {
    if (!user || !title.trim()) return;
    setSaving(true);
    const data = {
      title,
      bio,
      theme,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      projects,
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
    };

    try {
      if (active) {
        await updatePortfolio(active.id, data);
        const updated = { ...active, ...data };
        setActive(updated);
        setPortfolios((prev) => prev.map((p) => (p.id === active.id ? updated : p)));
      } else {
        const created = await createPortfolio(user.id, data);
        setActive(created);
        setPortfolios((prev) => [created, ...prev]);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    await deletePortfolio(user.id, id);
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    if (active?.id === id) handleNew();
  }

  function addProject() {
    setProjects((prev) => [
      ...prev,
      { id: generateId(), name: '', description: '', technologies: [], url: '' },
    ]);
  }

  function updateProject(index: number, field: keyof PortfolioProject, value: unknown) {
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }

  function removeProject(index: number) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  function handleExport() {
    const html = document.getElementById('portfolio-preview')?.outerHTML;
    if (!html) return;
    const blob = new Blob([`<!DOCTYPE html><html><head><title>${title}</title></head><body>${html}</body></html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const previewData: Portfolio = {
    id: active?.id || '',
    user_id: user?.id || '',
    title,
    bio,
    theme,
    skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
    projects,
    experience: profile?.experience || [],
    github_url: githubUrl || null,
    linkedin_url: linkedinUrl || null,
    is_published: false,
    created_at: active?.created_at || '',
    updated_at: active?.updated_at || '',
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Portfolio Generator</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Build a personal portfolio from your profile and projects.</p>
        </div>
        <Button onClick={handleNew}><Plus className="h-4 w-4" /> New Portfolio</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <h2 className="font-medium text-slate-900 dark:text-white">Portfolio Details</h2>
            <div className="mt-4 space-y-3">
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {PORTFOLIO_THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`rounded-lg border p-2 text-sm ${theme === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Python" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="GitHub" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                <Input label="LinkedIn" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-slate-900 dark:text-white">Projects</h2>
              <Button variant="outline" size="sm" onClick={addProject}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="mt-4 space-y-3">
              {projects.map((project, i) => (
                <div key={project.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => removeProject(i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={project.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="Project name" />
                  <Textarea value={project.description} onChange={(e) => updateProject(i, 'description', e.target.value)} rows={2} className="mt-2" placeholder="Description" />
                  <Input value={project.technologies.join(', ')} onChange={(e) => updateProject(i, 'technologies', e.target.value.split(',').map((s) => s.trim()))} placeholder="Technologies" className="mt-2" />
                  <Input value={project.url || ''} onChange={(e) => updateProject(i, 'url', e.target.value)} placeholder="URL" className="mt-2" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button loading={saving} onClick={handleSave}>Save Portfolio</Button>
            <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4" /> Export HTML</Button>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-slate-500">Preview</h2>
          <div id="portfolio-preview">
            <PortfolioPreview portfolio={previewData} />
          </div>
        </div>
      </div>

      {portfolios.length > 0 && (
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">Saved Portfolios</h2>
          <div className="mt-4 space-y-2">
            {portfolios.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <button type="button" onClick={() => loadPortfolio(p)} className="text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.title}</p>
                  <p className="text-xs text-slate-500 capitalize">{p.theme} · {formatDate(p.updated_at)}</p>
                </button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
