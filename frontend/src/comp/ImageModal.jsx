import React, { useCallback, useEffect, useState, useRef } from "react";
import { X, Loader2, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageModal({ onClose, imageUrl }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Cloudinary optimization
  const optimizedImageUrl = imageUrl
    ? `${imageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1600/")}`
    : null;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=")
        setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-" || e.key === "_")
        setZoom((z) => Math.max(z - 0.25, 1));
    },
    [onClose]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    if (closeButtonRef.current) closeButtonRef.current.focus();

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
      className="fixed inset-0 z-50 backdrop-blur-md bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-desc"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label="Close image modal"
        >
          <X className="w-6 h-6 text-gray-700 cursor-pointer" />
        </button>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
            className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Image Wrapper */}
        <div
          className="overflow-auto max-h-[90vh] max-w-full flex items-center justify-center"
          id="image-modal-desc"
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              <span className="sr-only">Loading image...</span>
            </div>
          )}

          {imageError ? (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <X className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Failed to load image</p>
              </div>
            </div>
          ) : (
            <img
              src={optimizedImageUrl}
              alt="Full View"
              id="image-modal-title"
              className={`rounded-lg shadow-xl transition-opacity duration-300 object-contain ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh", // ensures full image fits
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
