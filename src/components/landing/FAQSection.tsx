import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is TalentTrack?',
    answer:
      'TalentTrack is a career development platform built as a final-year academic project. It provides tools for resume building, ATS analysis, cover letter generation, portfolio creation, skill gap analysis, and job application tracking.',
  },
  {
    question: 'Do I need to pay to use TalentTrack?',
    answer:
      'The Free plan includes core features with reasonable limits. Student and Professional plans offer higher limits and additional features. You can start with the Free plan and upgrade later.',
  },
  {
    question: 'How does the ATS analyzer work?',
    answer:
      'Upload your resume or select an existing one, paste the job description, and the system compares your content against the role requirements. You receive an ATS score, missing keywords, skill matches, and suggestions.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. TalentTrack uses Supabase for authentication and database storage with Row Level Security. Each user can only access their own data.',
  },
  {
    question: 'Can I export my resume as PDF?',
    answer:
      'Yes. The Resume Builder includes a download PDF feature. Cover letters and portfolios can also be exported.',
  },
  {
    question: 'Who developed TalentTrack?',
    answer:
      'TalentTrack was developed by a team of final-year engineering students as part of their academic curriculum. It is designed to solve real problems faced during campus placements and job searches.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Common questions about the platform and its features.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-surface-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
