import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { ResumeSection, ResumeSectionType } from '@/types';
import { generateId } from '@/utils/resumeDefaults';

interface SectionEditorProps {
  section: ResumeSection;
  onSave: (content: Record<string, unknown>) => void;
  onDelete: () => void;
}

function ItemListEditor({
  section,
  onSave,
}: {
  section: ResumeSection;
  onSave: (content: Record<string, unknown>) => void;
}) {
  const items = (section.content.items as Array<Record<string, unknown>>) || [];

  function updateItems(newItems: Array<Record<string, unknown>>) {
    onSave({ items: newItems });
  }

  function addItem(defaults: Record<string, unknown>) {
    updateItems([...items, { id: generateId(), ...defaults }]);
  }

  function updateItem(index: number, field: string, value: unknown) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateItems(updated);
  }

  function removeItem(index: number) {
    updateItems(items.filter((_, i) => i !== index));
  }

  if (section.section_type === 'skills') {
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={(item.name as string) || ''}
              onChange={(e) => updateItem(i, 'name', e.target.value)}
              placeholder="Skill name"
            />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ name: '' })}>
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>
    );
  }

  if (section.section_type === 'experience') {
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Job Title" value={(item.title as string) || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} />
              <Input label="Company" value={(item.company as string) || ''} onChange={(e) => updateItem(i, 'company', e.target.value)} />
              <Input label="Location" value={(item.location as string) || ''} onChange={(e) => updateItem(i, 'location', e.target.value)} />
              <Input label="Start Date" value={(item.start_date as string) || ''} onChange={(e) => updateItem(i, 'start_date', e.target.value)} placeholder="Jan 2023" />
              <Input label="End Date" value={(item.end_date as string) || ''} onChange={(e) => updateItem(i, 'end_date', e.target.value)} placeholder="Present" />
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={Boolean(item.current)} onChange={(e) => updateItem(i, 'current', e.target.checked)} />
                Currently working here
              </label>
            </div>
            <Textarea label="Description" value={(item.description as string) || ''} onChange={(e) => updateItem(i, 'description', e.target.value)} rows={3} className="mt-3" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ title: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '' })}>
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>
    );
  }

  if (section.section_type === 'education') {
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Institution" value={(item.institution as string) || ''} onChange={(e) => updateItem(i, 'institution', e.target.value)} />
              <Input label="Degree" value={(item.degree as string) || ''} onChange={(e) => updateItem(i, 'degree', e.target.value)} />
              <Input label="Field of Study" value={(item.field as string) || ''} onChange={(e) => updateItem(i, 'field', e.target.value)} />
              <Input label="Start Date" value={(item.start_date as string) || ''} onChange={(e) => updateItem(i, 'start_date', e.target.value)} />
              <Input label="End Date" value={(item.end_date as string) || ''} onChange={(e) => updateItem(i, 'end_date', e.target.value)} />
            </div>
            <Textarea label="Description" value={(item.description as string) || ''} onChange={(e) => updateItem(i, 'description', e.target.value)} rows={2} className="mt-3" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' })}>
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      </div>
    );
  }

  if (section.section_type === 'projects') {
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Project Name" value={(item.name as string) || ''} onChange={(e) => updateItem(i, 'name', e.target.value)} />
              <Input label="URL" value={(item.url as string) || ''} onChange={(e) => updateItem(i, 'url', e.target.value)} />
              <Input label="Technologies" value={((item.technologies as string[]) || []).join(', ')} onChange={(e) => updateItem(i, 'technologies', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="React, TypeScript" className="sm:col-span-2" />
            </div>
            <Textarea label="Description" value={(item.description as string) || ''} onChange={(e) => updateItem(i, 'description', e.target.value)} rows={2} className="mt-3" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ name: '', description: '', technologies: [], url: '' })}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>
    );
  }

  if (section.section_type === 'certifications') {
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={(item.name as string) || ''} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Certification name" />
            <Input value={(item.issuer as string) || ''} onChange={(e) => updateItem(i, 'issuer', e.target.value)} placeholder="Issuer" />
            <Input value={(item.date as string) || ''} onChange={(e) => updateItem(i, 'date', e.target.value)} placeholder="Date" />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ name: '', issuer: '', date: '' })}>
          <Plus className="h-4 w-4" /> Add Certification
        </Button>
      </div>
    );
  }

  if (section.section_type === 'achievements') {
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <Input label="Title" value={(item.title as string) || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} />
            <Textarea label="Description" value={(item.description as string) || ''} onChange={(e) => updateItem(i, 'description', e.target.value)} rows={2} className="mt-3" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ title: '', description: '' })}>
          <Plus className="h-4 w-4" /> Add Achievement
        </Button>
      </div>
    );
  }

  if (section.section_type === 'languages') {
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={(item.language as string) || ''} onChange={(e) => updateItem(i, 'language', e.target.value)} placeholder="Language" />
            <Input value={(item.proficiency as string) || ''} onChange={(e) => updateItem(i, 'proficiency', e.target.value)} placeholder="Proficiency" />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem({ language: '', proficiency: '' })}>
          <Plus className="h-4 w-4" /> Add Language
        </Button>
      </div>
    );
  }

  return null;
}

export function SectionEditor({ section, onSave, onDelete }: SectionEditorProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-surface-card">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="font-medium text-slate-900 dark:text-white">{section.title}</h3>
        <span className="text-xs text-slate-500">{expanded ? 'Collapse' : 'Expand'}</span>
      </button>
      {expanded && (
        <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-700">
          <ItemListEditor section={section} onSave={onSave} />
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" /> Remove Section
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AddSectionMenu({
  onAdd,
  existing,
}: {
  onAdd: (type: ResumeSectionType) => void;
  existing: ResumeSectionType[];
}) {
  const allTypes: ResumeSectionType[] = [
    'experience', 'education', 'projects', 'skills',
    'certifications', 'achievements', 'languages',
  ];
  const available = allTypes.filter((t) => !existing.includes(t));

  if (available.length === 0) return null;

  return (
    <select
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) {
          onAdd(e.target.value as ResumeSectionType);
          e.target.value = '';
        }
      }}
    >
      <option value="" disabled>Add section...</option>
      {available.map((type) => (
        <option key={type} value={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </option>
      ))}
    </select>
  );
}
