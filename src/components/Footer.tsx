import { Link } from "react-router";
import imgPresight from "figma:asset/1a1b27e7b0c2de17060c30ee441aeae845fa5a72.png";
import imgAjari from "figma:asset/55d5af9699221eaa0f62b7e2d772b0b470e2f151.png";

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-5 py-5 w-full">
      {/* Left: Logos + Copyright */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-end gap-2">
          <img
            src={imgPresight}
            alt="Presight"
            className="h-[20px] w-auto object-contain"
          />
          <img
            src={imgAjari}
            alt="Ajari"
            className="h-[19px] w-auto object-contain"
          />
        </div>
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