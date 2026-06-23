import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useResumeEditor } from '@/hooks/useResumeEditor';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { SectionEditor, AddSectionMenu } from '@/components/resume/SectionEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RESUME_TEMPLATES } from '@/utils/resumeDefaults';
import { downloadElementAsPdf } from '@/utils/pdfExport';
import type { PersonalInfo, ResumeSectionType } from '@/types';

export function ResumeEditorPage() {
  const { '*': splat } = useParams();
  const segments = splat?.split('/').filter(Boolean) ?? [];
  const id = segments[0];
  const navigate = useNavigate();
  const { profile } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    resume,
    sections,
    loading,
    saving,
    error,
    saveResume,
    saveSection,
    addNewSection,
    removeSection,
  } = useResumeEditor(id);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('modern');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (resume) {
      setPersonalInfo(resume.personal_info);
      setTitle(resume.title);
      setTemplate(resume.template);
    } else if (profile && !loading) {
      setPersonalInfo({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        summary: profile.bio || '',
        linkedin: profile.linkedin_url || '',
        github: profile.github_url || '',
        website: profile.website || '',
      });
    }
  }, [resume, profile, loading]);

  async function handleSaveAll() {
    if (!personalInfo || !id) return;
    await saveResume({ title, template, personal_info: personalInfo });
  }

  async function handleDownloadPdf() {
    const el = document.getElementById('resume-preview');
    if (!el || !resume) return;
    await downloadElementAsPdf(el, `${resume.title}.pdf`);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !resume || !personalInfo) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error || 'Resume not found'}</p>
        <Link to="/dashboard/resume" className="mt-4 inline-block text-primary">
          Back to resumes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/resume')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Edit Resume
            </h1>
            <p className="text-sm text-slate-500">{saving ? 'Saving...' : 'Changes save manually'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button size="sm" loading={saving} onClick={handleSaveAll}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <div className="flex gap-2 lg:hidden">
        <Button
          variant={activeTab === 'edit' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('edit')}
        >
          Edit
        </Button>
        <Button
          variant={activeTab === 'preview' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-surface-card">
            <h2 className="mb-4 font-medium text-slate-900 dark:text-white">Resume Settings</h2>
            <div className="space-y-3">
              <Input label="Resume Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Select
                label="Template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                options={RESUME_TEMPLATES.map((t) => ({ value: t.id, label: t.name }))}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-surface-card">
            <h2 className="mb-4 font-medium text-slate-900 dark:text-white">Personal Information</h2>
            <div className="space-y-3">
              <Input label="Full Name" value={personalInfo.full_name} onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                <Input label="Phone" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
              </div>
              <Input label="Location" value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
              <Textarea label="Summary" value={personalInfo.summary} onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} rows={3} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input label="LinkedIn" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} />
                <Input label="GitHub" value={personalInfo.github} onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })} />
                <Input label="Website" value={personalInfo.website} onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })} />
              </div>
            </div>
          </div>

          {sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              onSave={(content) => saveSection(section.id, content)}
              onDelete={() => removeSection(section.id)}
            />
          ))}

          <AddSectionMenu
            existing={sections.map((s) => s.section_type)}
            onAdd={(type: ResumeSectionType) => addNewSection(type)}
          />
        </div>

        <div
          ref={previewRef}
          className={`${activeTab === 'edit' ? 'hidden lg:block' : ''} sticky top-24`}
        >
          <h2 className="mb-3 text-sm font-medium text-slate-500">Live Preview</h2>
          <ResumePreview
            resume={{ ...resume, title, template, personal_info: personalInfo }}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
}
