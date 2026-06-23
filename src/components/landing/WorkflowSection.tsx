import { motion } from 'framer-motion';
import { FileText, ScanSearch, Layout, Briefcase } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: FileText,
    title: 'Create Resume',
    description: 'Fill in your personal details, education, and experience using structured templates.',
  },
  {
    step: 2,
    icon: ScanSearch,
    title: 'Analyze ATS Score',
    description: 'Paste a job description and see how well your resume matches the requirements.',
  },
  {
    step: 3,
    icon: Layout,
    title: 'Generate Portfolio',
    description: 'Turn your profile into a shareable portfolio page with your projects and skills.',
  },
  {
    step: 4,
    icon: Briefcase,
    title: 'Apply For Jobs',
    description: 'Track each application with status updates from submission to final decision.',
  },
];

export function WorkflowSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            A straightforward workflow from resume creation to job application tracking.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[60%] hidden h-px w-[80%] bg-slate-300 dark:bg-slate-700 lg:block" />
              )}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
                <item.icon className="h-7 w-7" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Step {item.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
