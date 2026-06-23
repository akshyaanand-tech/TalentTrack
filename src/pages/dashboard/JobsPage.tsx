import { useEffect, useState, useCallback } from 'react';
import { Briefcase, Plus, Trash2, Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useResumes } from '@/hooks/useResumes';
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/services/jobsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Application, ApplicationStatus } from '@/types';
import { getStatusColor, getStatusLabel, formatDate } from '@/utils/helpers';

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
];

export function JobsPage() {
  const { user } = useAuth();
  const { resumes } = useResumes();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('applied');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [resumeId, setResumeId] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const filter = statusFilter === 'all' ? undefined : (statusFilter as ApplicationStatus);
    const data = await fetchApplications(user.id, filter);
    setApplications(data);
    setLoading(false);
  }, [user, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setCompanyName('');
    setJobTitle('');
    setStatus('applied');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setResumeId('');
    setShowForm(false);
  }

  function startEdit(app: Application) {
    setEditingId(app.id);
    setCompanyName(app.company_name);
    setJobTitle(app.job_title);
    setStatus(app.status);
    setAppliedDate(app.applied_date);
    setNotes(app.notes || '');
    setResumeId(app.resume_id || '');
    setShowForm(true);
  }

  async function handleSave() {
    if (!user || !companyName || !jobTitle) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateApplication(editingId, {
          company_name: companyName,
          job_title: jobTitle,
          status,
          applied_date: appliedDate,
          notes: notes || undefined,
        });
      } else {
        await createApplication(user.id, {
          company_name: companyName,
          job_title: jobTitle,
          status,
          applied_date: appliedDate,
          notes: notes || undefined,
          resume_id: resumeId || undefined,
        });
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    await deleteApplication(user.id, id);
    await load();
  }

  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Job Tracker</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Track your job applications and their status.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Application
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(['applied', 'under_review', 'interview', 'rejected', 'accepted'] as ApplicationStatus[]).map((s) => (
          <Card key={s} padding="sm" className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts[s] || 0}</p>
            <p className="text-xs text-slate-500">{getStatusLabel(s)}</p>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">
            {editingId ? 'Edit Application' : 'New Application'}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input label="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} options={STATUS_OPTIONS.filter((o) => o.value !== 'all')} />
            <Input label="Applied Date" type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
            {!editingId && (
              <Select
                label="Resume Used"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                options={[
                  { value: '', label: 'None' },
                  ...resumes.map((r) => ({ value: r.id, label: r.title })),
                ]}
              />
            )}
            <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="sm:col-span-2" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button loading={saving} onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
        />
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center"><LoadingSpinner /></div>
      ) : applications.length === 0 ? (
        <Card className="flex flex-col items-center py-16 text-center">
          <Briefcase className="h-10 w-10 text-slate-400" />
          <p className="mt-4 text-sm text-slate-500">No applications tracked yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} padding="sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900 dark:text-white">{app.job_title}</h3>
                    <Badge className={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{app.company_name}</p>
                  <p className="text-xs text-slate-500">Applied {formatDate(app.applied_date)}</p>
                  {app.notes && <p className="mt-1 text-sm text-slate-500">{app.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(app)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(app.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
