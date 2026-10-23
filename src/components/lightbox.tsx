import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = {
  url: string;
  title?: string | null;
  description?: string | null;
};

type LightboxProps = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  contextLabel?: string;
};

/**
 * Full-screen editorial lightbox with keyboard navigation
 * (left/right arrows, Escape to close) and smooth prev/next flow.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
  contextLabel,
}: LightboxProps) {
  const total = images.length;
  const current = images[index];

  useEffect(() => {
    if (index < 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && total > 1)
        onNavigate((index + 1) % total);
      if (event.key === "ArrowLeft" && total > 1)
        onNavigate((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, total, onClose, onNavigate]);

  if (index < 0 || !current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-foreground/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={current.title ?? "Image viewer"}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="eyebrow text-background/70">
          {contextLabel ? `${contextLabel} · ` : ""}
          {index + 1} / {total}
        </p>
        <button
          onClick={onClose}
          aria-label="Close viewer"
          className="rounded-full p-2 text-background/80 transition-colors hover:bg-background/10 hover:text-background"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        {total > 1 && (
          <button
            onClick={() => onNavigate((index - 1 + total) % total)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-background/80 transition-colors hover:bg-background/10 hover:text-background sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <img
          key={current.url}
          src={current.url}
          alt={current.title ?? "Outfit photograph"}
          className="max-h-full max-w-full object-contain"
        />
        {total > 1 && (
          <button
            onClick={() => onNavigate((index + 1) % total)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-background/80 transition-colors hover:bg-background/10 hover:text-background sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="px-4 pb-6 text-center sm:px-6">
        {current.title && (
          <p className="font-display text-2xl text-background">
            {current.title}
          </p>
        )}
        {current.description && (
          <p className="mt-1 text-sm text-background/70">
            {current.description}
          </p>
        )}
      </div>
    </div>
  );
}
