import { useEffect, useState } from 'react';
import { Target, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  analyzeSkillGap,
  fetchLearningPaths,
  saveLearningPath,
  updateRoadmapProgress,
  deleteLearningPath,
} from '@/services/skillsService';
import { isGeminiConfigured } from '@/lib/gemini';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { LearningPath, RoadmapItem } from '@/types';
import { generateId } from '@/utils/resumeDefaults';
import { formatDate } from '@/utils/helpers';

export function SkillsPage() {
  const { user, profile } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);

  const [currentSkills, setCurrentSkills] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchLearningPaths(user.id).then(setPaths).finally(() => setLoading(false));
    if (profile?.skills?.length) {
      setCurrentSkills(profile.skills.join(', '));
    }
  }, [user, profile]);

  async function handleAnalyze() {
    if (!user || !targetCareer.trim()) {
      setError('Target career is required.');
      return;
    }
    setError('');
    setAnalyzing(true);
    try {
      const skills = currentSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const result = await analyzeSkillGap(skills, targetCareer);

      const roadmap: RoadmapItem[] = result.roadmap.map((item) => ({
        id: generateId(),
        skill: item.skill,
        priority: item.priority,
        resources: item.resources,
        completed: false,
      }));

      const saved = await saveLearningPath(user.id, {
        target_career: targetCareer,
        current_skills: skills,
        recommended_skills: result.recommended_skills,
        roadmap,
      });

      setActivePath(saved);
      setPaths((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  async function toggleRoadmapItem(path: LearningPath, itemId: string) {
    const updatedRoadmap = path.roadmap.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    );
    await updateRoadmapProgress(path.id, updatedRoadmap);
    const updated = {
      ...path,
      roadmap: updatedRoadmap,
      progress: updatedRoadmap.length > 0
        ? Math.round((updatedRoadmap.filter((r) => r.completed).length / updatedRoadmap.length) * 100)
        : 0,
    };
    setActivePath(updated);
    setPaths((prev) => prev.map((p) => (p.id === path.id ? updated : p)));
  }

  async function handleDelete(id: string) {
    await deleteLearningPath(id);
    setPaths((prev) => prev.filter((p) => p.id !== id));
    if (activePath?.id === id) setActivePath(null);
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Skills Analyzer</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Identify skill gaps and get a learning roadmap.</p>
      </div>

      {!isGeminiConfigured() && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">Skill Gap Analysis</h2>
          <div className="mt-4 space-y-4">
            <Input label="Current Skills" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} placeholder="JavaScript, HTML, CSS" />
            <Input label="Target Career" value={targetCareer} onChange={(e) => setTargetCareer(e.target.value)} placeholder="Frontend Developer" />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button loading={analyzing} onClick={handleAnalyze} disabled={!isGeminiConfigured()}>
              <Target className="h-4 w-4" /> Analyze Skills
            </Button>
          </div>
        </Card>

        {activePath && (
          <Card>
            <div className="flex items-center gap-4">
              <ProgressRing value={activePath.progress} size={80} label="Progress" />
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">{activePath.target_career}</h2>
                <p className="text-sm text-slate-500">{activePath.recommended_skills.length} skills to learn</p>
              </div>
            </div>

            {activePath.recommended_skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Recommended Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activePath.recommended_skills.map((skill) => (
                    <Badge key={skill} className="bg-primary/10 text-primary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">Learning Roadmap</h3>
              {activePath.roadmap.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleRoadmapItem(activePath, item.id)}>
                        <CheckCircle2 className={`h-5 w-5 ${item.completed ? 'text-green-500' : 'text-slate-300'}`} />
                      </button>
                      <span className={`text-sm font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {item.skill}
                      </span>
                    </div>
                    <Badge className={priorityColors[item.priority]}>{item.priority}</Badge>
                  </div>
                  {item.resources.length > 0 && (
                    <ul className="mt-2 ml-7 list-disc text-xs text-slate-500">
                      {item.resources.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {paths.length > 0 && (
        <Card>
          <h2 className="font-medium text-slate-900 dark:text-white">Previous Analyses</h2>
          <div className="mt-4 space-y-2">
            {paths.map((path) => (
              <div key={path.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <button type="button" onClick={() => setActivePath(path)} className="text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{path.target_career}</p>
                  <p className="text-xs text-slate-500">{path.progress}% complete · {formatDate(path.created_at)}</p>
                </button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(path.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
