import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  'All career tools in a single dashboard',
  'Structured resume sections with live preview',
  'ATS scoring with keyword and skill analysis',
  'Cover letter generation with edit history',
  'Portfolio pages with multiple themes',
  'Skill gap analysis with learning roadmap',
  'Application status tracking and filtering',
  'Secure authentication with Supabase',
];

export function BenefitsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Built for students, designed for clarity
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              TalentTrack was developed as a final-year academic project to address the practical
              challenges students face during placement preparation and job applications.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{benefit}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
