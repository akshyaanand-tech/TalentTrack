import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, BarChart3, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary-300">
              Final Year Project — Career Development Platform
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Plan your career with clarity and structure
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              TalentTrack helps students and job seekers build resumes, check ATS compatibility,
              generate cover letters, and track applications — all in one organized workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Features
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated dark:border-slate-700 dark:bg-surface-card">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Resume Builder
                    </p>
                    <p className="text-xs text-slate-500">Software Engineer — Draft</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-green-600">85%</span>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      ATS Analysis
                    </p>
                    <p className="text-xs text-slate-500">Frontend Developer Role</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-primary">72%</span>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Job Applications
                    </p>
                    <p className="text-xs text-slate-500">3 active, 1 interview</p>
                  </div>
                  <span className="ml-auto rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Interview
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
