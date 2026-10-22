// ============================================================
// Delete confirmation — one dialog for every unpublished version
//
// Courses and journeys, admin and trainer, cards and detail pages all
// render this so the wording and the layout can't drift apart. Only
// unpublished work reaches here: a draft, or a version sent back for
// revision.
// ============================================================

import { createPortal } from 'react-dom';
import { Trash2, X } from 'lucide-react';
import { STATUS_LABEL, type CourseLifecycleStatus } from '@/lib/courseActions';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const FONT = "'Poppins', sans-serif";

interface DeleteVersionDialogProps {
  open: boolean;
  /** Reads as "the draft of …" for a course or a journey. */
  subject: 'course' | 'journey';
  name: string;
  version: number;
  status: CourseLifecycleStatus;
  image?: string;
  /** Free text — the mocks carry both ISO dates and phrases like "Today". */
  lastUpdate?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteVersionDialog({
  open,
  subject,
  name,
  version,
  status,
  image,
  lastUpdate,
  onCancel,
  onConfirm,
}: DeleteVersionDialogProps) {
  if (!open) return null;

  // Nothing here is published, but only an on-draft item is literally a draft.
  const what = status === 'on-draft' ? 'this draft' : 'this version';

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(16,24,40,0.5)', fontFamily: FONT }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-[640px] bg-[#FDFDFD] rounded-2xl shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)] p-8 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#717680] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#FEF3F2] flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-[#D92D20]" />
        </div>

        <h3 className="text-[20px] font-semibold text-[#181D27] leading-[28px]">
          Are you sure you want to delete {what}?
        </h3>
        {/* The cover, the state and the age of what is about to go. */}
        <div className="w-full mt-5 rounded-xl border border-[#E9EAEB] bg-white p-4 flex items-center gap-4 text-left">
          <div className="w-[104px] h-[74px] rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0">
            <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold text-[#181D27] leading-[24px] line-clamp-2">{name}</p>
            {/* Version, state and age read as one plain, dot-separated line. */}
            <p className="text-[13px] text-[#717680] mt-1.5">
              Version {version} &middot; {STATUS_LABEL[status]}
              {lastUpdate && <> &middot; Last updated: {lastUpdate}</>}
            </p>
          </div>
        </div>

        <p className="text-[14px] text-[#535862] mt-4">This action cannot be undone.</p>

        <div className="flex gap-3 w-full mt-6">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl border border-[#E9EAEB] text-[14px] font-medium text-[#414651] hover:bg-[#F5F5F5] cursor-pointer transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-[#D92D20] text-[14px] font-semibold text-white hover:brightness-[0.92] cursor-pointer transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Journeys store an ISO timestamp; the dialog wants it readable. */
export function formatLastUpdate(value?: string) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
