import React, { useCallback, useEffect, useState, useRef } from "react";
import { X, Loader2 } from "lucide-react";

export default function ImageModal({ onClose, imageUrl }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
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

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
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
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute -top-10 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label="Close image modal"
        >
          <X className="w-6 h-6 text-gray-700 cursor-pointer" />
        </button>

        <div className="overflow-auto max-h-[90vh] relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
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
              src={imageUrl}
              alt="Full View"
              id="image-modal-title"
              className={`w-full h-auto rounded-lg shadow-xl transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="eager"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
      </div>
    </div>
  );
}