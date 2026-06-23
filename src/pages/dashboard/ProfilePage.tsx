import { useEffect, useRef, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ensureProfile, updateProfile, uploadAvatar } from '@/services/profileService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getInitials } from '@/utils/helpers';
import type { Profile } from '@/types';

export function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const activeProfile = localProfile || profile;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setPageLoading(false);
      return;
    }

    if (profile) {
      setLocalProfile(profile);
      setPageLoading(false);
      return;
    }

    let cancelled = false;
    setPageLoading(true);
    setLoadError('');

    ensureProfile(user)
      .then((p) => {
        if (!cancelled) {
          setLocalProfile(p);
          setPageLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load profile');
          setPageLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, profile, loading]);

  useEffect(() => {
    if (activeProfile) {
      setFullName(activeProfile.full_name || '');
      setHeadline(activeProfile.headline || '');
      setBio(activeProfile.bio || '');
      setPhone(activeProfile.phone || '');
      setLocation(activeProfile.location || '');
      setWebsite(activeProfile.website || '');
      setGithubUrl(activeProfile.github_url || '');
      setLinkedinUrl(activeProfile.linkedin_url || '');
      setSkills((activeProfile.skills || []).join(', '));
    }
  }, [activeProfile]);

  async function handleSave() {
    if (!activeProfile) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile(activeProfile.id, {
        full_name: fullName,
        headline,
        bio,
        phone,
        location,
        website,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      await refreshProfile();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeProfile) return;
    setUploading(true);
    setError('');
    try {
      await uploadAvatar(activeProfile.id, file);
      await refreshProfile();
      setMessage('Avatar uploaded successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  }

  if (loading || pageLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loadError || !activeProfile) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {loadError || 'Could not load your profile.'}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Make sure you have run <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">supabase/schema.sql</code> in
          your Supabase SQL Editor, then refresh this page.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Manage your personal information and social links.
        </p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-medium text-white">
            {activeProfile.avatar_url ? (
              <img src={activeProfile.avatar_url} alt={fullName} className="h-20 w-20 object-cover" />
            ) : (
              getInitials(fullName || activeProfile.email)
            )}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <Button variant="outline" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload Avatar
            </Button>
            <p className="mt-1 text-xs text-slate-500">{activeProfile.email}</p>
            <p className="text-xs capitalize text-slate-500">{activeProfile.plan} plan</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-medium text-slate-900 dark:text-white">Personal Information</h2>
        <div className="mt-4 space-y-4">
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Software Engineering Student" />
          <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <Input label="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, Python, React" />
        </div>
      </Card>

      <Card>
        <h2 className="font-medium text-slate-900 dark:text-white">Social Links</h2>
        <div className="mt-4 space-y-4">
          <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          <Input label="GitHub" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          <Input label="LinkedIn" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
        </div>
      </Card>

      <Button loading={saving} onClick={handleSave}>
        <Save className="h-4 w-4" /> Save Changes
      </Button>
    </div>
  );
}
