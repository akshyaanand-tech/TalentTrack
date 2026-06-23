import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'For students getting started with career preparation.',
    features: [
      '1 resume',
      '3 ATS analyses per month',
      '2 cover letters per month',
      'Basic portfolio',
      'Job tracker (up to 10)',
    ],
    highlighted: false,
  },
  {
    name: 'Student',
    price: '4.99',
    description: 'For active job seekers during placement season.',
    features: [
      '5 resumes',
      'Unlimited ATS analyses',
      '10 cover letters per month',
      'Portfolio with all themes',
      'Skills analyzer',
      'Unlimited job tracking',
    ],
    highlighted: true,
  },
  {
    name: 'Professional',
    price: '9.99',
    description: 'For graduates and professionals managing multiple applications.',
    features: [
      'Unlimited resumes',
      'Unlimited ATS analyses',
      'Unlimited cover letters',
      'Priority portfolio themes',
      'Advanced skills roadmap',
      'Export all documents',
      'Email support',
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Simple pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Choose a plan that fits your current stage. All plans include core features.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative h-full',
                  plan.highlighted && 'border-primary ring-1 ring-primary',
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">
                    Recommended
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="mt-8 block">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
