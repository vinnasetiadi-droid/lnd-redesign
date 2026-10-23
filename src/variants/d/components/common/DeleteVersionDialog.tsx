// ============================================================
// Delete confirmation — one dialog for every unpublished version
//
// Courses and journeys, admin and trainer, cards and detail pages all
// render this so the wording and the layout can't drift apart. Only
// unpublished work reaches here: a draft, or a version sent back for
// revision.
// ============================================================

import { createPortal } from 'react-dom';
import { Trash2, X } from '@/variants/d/icons';
import { STATUS_LABEL, type CourseLifecycleStatus } from '@/lib/courseActions';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const FONT = "'Outfit', sans-serif";

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
      style={{ backgroundColor: 'var(--od-overlay)', fontFamily: FONT }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-[640px] bg-(--od-dialog) rounded-[20px] shadow-(--od-shadow-dialog) p-8 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-(--od-text-muted) hover:bg-(--od-surface) transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-(--od-danger-surface) flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-(--od-danger)" />
        </div>

        <h3 className="text-[16px] text-(--od-text-strong) leading-[28px]">
          Are you sure you want to delete {what}?
        </h3>
        {/* The cover, the state and the age of what is about to go. */}
        <div className="w-full mt-5 rounded-[14px] bg-(--od-surface-muted) p-4 flex items-center gap-4 text-left">
          <div className="w-[104px] h-[74px] rounded-[10px] overflow-hidden bg-(--od-surface) shrink-0">
            <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] text-(--od-text-strong) leading-[24px] line-clamp-2">{name}</p>
            {/* Version, state and age read as one plain, dot-separated line. */}
            <p className="text-[12px] text-(--od-text-muted) mt-1.5">
              Version {version} &middot; {STATUS_LABEL[status]}
              {lastUpdate && <> &middot; Last updated: {lastUpdate}</>}
            </p>
          </div>
        </div>

        <p className="text-[13px] text-(--od-text-secondary) mt-4">This action cannot be undone.</p>

        <div className="flex gap-3 w-full mt-6">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-full bg-(--od-button-secondary) hover:bg-(--od-button-secondary-hover) text-[13px] text-(--od-text-body) hover:bg-(--od-surface) cursor-pointer transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-full bg-(--od-danger-solid) text-[13px] text-white hover:brightness-[0.92] cursor-pointer transition-colors"
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
