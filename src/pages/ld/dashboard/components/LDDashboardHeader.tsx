import { cn } from '@/lib/utils';
import {
  BookMarked, Clock, Users, BarChart2,
  Phone, Mail, MapPin, Building2,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { LDProfile, LDMetricCard } from '../types/dashboard.types';
import svgPaths from '@/imports/svg-funnql1szj';
import profilePhoto from 'figma:asset/a28eddf0aa599ff82c692ed23623c1cc12f696ec.png';

interface LDDashboardHeaderProps {
  profile: LDProfile;
  metrics?: LDMetricCard[];
  className?: string;
}

// ── Component ───────────────────────────────────────────────

export function LDDashboardHeader({ profile, metrics, className }: LDDashboardHeaderProps) {
  const { name, role, position, department, phone, email, location, company, stats } = profile;

  return (
    <div className={cn('space-y-4', className)}>
      {/* ── Profile Card ──────────────────────────────────────── */}
      <div className="group relative overflow-hidden rounded-[12px] bg-white border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] p-5">

        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-[#EFF8FF]/60 to-[#E0EAFF]/60 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        {/* ── Profile Row ─────────────────────────────────────── */}
        <div className="relative flex flex-row items-start gap-4 mb-[40px]">
          {/* LEFT — Profile photo */}
          <div className="shrink-0 w-[144px] h-[144px] rounded-[12px] overflow-hidden">
            <ImageWithFallback
              src={profilePhoto}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT — Info + Badges + Contact */}
          <div className="flex-1 flex flex-col min-w-0 h-[144px]">
            {/* Top row: Name/Role left, Badges right */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-[4px]">
                <h2
                  className="text-[24px] text-[#3e424b] leading-[1.25]"
                  style={{ fontWeight: 600 }}
                >
                  {name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[16px] text-[#3e424b]" style={{ fontWeight: 400 }}>
                    {position || role}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700">
                    {role}
                  </span>
                </div>
              </div>

              {/* Hexagonal badges */}
              <ProfileBadges />
            </div>

            {/* Contact info grid — 2 columns, pushed to bottom */}
            <div className="flex gap-[24px] items-start mt-auto">
              {/* Column 1 */}
              <div className="flex flex-col gap-[12px] w-[204px]">
                <div className="flex items-center gap-[8px]">
                  <Phone size={16} className="text-[#868D9D] shrink-0" />
                  <span className="text-[14px] leading-[20px] text-[#1e1e1e]" style={{ fontWeight: 400 }}>
                    {phone ?? '+62 123 4567 8900'}
                  </span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <MapPin size={16} className="text-[#868D9D] shrink-0" />
                  <span className="text-[14px] leading-[20px] text-[#1e1e1e]" style={{ fontWeight: 400 }}>
                    Istanbul
                  </span>
                </div>
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[8px]">
                  <Mail size={16} className="text-[#868D9D] shrink-0" />
                  <span className="text-[14px] leading-[20px] text-[#1e1e1e]" style={{ fontWeight: 400 }}>
                    {email ?? 'diana@presight.com'}
                  </span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <Building2 size={16} className="text-[#868D9D] shrink-0" />
                  <span className="text-[14px] leading-[20px] text-[#1e1e1e]" style={{ fontWeight: 400 }}>
                    Presight
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <StatCard label="Tenure"           value={stats.tenure.value}          unit={stats.tenure.unit} icon={Clock}     />
          <StatCard label="Total Trainers" value={stats.programsManaged}                                icon={BookMarked} subtitle="+50% vs last quarter" />
          <StatCard label="Total Employees" value={stats.instructorsManaged}       subtitle="+20% vs last quarter"            icon={Users}     />
        </div>
      </div>

      {/* ── Metric Cards (outside profile card) ───────────────── */}
      {metrics && metrics.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((card) => {
              return (
                <div key={card.key} className="relative rounded-[12px] bg-white border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] p-4 hover:shadow-[0_8px_24px_rgba(16,24,40,0.10)] hover:-translate-y-0.5 transition-all duration-300 group/card">
                  <div className="flex justify-between items-start mb-3">
                    <div className={cn('p-2 rounded-[8px] transition-transform group-hover/card:scale-110 bg-white border border-[#E9EAEB] text-[#1570EF]')}>
                      <BarChart2 className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#027A48]">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      <span style={{ fontWeight: 500 }}>{card.trend}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[#181D27] tracking-tight group-hover/card:text-[#175CD3] transition-colors">{card.value}</h3>
                    <p className="text-[12px] text-[#717680] uppercase tracking-wider">{card.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Supporting Components ────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ElementType;
  subtitle?: string;
}

function StatCard({ label, value, unit, icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="flex flex-row items-center gap-4 group w-full">
      <div className={cn('w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 bg-white border border-[#E9EAEB] text-[#1570EF]')}>
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-col">
          <span className="text-[12px] text-[#717680] uppercase tracking-wider mb-1">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[20px] text-[#181D27]">{value}</span>
            {unit && <span className="text-[12px] text-[#535862]">{unit}</span>}
            {subtitle && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#ECFDF3] text-[10px] text-[#027A48]" style={{ fontWeight: 500 }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeHexWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("size-[56px] relative", className)}>
      <div className="absolute inset-[-10.97%_-21.87%_-39.54%_-21.87%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80.4974 84.2872">
          {children}
        </svg>
      </div>
    </div>
  );
}

function ProfileBadges() {
  return (
    <div className="flex gap-[-2px] items-end -space-x-1">
      {/* Purple badge with medal icon */}
      <div className="relative shrink-0 size-[56px]">
        <BadgeHexWrapper className="absolute left-0 top-0">
          <g filter="url(#filter0_d_badge1)">
            <path d={svgPaths.p367cf1f0} fill="url(#paint0_linear_badge1)" />
            <path d={svgPaths.p367cf1f0} fill="url(#paint1_radial_badge1)" fillOpacity="0.75" />
            <path d={svgPaths.p2a5ab800} stroke="url(#paint2_linear_badge1)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.2872" id="filter0_d_badge1" width="80.4974" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="8" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.341176 0 0 0 0 0.372549 0 0 0 0 0.811765 0 0 0 0.175 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_badge1" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_badge1" mode="normal" result="shape" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badge1" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
              <stop stopColor="#9F8FFE" />
              <stop offset="1" stopColor="#D1B6FC" />
            </linearGradient>
            <radialGradient cx="0" cy="0" gradientTransform="translate(40.2487 62.1436) rotate(-90) scale(23)" gradientUnits="userSpaceOnUse" id="paint1_radial_badge1" r="1">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_badge1" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
              <stop offset="0.552885" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </BadgeHexWrapper>
        <div className="absolute left-[14px] size-[28px] top-[14px]">
          <div className="absolute inset-[0_16.67%]">
            <div className="absolute inset-[-24.87%_-42.86%_-32.28%_-42.86%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6667 44">
                <g filter="url(#filter0_d_badge1_inner)">
                  <path d={svgPaths.p6a8ac00} fill="url(#paint0_linear_badge1_inner)" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44.0001" id="filter0_d_badge1_inner" width="34.6667" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="1.03704" />
                    <feGaussianBlur stdDeviation="4" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_badge1_inner" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_badge1_inner" mode="normal" result="shape" />
                  </filter>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badge1_inner" x1="17.3333" x2="17.3333" y1="16.5556" y2="48.1852">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#C0A0FA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Blue badge with star icon */}
      <BadgeHexWrapper className="relative shrink-0">
        <g>
          <g filter="url(#filter0_d_badge2)">
            <path d={svgPaths.p367cf1f0} fill="url(#paint0_linear_badge2)" />
            <path d={svgPaths.p367cf1f0} fill="url(#paint1_radial_badge2)" fillOpacity="0.75" />
            <path d={svgPaths.p2a5ab800} stroke="url(#paint2_linear_badge2)" />
          </g>
          <path d={svgPaths.p68e2400} fill="url(#paint3_linear_badge2)" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.2872" id="filter0_d_badge2" width="80.4974" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="8" />
            <feGaussianBlur stdDeviation="8" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.117647 0 0 0 0 0.215686 0 0 0 0 0.6 0 0 0 0.175 0" />
            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_badge2" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_badge2" mode="normal" result="shape" />
          </filter>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badge2" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
            <stop stopColor="#1056D9" />
            <stop offset="1" stopColor="#4DA9FF" />
          </linearGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(40.2487 60.6436) rotate(-90) scale(25)" gradientUnits="userSpaceOnUse" id="paint1_radial_badge2" r="1">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_badge2" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
            <stop offset="0.552885" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_badge2" x1="40.2488" x2="40.2488" y1="32.1436" y2="54.1436">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#459DFA" />
          </linearGradient>
        </defs>
      </BadgeHexWrapper>

      {/* Cyan badge with trophy icon */}
      <BadgeHexWrapper className="relative shrink-0">
        <g>
          <g filter="url(#filter0_d_badge3)">
            <path d={svgPaths.p367cf1f0} fill="url(#paint0_linear_badge3)" />
            <path d={svgPaths.p367cf1f0} fill="url(#paint1_radial_badge3)" fillOpacity="0.75" />
            <path d={svgPaths.p2a5ab800} stroke="url(#paint2_linear_badge3)" />
          </g>
          <path d={svgPaths.p1cba6f80} fill="url(#paint3_linear_badge3)" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.2872" id="filter0_d_badge3" width="80.4974" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="8" />
            <feGaussianBlur stdDeviation="8" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.117647 0 0 0 0 0.215686 0 0 0 0 0.6 0 0 0 0.175 0" />
            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_badge3" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_badge3" mode="normal" result="shape" />
          </filter>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badge3" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
            <stop stopColor="#56B3F2" />
            <stop offset="1" stopColor="#50E5FB" />
          </linearGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(40.2487 62.1436) rotate(-90) scale(20)" gradientUnits="userSpaceOnUse" id="paint1_radial_badge3" r="1">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_badge3" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
            <stop offset="0.552885" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_badge3" x1="40.2487" x2="40.2487" y1="30.1436" y2="61.6436">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#CDF5FE" />
          </linearGradient>
        </defs>
      </BadgeHexWrapper>

      {/* More badges indicator - stacked */}
      <div className="relative shrink-0 w-[78px] h-[56px] flex items-center justify-end">
        {/* Back layer (3rd) - soft light blue */}
        <div className="absolute left-0 top-0">
          <BadgeHexWrapper>
            <g filter="url(#filter0_d_badgeStack3)">
              <path d={svgPaths.p367cf1f0} fill="url(#paint0_linear_badgeStack3)" />
              <path d={svgPaths.p367cf1f0} fill="url(#paint1_radial_badgeStack3)" fillOpacity="0.6" />
              <path d={svgPaths.p2a5ab800} stroke="url(#paint2_linear_badgeStack3)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.2872" id="filter0_d_badgeStack3" width="80.4974" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="8" />
                <feGaussianBlur stdDeviation="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.4 0 0 0 0 0.45 0 0 0 0 0.85 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badgeStack3" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
                <stop stopColor="#93C5FD" />
                <stop offset="1" stopColor="#BFDBFE" />
              </linearGradient>
              <radialGradient cx="0" cy="0" gradientTransform="translate(40.2487 62.1436) rotate(-90) scale(23)" gradientUnits="userSpaceOnUse" id="paint1_radial_badgeStack3" r="1">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_badgeStack3" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
                <stop offset="0.552885" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </BadgeHexWrapper>
        </div>
        {/* Middle layer (2nd) - soft indigo */}
        <div className="absolute left-[12px] top-0 z-[1]">
          <BadgeHexWrapper>
            <g filter="url(#filter0_d_badgeStack2)">
              <path d={svgPaths.p367cf1f0} fill="url(#paint0_linear_badgeStack2)" />
              <path d={svgPaths.p367cf1f0} fill="url(#paint1_radial_badgeStack2)" fillOpacity="0.6" />
              <path d={svgPaths.p2a5ab800} stroke="url(#paint2_linear_badgeStack2)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.2872" id="filter0_d_badgeStack2" width="80.4974" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="8" />
                <feGaussianBlur stdDeviation="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.35 0 0 0 0 0.35 0 0 0 0 0.8 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badgeStack2" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
                <stop stopColor="#818CF8" />
                <stop offset="1" stopColor="#A5B4FC" />
              </linearGradient>
              <radialGradient cx="0" cy="0" gradientTransform="translate(40.2487 62.1436) rotate(-90) scale(23)" gradientUnits="userSpaceOnUse" id="paint1_radial_badgeStack2" r="1">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_badgeStack2" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
                <stop offset="0.552885" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </BadgeHexWrapper>
        </div>
        {/* Front layer with "5+" - soft purple */}
        <div className="absolute left-[24px] top-0 z-[2]">
          <BadgeHexWrapper>
            <g filter="url(#filter0_d_badgeStack1)">
              <path d={svgPaths.p367cf1f0} fill="url(#paint0_linear_badgeStack1)" />
              <path d={svgPaths.p367cf1f0} fill="url(#paint1_radial_badgeStack1)" fillOpacity="0.6" />
              <path d={svgPaths.p2a5ab800} stroke="url(#paint2_linear_badgeStack1)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.2872" id="filter0_d_badgeStack1" width="80.4974" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="8" />
                <feGaussianBlur stdDeviation="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.3 0 0 0 0 0.25 0 0 0 0 0.75 0 0 0 0.15 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_badgeStack1" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
                <stop stopColor="#7C6BF0" />
                <stop offset="1" stopColor="#A78BFA" />
              </linearGradient>
              <radialGradient cx="0" cy="0" gradientTransform="translate(40.2487 62.1436) rotate(-90) scale(23)" gradientUnits="userSpaceOnUse" id="paint1_radial_badgeStack1" r="1">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_badgeStack1" x1="40.2487" x2="40.2487" y1="6.14359" y2="62.1436">
                <stop offset="0.552885" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </BadgeHexWrapper>
          <span className="absolute inset-0 flex items-center justify-center z-10 text-[16px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" style={{ fontWeight: 700 }}>5+</span>
        </div>
      </div>
    </div>
  );
}