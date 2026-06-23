import { useCallback, useEffect, useState } from 'react';
import {
  addSection,
  deleteSection,
  fetchResumeWithSections,
  updateResume,
  updateSection,
} from '@/services/resumeService';
import type { PersonalInfo, Resume, ResumeSection, ResumeSectionType } from '@/types';

export function useResumeEditor(resumeId: string | undefined) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!resumeId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResumeWithSections(resumeId);
      if (!data) {
        setError('Resume not found');
        return;
      }
      setResume(data.resume);
      setSections(data.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveResume = useCallback(
    async (updates: Partial<Pick<Resume, 'title' | 'template' | 'personal_info'>>) => {
      if (!resumeId || !resume) return;
      setSaving(true);
      try {
        await updateResume(resumeId, updates);
        setResume((prev) => (prev ? { ...prev, ...updates } : prev));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setSaving(false);
      }
    },
    [resumeId, resume],
  );

  const savePersonalInfo = useCallback(
    async (personalInfo: PersonalInfo) => {
      await saveResume({ personal_info: personalInfo });
    },
    [saveResume],
  );

  const saveSection = useCallback(async (sectionId: string, content: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateSection(sectionId, { content });
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, content } : s)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    } finally {
      setSaving(false);
    }
  }, []);

  const addNewSection = useCallback(
    async (sectionType: ResumeSectionType) => {
      if (!resumeId) return;
      const section = await addSection(resumeId, sectionType, sections.length);
      setSections((prev) => [...prev, section]);
    },
    [resumeId, sections.length],
  );

  const removeSection = useCallback(async (sectionId: string) => {
    await deleteSection(sectionId);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, []);

  return {
    resume,
    sections,
    loading,
    saving,
    error,
    saveResume,
    savePersonalInfo,
    saveSection,
    addNewSection,
    removeSection,
    reload: load,
  };
}
