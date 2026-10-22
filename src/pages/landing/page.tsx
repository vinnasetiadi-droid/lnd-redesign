import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ResponsiveBackground } from '@/components/ResponsiveBackground';
import { PAGES, VARIANTS, variantHref } from '@/variants/variants';

// The three option headers share one gradient (the sidebar's), each showing its own third
const BRAND_GRADIENT = 'linear-gradient(90deg, #000066 0%, #0001FE 35%, #00A3FF 70%, #33E5C9 100%)';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

/**
 * Landing page — pick one of the three design options, or jump straight to one of
 * its pages. Options are separate routers (see AppRoutes), so links are plain <a>.
 *
 * Route: /  (registered in src/routes/AppRoutes.tsx)
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <ResponsiveBackground />
      </div>

      <motion.main
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1120px] flex-col justify-center px-4 py-12 sm:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="mb-10 max-w-[640px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9EAEB] bg-white/80 py-1 pl-1 pr-3 shadow-[0_1px_3px_rgba(16,24,40,0.06)] backdrop-blur">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ background: BRAND_GRADIENT }}
            >
              LX
            </span>
            <span className="text-[12px] font-medium text-[#414651]">LearnXpert · Admin (L&amp;D)</span>
          </div>

          <h1 className="text-[32px] font-semibold leading-[40px] tracking-tight text-[#181D27] sm:text-[40px] sm:leading-[48px]">
            Redesign mockups
          </h1>
          <p className="mt-3 text-[16px] leading-[24px] text-[#535862]">
            Three style options for the same three pages. Pick an option to explore it.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {VARIANTS.map((variant, i) => (
            <motion.section
              key={variant.key}
              variants={itemVariants}
              aria-labelledby={`option-${variant.key}`}
              className="flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E9EAEB] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-300 hover:shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)]"
            >
              {/* Header */}
              <div
                className="flex h-[128px] items-end justify-between p-5 text-white"
                style={{
                  backgroundImage: BRAND_GRADIENT,
                  backgroundSize: '300% 100%',
                  backgroundPosition: `${i * 50}% 50%`,
                }}
              >
                <span className="text-[64px] font-semibold uppercase leading-[0.8] tracking-tight">{variant.key}</span>
                <span className="text-[13px] font-medium tabular-nums text-white/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <h2 id={`option-${variant.key}`} className="text-[18px] font-semibold leading-[28px] text-[#181D27]">
                  {variant.name}
                </h2>
                <p className="mt-1 text-[14px] leading-[20px] text-[#717680]">{variant.description}</p>

                <ul className="mt-4 flex flex-1 flex-col gap-1">
                  {PAGES.map((page) => {
                    const Icon = page.icon;
                    return (
                      <li key={page.key}>
                        <a
                          href={variantHref(variant, page.path)}
                          className="group/row flex items-center gap-3 rounded-[10px] px-2 py-2 transition-colors hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1570EF]/40"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E9EAEB] bg-white text-[#1570EF]">
                            <Icon className="h-4 w-4" strokeWidth={2} />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#414651]">{page.title}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-[#A4A7AE] transition-transform group-hover/row:translate-x-0.5" />
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <a
                  href={variantHref(variant)}
                  className="group/cta mt-4 flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#0001FE] text-[14px] font-semibold text-white transition-colors hover:bg-[#1849A9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1570EF]/30"
                >
                  Open {variant.name}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </a>
              </div>
            </motion.section>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
