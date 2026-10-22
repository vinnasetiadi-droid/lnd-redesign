import { Link } from "react-router";
import imgAjari from "figma:asset/55d5af9699221eaa0f62b7e2d772b0b470e2f151.png";

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-5 py-5 w-full">
      {/* Left: Logo + Copyright */}
      <div className="flex items-center gap-4 shrink-0">
        <img
          src={imgAjari}
          alt="Ajari"
          className="h-[19px] w-auto object-contain"
        />
        <p className="text-[10px] leading-[24px] text-[#535862] capitalize whitespace-nowrap">
          © 2026 HR Platform. All rights reserved.
        </p>
      </div>

      {/* Right: Navigation links */}
      <div className="flex items-center gap-8 shrink-0">
        <Link
          to="/user-guide"
          className="text-[12px] leading-[18px] text-[#535862] hover:text-[#414651] no-underline whitespace-nowrap"
        >
          User Guide
        </Link>
        <div className="h-[21px] w-px bg-black/10" />
        <Link
          to="/technical-help"
          className="text-[12px] leading-[18px] text-[#535862] hover:text-[#414651] no-underline whitespace-nowrap"
        >
          Technical Help
        </Link>
        <div className="h-[21px] w-px bg-black/10" />
        <Link
          to="/privacy-policy"
          className="text-[12px] leading-[18px] text-[#535862] hover:text-[#414651] no-underline whitespace-nowrap"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}