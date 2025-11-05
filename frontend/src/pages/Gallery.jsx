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
import { Image, Video } from "lucide-react";
import Footer from "../comp/footer";
import { useNavigate } from "react-router-dom";
import { mediaAPI } from "../api";
import { FaBriefcase } from "react-icons/fa";
import { FixedSizeGrid as Grid } from "react-window";

// Lazy load modals
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

  const [containerWidth, setContainerWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth * 0.85 : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      const w = el ? el.clientWidth : window.innerWidth * 0.85;
      setContainerWidth(w);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await mediaAPI.getAll();
        const items = Array.isArray(res) ? res : res?.data || [];

        const uniqueItems = Array.from(new Map(items.map((i) => [i._id, i])).values());

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
    return photos.map((photo) => {
      const baseUrl = photo.imageUrl;
      return {
        ...photo,
        thumbnailUrl: baseUrl
          ? `${baseUrl}?w=600&h=600&fit=crop&auto=format,compress&q=auto`
          : "/default-image.svg",
        fullUrl: baseUrl
          ? `${baseUrl}?w=1600&h=1600&fit=inside&auto=format,compress&q=90`
          : "/default-image.svg",
      };
    });
  }, [photos]);

  const handleImageClick = useCallback((url) => setSelectedImage(url), []);
  const handleVideoClick = useCallback((url) => setSelectedVideo(url), []);
  const handleCloseImageModal = useCallback(() => setSelectedImage(null), []);
  const handleCloseVideoModal = useCallback(() => setSelectedVideo(null), []);

  // ✅ Responsive layout: 1 (mobile), 2 (tablet), 3 (desktop)
  const columnCount = useMemo(() => {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  }, []);

  const GAP = 20;
  const itemWidth = Math.floor((containerWidth - GAP * (columnCount + 1)) / columnCount);
  const itemHeight = itemWidth * 0.75;

  const items = viewType === "photos" ? photoThumbnails : videoThumbnails;
  const rowCount = Math.ceil(items.length / columnCount);

  const itemData = useMemo(
    () => ({ items, columnCount, handleImageClick, handleVideoClick, viewType }),
    [items, columnCount, handleImageClick, handleVideoClick, viewType]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const index = rowIndex * data.columnCount + columnIndex;
    const item = data.items[index];
    if (!item) return null;

    const cardStyle = {
      ...style,
      left: style.left + GAP,
      top: style.top + GAP,
      width: style.width - GAP,
      height: style.height - GAP,
      maxWidth: "100%",
    };

    return (
      <div style={cardStyle}>
        <div
          className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer bg-white border border-gray-100"
          onClick={() =>
            data.viewType === "photos"
              ? data.handleImageClick(item.fullUrl)
              : data.handleVideoClick(item.videoUrl)
          }
        >
          <div className="overflow-hidden">
            <img
              src={item.thumbnailUrl}
              alt={item.title || data.viewType}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{item.title}</h3>
          </div>
        </div>
      </div>
    );
  };

  const gridHeight = Math.max(window.innerHeight - 200, 400);

  return (
    <>
      <div
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col items-center"
      >
        {/* Header */}
        <div className="text-center pt-24 pb-10">
          <h1 className="text-5xl sm:text-6xl font-EmilysCandy font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Our Gallery
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full my-3"></div>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Explore our collection of beautiful moments captured with passion and artistry
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <Button onClick={() => setViewType("photos")} icon={Image} active={viewType === "photos"}>
            Photos ({photos.length})
          </Button>
          <Button onClick={() => setViewType("videos")} icon={Video} active={viewType === "videos"}>
            Videos ({videos.length})
          </Button>
        </div>

        {/* Gallery Container */}
        <div className="w-[85%] max-w-[90%] mx-auto pb-16">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No {viewType === "photos" ? "Photos" : "Videos"} Yet
              </h3>
              <p className="text-gray-500">Check back soon for new updates!</p>
            </div>
          ) : (
            <Grid
              columnCount={columnCount}
              columnWidth={itemWidth + GAP}
              height={gridHeight}
              rowCount={rowCount}
              rowHeight={itemHeight + GAP}
              width={containerWidth}
              itemData={itemData}
              style={{ overflowX: "hidden" }}
            >
              {Cell}
            </Grid>
          )}
        </div>

        <Footer
          qus="Looking for Professional Services?"
          dic="Explore our wide range of offerings designed to meet your needs."
          btn1="View Services"
          icon1={FaBriefcase}
          onClick1={() => navigate("/service")}
        />
      </div>

      <Suspense fallback={null}>
        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={handleCloseImageModal} />}
        {selectedVideo && <VideoModal videoUrl={selectedVideo} onClose={handleCloseVideoModal} />}
      </Suspense>
    </>
  );
}
