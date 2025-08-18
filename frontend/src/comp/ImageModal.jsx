import React, { useCallback, useEffect, useState, useRef } from "react";
import { X, Loader2, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageModal({ onClose, imageUrl }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const modalRef = useRef(null);

  // Optimize Cloudinary
  const optimizedImageUrl = imageUrl
    ? imageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1600/")
    : null;

  // Close modal with ESC
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(z - 0.25, 1));
    },
    [onClose]
  );

  // Click to zoom toggle
  const handleImageClick = () => {
    setZoom((z) => (z === 1 ? 1.75 : 1));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    setZoom(1);
  }, [imageUrl]);

  if (!imageUrl) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition z-20"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
            className="bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Image wrapper */}
        <div className="max-h-[90vh] max-w-[95vw] flex items-center justify-center overflow-hidden rounded-xl">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
            </div>
          )}

          {imageError ? (
            <div className="flex items-center justify-center h-64 w-64 bg-gray-200 rounded-lg">
              <p className="text-gray-600">Failed to load image</p>
            </div>
          ) : (
            <img
              src={optimizedImageUrl}
              alt="Preview"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              onClick={handleImageClick}
              className={`cursor-zoom-in rounded-xl shadow-xl transition-transform duration-300 ease-in-out object-contain ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{
                maxWidth: "95vw",
                maxHeight: "90vh",
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
