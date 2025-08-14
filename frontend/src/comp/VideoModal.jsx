import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

export default function VideoModal({ onClose, videoUrl }) {
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Improved YouTube URL processing
  const embedUrl = useMemo(() => {
    if (!videoUrl) return "";
    
    // Handle different YouTube URL formats
    let videoId = "";
    
    if (videoUrl.includes("youtube.com/watch?v=")) {
      videoId = videoUrl.split("v=")[1]?.split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    } else if (videoUrl.includes("youtube.com/embed/")) {
      videoId = videoUrl.split("embed/")[1]?.split("?")[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    // If it's not a YouTube URL, return as is (for direct video files)
    return videoUrl;
  }, [videoUrl]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleVideoLoad = useCallback(() => {
    setVideoLoading(false);
    setVideoError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoading(false);
    setVideoError(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus trap: focus the close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset loading state when videoUrl changes
  useEffect(() => {
    setVideoLoading(true);
    setVideoError(false);
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 backdrop-blur-md bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-5xl aspect-video bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute -top-10 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label="Close video modal"
        >
          <X className="w-6 h-6 text-gray-700 cursor-pointer" />
        </button>

        {videoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {videoError ? (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center text-white">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p id="video-modal-title">Failed to load video</p>
              <p className="text-sm text-gray-400 mt-1">Please check the video URL</p>
            </div>
          </div>
        ) : (
          <>
            {embedUrl.includes("youtube.com/embed") ? (
              <iframe
                src={embedUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
                loading="eager"
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            ) : (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
                onLoadStart={() => setVideoLoading(true)}
                onCanPlay={() => setVideoLoading(false)}
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