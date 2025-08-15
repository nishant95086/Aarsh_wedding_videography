import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  lazy,
  Suspense
} from "react";
import Button from "../comp/Button";
import { Image, Video, Play } from "lucide-react";
import Footer from "../comp/footer";
import { useNavigate } from "react-router-dom";
import ScrollProgress from "../../components/motion-primitives/scroll-progress";
import { mediaAPI } from "../api";
import { FaBriefcase } from "react-icons/fa";

// Lazy load modals so they don’t block initial render
const ImageModal = lazy(() => import("../comp/ImageModal"));
const VideoModal = lazy(() => import("../comp/VideoModal"));

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("photos");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await mediaAPI.getAll();
        const items = Array.isArray(res) ? res : res?.data || [];

        // Remove duplicates based on _id
        const uniqueItems = Array.from(new Map(items.map(i => [i._id, i])).values());

        setPhotos(uniqueItems.filter((item) => item.type === "photo"));
        setVideos(uniqueItems.filter((item) => item.type === "video"));
        setError(null);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load gallery. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const getYoutubeId = useCallback((url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : "";
  }, []);

  const videoThumbnails = useMemo(() => {
    return videos.map((video) => {
      const youtubeId = getYoutubeId(video.videoUrl);
      return {
        ...video,
        thumbnailUrl:
          video.thumbnailUrl ||
          (youtubeId
            ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            : video.imageUrl || "/default-video-thumbnail.svg"),
      };
    });
  }, [videos, getYoutubeId]);

  const photoThumbnails = useMemo(() => {
    return photos.map((photo) => ({
      ...photo,
      thumbnailUrl:
        photo.thumbnailUrl ||
        (photo.imageUrl
          ? `${photo.imageUrl}?w=600&h=600&fit=crop&fm=webp`
          : "/default-image.svg"),
    }));
  }, [photos]);

  const handleImageClick = useCallback((url) => setSelectedImage(url), []);
  const handleVideoClick = useCallback((url) => setSelectedVideo(url), []);
  const handleCloseImageModal = useCallback(() => setSelectedImage(null), []);
  const handleCloseVideoModal = useCallback(() => setSelectedVideo(null), []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative h-screen overflow-y-scroll scroll-smooth">
        <ScrollProgress
          containerRef={containerRef}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 z-50"
        />

        {/* Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl mt-40 font-EmilysCandy font-bold bg-gradient-to-l from-pink-500 to-purple-500 bg-clip-text text-transparent p-4">
            Our Gallery
          </h1>
          <p className="text-60 sm:text-xl font-Sedan font-bold text-gray-600 text-center">
            Explore our collection of beautiful moments captured with passion and artistry
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-5 mt-5">
          <Button onClick={() => setViewType("photos")} icon={Image} active={viewType === "photos"}>
            Photos ({photos.length})
          </Button>
          <Button onClick={() => setViewType("videos")} icon={Video} active={viewType === "videos"}>
            Videos ({videos.length})
          </Button>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap w-full gap-4 p-5">
          {viewType === "photos" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full">
              {photoThumbnails.map((photo) => (
                <div
                  key={photo._id}
                  className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl aspect-square"
                  onClick={() => handleImageClick(photo.imageUrl)}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title || "Photo"}
                    className="w-full h-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/default-image.svg")}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 rounded-full p-2">
                      <Image className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full">
              {videoThumbnails.map((video) => (
                <div
                  key={video._id}
                  className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl aspect-video"
                  onClick={() => handleVideoClick(video.videoUrl)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title || "Video"}
                    className="w-full h-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/default-video-thumbnail.svg")}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty states */}
        {viewType === "photos" && photos.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No photos available yet.</p>
          </div>
        )}
        {viewType === "videos" && videos.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No videos available yet.</p>
          </div>
        )}

        {/* Footer */}
        <Footer
          qus="Looking for Professional Services?"
          dic="Explore our wide range of offerings designed to meet your needs."
          btn1="View Services"
          icon1={FaBriefcase}
          onClick1={() => navigate("/service")}
        />
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={handleCloseImageModal} />}
        {selectedVideo && <VideoModal videoUrl={selectedVideo} onClose={handleCloseVideoModal} />}
      </Suspense>
    </>
  );
}
