import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  FileText,
  Copy,
  Trash2,
  Star,
  Pencil,
} from 'lucide-react';
import { useResumes } from '@/hooks/useResumes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ResumeEditorPage } from '@/pages/dashboard/ResumeEditorPage';
import { RESUME_TEMPLATES } from '@/utils/resumeDefaults';
import { formatDate } from '@/utils/helpers';

function ResumeListView() {
  const navigate = useNavigate();
  const { resumes, loading, error, create, remove, duplicate, setPrimary } = useResumes();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTemplate, setNewTemplate] = useState('modern');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const resume = await create(newTitle.trim(), newTemplate);
      navigate(`/dashboard/resume/${resume.id}`);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Create and manage your professional resumes.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          New Resume
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {showCreate && (
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">Create New Resume</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Resume Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Software Engineer Resume"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Template
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RESUME_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNewTemplate(t.id)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      newTemplate === t.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button loading={creating} onClick={handleCreate}>Create</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {resumes.length === 0 ? (
        <Card className="flex flex-col items-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            No resumes yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
            Create your first resume with structured sections for education, experience, projects, and skills.
          </p>
          <Button className="mt-6" onClick={() => setShowCreate(true)}>
            Create Resume
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} padding="sm" className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                {resume.is_primary && (
                  <Badge className="bg-primary/10 text-primary">Primary</Badge>
                )}
              </div>
              <h3 className="mt-3 font-medium text-slate-900 dark:text-white">{resume.title}</h3>
              <p className="mt-1 text-xs text-slate-500 capitalize">{resume.template} template</p>
              <p className="mt-1 text-xs text-slate-500">Updated {formatDate(resume.updated_at)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/dashboard/resume/${resume.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => duplicate(resume.id)}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                {!resume.is_primary && (
                  <Button variant="ghost" size="sm" onClick={() => setPrimary(resume.id)}>
                    <Star className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(resume.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResumePage() {
  const { '*': splat } = useParams();
  const segments = splat?.split('/').filter(Boolean) ?? [];
  const id = segments[0];

  if (id && id !== 'new') {
    return <ResumeEditorPage />;
  }

  return <ResumeListView />;
}
