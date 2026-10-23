import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { PAGES, VARIANTS, variantHref } from '@/variants/variants';
import './landing.css';

/** What sets each option apart (layout and font; the dot shows its accent colour) */
const OPTION_INFO: Record<string, { accent: string; traits: string[] }> = {
  a: { accent: '#1A73E8', traits: ['Sidebar', 'DM Sans'] },
  b: { accent: '#1A73E8', traits: ['Sidebar', '3D buttons', 'Inter'] },
  c: { accent: '#2C87E8', traits: ['Floating sidebar', 'General Sans'] },
  d: { accent: '#0E85B4', traits: ['Top navigation', 'Outfit'] },
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const list = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/**
 * Landing page: pick one of the design options, or jump straight to one of
 * its pages. Plain and quiet like the pages inside: a flat background, white
 * cards with a hairline, the option's accent as a dot, its traits in one line
 * and the pages as text rows. Options are separate routers (see AppRoutes),
 * so links are plain <a>.
 *
 * Route: /  (registered in src/routes/AppRoutes.tsx)
 */
export default function LandingPage() {
  return (
    <div className="landing min-h-screen w-full bg-[#F7F8FA] text-[#181D27]">
      <motion.main
        className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col justify-center px-4 py-16 sm:px-8"
        variants={list}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={item} className="mb-10">
          <p className="text-[13px] leading-[20px] text-[#717680]">LearnXpert · Admin (L&amp;D)</p>
          <h1 className="mt-2 text-[28px] font-medium leading-[36px]">Redesign mockups</h1>
          <p className="mt-1.5 max-w-[560px] text-[14px] leading-[22px] text-[#535862]">
            Four style options for the same three pages. Each has a light and a dark version, switched from the Options pill inside.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {VARIANTS.map((variant) => {
            const info = OPTION_INFO[variant.key];
            return (
              <motion.section
                key={variant.key}
                variants={item}
                aria-labelledby={`option-${variant.key}`}
                className="group flex min-w-0 flex-col rounded-[16px] border border-[#ECEDF0] bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-[#DCDFE4] hover:shadow-[0_12px_32px_-20px_rgba(16,24,40,0.25)]"
              >
                {/* Name and the open arrow */}
                <a
                  href={variantHref(variant)}
                  className="flex items-center gap-2.5 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/30"
                >
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: info?.accent }} />
                  <h2 id={`option-${variant.key}`} className="flex-1 text-[15px] font-medium leading-[22px]">
                    {variant.name}
                  </h2>
                  <ArrowUpRight
                    className="h-4 w-4 text-[#A4A7AE] transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#181D27]"
                    strokeWidth={1.75}
                  />
                </a>
                {info && <p className="mt-1 truncate text-[13px] leading-[20px] text-[#717680]" title={info.traits.join(' · ')}>{info.traits.join(' · ')}</p>}

                {/* The three pages */}
                <ul className="mt-5 border-t border-[#F0F1F3]">
                  {PAGES.map((page) => (
                    <li key={page.key} className="border-b border-[#F0F1F3] last:border-b-0">
                      <a
                        href={variantHref(variant, page.path)}
                        className="group/row -mx-2 flex items-center gap-2 rounded-[8px] px-2 py-2.5 text-[13px] text-[#414651] transition-colors hover:text-[#181D27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/30"
                      >
                        <span className="min-w-0 flex-1 truncate">{page.title}</span>
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-[#C4C8CF] transition-[color,translate] duration-200 group-hover/row:translate-x-0.5 group-hover/row:text-[#717680]"
                          strokeWidth={1.75}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.section>
            );
          })}
        </div>
      </motion.main>
    </div>
  );
}
