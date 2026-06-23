import { useEffect, useState } from 'react';
import { Copy, Download, Mail, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  generateCoverLetter,
  fetchCoverLetters,
  saveCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
} from '@/services/coverLetterService';
import { isGeminiConfigured } from '@/lib/gemini';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CoverLetter } from '@/types';
import { formatDate } from '@/utils/helpers';

export function CoverLetterPage() {
  const { user, profile } = useAuth();
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchCoverLetters(user.id).then(setLetters).finally(() => setLoading(false));
  }, [user]);

  async function handleGenerate() {
    if (!companyName || !jobTitle) {
      setError('Company name and job title are required.');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const letter = await generateCoverLetter({
        companyName,
        jobTitle,
        experience,
        skills,
        candidateName: profile?.full_name || undefined,
      });
      setContent(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!user || !content.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateCoverLetter(editingId, { content, company_name: companyName, job_title: jobTitle });
        setLetters((prev) =>
          prev.map((l) =>
            l.id === editingId ? { ...l, content, company_name: companyName, job_title: jobTitle } : l,
          ),
        );
      } else {
        const saved = await saveCoverLetter(user.id, {
          company_name: companyName,
          job_title: jobTitle,
          content,
          skills_used: skills.split(',').map((s) => s.trim()).filter(Boolean),
        });
        setLetters((prev) => [saved, ...prev]);
        setEditingId(saved.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(content);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companyName || 'draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadLetter(letter: CoverLetter) {
    setEditingId(letter.id);
    setCompanyName(letter.company_name);
    setJobTitle(letter.job_title);
    setContent(letter.content);
  }

  async function handleDelete(id: string) {
    await deleteCoverLetter(id);
    setLetters((prev) => prev.filter((l) => l.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setContent('');
    }
  }

  function handleNew() {
    setEditingId(null);
    setCompanyName('');
    setJobTitle('');
    setExperience('');
    setSkills('');
    setContent('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Cover Letter Generator
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Generate tailored cover letters for your applications.
          </p>
        </div>
        <Button variant="outline" onClick={handleNew}>New Letter</Button>
      </div>

      {!isGeminiConfigured() && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">Input Details</h2>
          <div className="mt-4 space-y-4">
            <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input label="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Textarea label="Your Experience" value={experience} onChange={(e) => setExperience(e.target.value)} rows={3} placeholder="Brief summary of relevant experience..." />
            <Input label="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js" />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button loading={generating} onClick={handleGenerate} disabled={!isGeminiConfigured()}>
              <Mail className="h-4 w-4" /> Generate
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-slate-900 dark:text-white">Cover Letter</h2>
            {content && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="mt-4 font-serif"
            placeholder="Generated cover letter will appear here..."
          />
          {content && (
            <Button className="mt-4" loading={saving} onClick={handleSave}>Save</Button>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="font-medium text-slate-900 dark:text-white">History</h2>
        {loading ? (
          <LoadingSpinner className="mt-4" />
        ) : letters.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No cover letters saved yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {letters.map((letter) => (
              <div key={letter.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <button type="button" onClick={() => loadLetter(letter)} className="text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {letter.company_name} — {letter.job_title}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(letter.created_at)}</p>
                </button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(letter.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
