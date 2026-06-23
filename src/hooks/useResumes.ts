import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createResume,
  deleteResume,
  duplicateResume,
  fetchResumes,
  setPrimaryResume,
} from '@/services/resumeService';
import type { Resume } from '@/types';

export function useResumes() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResumes(user.id);
      setResumes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (title: string, template?: string) => {
      if (!user) throw new Error('Not authenticated');
      const resume = await createResume(user.id, title, template);
      await load();
      return resume;
    },
    [user, load],
  );

  const remove = useCallback(
    async (resumeId: string) => {
      if (!user) return;
      await deleteResume(user.id, resumeId);
      await load();
    },
    [user, load],
  );

  const duplicate = useCallback(
    async (resumeId: string) => {
      if (!user) throw new Error('Not authenticated');
      const resume = await duplicateResume(user.id, resumeId);
      await load();
      return resume;
    },
    [user, load],
  );

  const setPrimary = useCallback(
    async (resumeId: string) => {
      if (!user) return;
      await setPrimaryResume(user.id, resumeId);
      await load();
    },
    [user, load],
  );

  return { resumes, loading, error, reload: load, create, remove, duplicate, setPrimary };
}
