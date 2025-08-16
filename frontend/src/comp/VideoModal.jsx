import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

export default function VideoModal({ onClose, videoUrl }) {
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Process YouTube & other video URLs
  const embedUrl = useMemo(() => {
    if (!videoUrl) return "";

    let videoId = "";
    const ytRegex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;

    const match = videoUrl.match(ytRegex);
    if (match && match[1]) {
      videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    return videoUrl; // fallback for direct file URLs
  }, [videoUrl]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        // trap focus inside modal
        const focusableEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    },
    [onClose]
  );

  const handleVideoLoad = useCallback(() => {
    setVideoLoading(false);
    setVideoError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoading(false);
    setVideoError(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setVideoLoading(true);
    setVideoError(false);
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 backdrop-blur-md bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label="Close video modal"
        >
          <X className="w-6 h-6 text-gray-700 cursor-pointer" />
        </button>

        {/* Loading spinner */}
        {videoLoading && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 transition-opacity">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Error state */}
        {videoError ? (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center text-white">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
              <p id="video-modal-title">Failed to load video</p>
              <p className="text-sm text-gray-400 mt-1">
                Please check the video URL or try again later.
              </p>
            </div>
          </div>
        ) : (
          <>
            {embedUrl.includes("youtube.com/embed") ? (
              <iframe
                src={embedUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                loading="eager"
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            ) : (
              <video
                src={embedUrl}
                controls
                autoPlay
                playsInline
                muted
                className="w-full h-full"
                onLoadStart={() => setVideoLoading(true)}
                onCanPlay={handleVideoLoad}
                onError={handleVideoError}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </>
        )}
      </div>
    </div>
  );
}
