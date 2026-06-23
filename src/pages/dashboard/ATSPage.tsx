import { useEffect, useState } from 'react';
import { ScanSearch, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useResumes } from '@/hooks/useResumes';
import {
  analyzeResumeATS,
  fetchATSReports,
  getResumeText,
  saveATSReport,
  deleteATSReport,
} from '@/services/atsService';
import { isGeminiConfigured } from '@/lib/gemini';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ATSReport } from '@/types';
import { formatDate } from '@/utils/helpers';

export function ATSPage() {
  const { user } = useAuth();
  const { resumes } = useResumes();

  const [reports, setReports] = useState<ATSReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const [resumeId, setResumeId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [usePaste, setUsePaste] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchATSReports(user.id)
      .then(setReports)
      .finally(() => setLoadingReports(false));
  }, [user]);

  async function handleAnalyze() {
    if (!user) return;
    setError('');
    setAnalyzing(true);
    setResult(null);

    try {
      let text = resumeText;
      if (!usePaste && resumeId) {
        text = await getResumeText(resumeId);
      }
      if (!text.trim()) {
        setError('Please select a resume or paste resume content.');
        return;
      }
      if (!jobDescription.trim()) {
        setError('Please paste a job description.');
        return;
      }

      const analysis = await analyzeResumeATS(text, jobDescription);
      const saved = await saveATSReport(user.id, {
        resume_id: usePaste ? null : resumeId || null,
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
        ...analysis,
      });
      setResult(saved);
      setReports((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteATSReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (result?.id === id) setResult(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          ATS Analyzer
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Check how well your resume matches a job description.
        </p>
      </div>

      {!isGeminiConfigured() && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file to use ATS analysis.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">Analyze Resume</h2>

          <div className="mt-4 flex gap-2">
            <Button variant={!usePaste ? 'primary' : 'outline'} size="sm" onClick={() => setUsePaste(false)}>
              Select Resume
            </Button>
            <Button variant={usePaste ? 'primary' : 'outline'} size="sm" onClick={() => setUsePaste(true)}>
              Paste Resume
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {!usePaste ? (
              <Select
                label="Select Resume"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                options={[
                  { value: '', label: 'Choose a resume...' },
                  ...resumes.map((r) => ({ value: r.id, label: r.title })),
                ]}
              />
            ) : (
              <Textarea
                label="Resume Content"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                placeholder="Paste your resume text here..."
              />
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              <Input label="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <Textarea
              label="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the full job description..."
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button loading={analyzing} onClick={handleAnalyze} disabled={!isGeminiConfigured()}>
              <ScanSearch className="h-4 w-4" /> Analyze
            </Button>
          </div>
        </Card>

        <div>
          {analyzing && (
            <Card className="flex flex-col items-center py-16">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-sm text-slate-500">Analyzing resume...</p>
            </Card>
          )}

          {result && !analyzing && (
            <Card>
              <div className="flex items-center gap-6">
                <ProgressRing value={result.ats_score} size={100} label="ATS Score" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {result.job_title || 'Analysis Result'}
                  </h2>
                  {result.company_name && (
                    <p className="text-sm text-slate-500">{result.company_name}</p>
                  )}
                </div>
              </div>

              {result.skill_match.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Skill Match</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.skill_match.map((skill) => (
                      <Badge key={skill} className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.missing_keywords.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Missing Keywords</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw) => (
                      <Badge key={kw} className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Suggestions</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {result.improvement_areas.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Improvement Areas</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {result.improvement_areas.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      <Card>
        <h2 className="font-medium text-slate-900 dark:text-white">Previous Reports</h2>
        {loadingReports ? (
          <LoadingSpinner className="mt-4" />
        ) : reports.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No reports yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {report.job_title || 'Untitled'} — {report.ats_score}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {report.company_name && `${report.company_name} · `}{formatDate(report.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setResult(report)}>View</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
