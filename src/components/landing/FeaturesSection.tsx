import { motion } from 'framer-motion';
import {
  FileText,
  ScanSearch,
  Mail,
  Layout,
  Target,
  ClipboardList,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: FileText,
    title: 'Resume Builder',
    description:
      'Create structured resumes with sections for education, experience, projects, and skills. Preview and export as PDF.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: ScanSearch,
    title: 'ATS Analyzer',
    description:
      'Upload your resume and paste a job description to get an ATS score, missing keywords, and improvement suggestions.',
    color: 'text-secondary bg-secondary/10',
  },
  {
    icon: Mail,
    title: 'Cover Letter Generator',
    description:
      'Generate tailored cover letters based on the job title, company, and your experience. Edit and save each version.',
    color: 'text-accent bg-accent/10',
  },
  {
    icon: Layout,
    title: 'Portfolio Generator',
    description:
      'Build a personal portfolio from your profile data. Choose from modern, professional, or minimal themes.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Target,
    title: 'Skills Analyzer',
    description:
      'Compare your current skills against a target career path. Get a learning roadmap with recommended resources.',
    color: 'text-secondary bg-secondary/10',
  },
  {
    icon: ClipboardList,
    title: 'Job Tracker',
    description:
      'Log applications with status tracking — applied, under review, interview, rejected, or accepted.',
    color: 'text-accent bg-accent/10',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Tools for every stage of your job search
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Six integrated modules designed to help you prepare, apply, and track your progress.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full transition-shadow hover:shadow-elevated">
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.color}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
