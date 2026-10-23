import { Link } from "react-router";
import imgAjari from "figma:asset/55d5af9699221eaa0f62b7e2d772b0b470e2f151.png";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 w-full">
      {/* Left: Logo + Copyright */}
      <div className="flex items-center gap-4 shrink-0">
        <img
          src={imgAjari}
          alt="Ajari"
          className="ob-logo-invert h-[19px] w-auto object-contain"
        />
        <p className="text-[12px] leading-[16px] text-(--ob-text-secondary) whitespace-nowrap">
          © 2026 HR Platform. All rights reserved.
        </p>
      </div>

      {/* Right: Navigation links */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
        <Link
          to="/user-guide"
          className="text-[12px] leading-[16px] text-(--ob-text-secondary) hover:text-(--ob-text-body) no-underline whitespace-nowrap"
        >
          User guide
        </Link>
        <div className="h-[21px] w-px bg-(--ob-divider-faint)" />
        <Link
          to="/technical-help"
          className="text-[12px] leading-[16px] text-(--ob-text-secondary) hover:text-(--ob-text-body) no-underline whitespace-nowrap"
        >
          Technical help
        </Link>
        <div className="h-[21px] w-px bg-(--ob-divider-faint)" />
        <Link
          to="/privacy-policy"
          className="text-[12px] leading-[16px] text-(--ob-text-secondary) hover:text-(--ob-text-body) no-underline whitespace-nowrap"
        >
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}