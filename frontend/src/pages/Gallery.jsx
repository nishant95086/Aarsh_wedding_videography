import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  lazy,
  Suspense,
} from "react";
import Button from "../comp/Button";
import { Image, Video } from "lucide-react";
import Footer from "../comp/footer";
import { useNavigate } from "react-router-dom";
import { mediaAPI } from "../api";
import { FaBriefcase } from "react-icons/fa";
import { FixedSizeGrid as Grid } from "react-window";

// ✅ Lazy load modals
const ImageModal = lazy(() => import("../comp/ImageModal"));
const VideoModal = lazy(() => import("../comp/VideoModal"));

// ✅ Memoized Cell for better performance
const Cell = React.memo(({ columnIndex, rowIndex, style, data }) => {
  const index = rowIndex * data.columnCount + columnIndex;
  const item = data.items[index];
  if (!item) return null;

  const GAP = 20;
  const cardStyle = {
    ...style,
    left: style.left + GAP,
    top: style.top + GAP,
    width: style.width - GAP,
    height: style.height - GAP,
    maxWidth: "100%",
  };

  const isMobileOrTablet =
    typeof window !== "undefined" && window.innerWidth < 1024;

  if (data.viewType === "photos") {
    return (
      <div style={cardStyle} onClick={() => data.handleImageClick(item.fullUrl)}>
        <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100">
          <div className="aspect-square overflow-hidden">
            <img
              src={item.thumbnailUrl}
              srcSet={`${item.small400} 400w, ${item.small800} 800w, ${item.small1200} 1200w`}
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={item.title || "Photo"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: "auto" }}
              onError={(e) => (e.target.src = "/default-image.svg")}
            />
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 transition-transform duration-300 ${
              isMobileOrTablet
                ? ""
                : "transform translate-y-full group-hover:translate-y-0"
            }`}
          >
            <h3 className="font-bold text-gray-800 text-sm truncate">
              {item.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Click to view full size
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={cardStyle} onClick={() => data.handleVideoClick(item.videoUrl)}>
        <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100">
          <div className="aspect-video overflow-hidden">
            <img
              src={item.thumbnailUrl}
              alt={item.title || "Video"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: "auto" }}
              onError={(e) => (e.target.src = "/default-video-thumbnail.svg")}
            />
          </div>
        </div>
      </div>
    );
  }
});

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

  // The container width is set to 85vw
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== "undefined" ? Math.floor(window.innerWidth * 0.85) : 1020
  );

  // ✅ Optimized Resize Handling with ResizeObserver
  useEffect(() => {
    const handleResize = () => {
      const w = Math.floor(window.innerWidth * 0.85); // 85vw
      setContainerWidth(w);
    };

    handleResize();

    let ro;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => handleResize());
      ro.observe(containerRef.current);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ✅ Fetch media with error handling
  useEffect(() => {
    let active = true;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await mediaAPI.getAll();
        if (!active) return;

        const items = Array.isArray(res) ? res : res?.data || [];
        const uniqueItems = Array.from(new Map(items.map((i) => [i._id, i])).values());

        setPhotos(uniqueItems.filter((item) => item.type === "photo"));
        setVideos(uniqueItems.filter((item) => item.type === "video"));
        setError(null);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load gallery. Please check your connection.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      active = false;
    };
  }, []);

  // ✅ Cached YouTube ID extractor
  const getYoutubeId = useCallback((url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : "";
  }, []);

  // ✅ Memoized Thumbnails
  const videoThumbnails = useMemo(
    () =>
      videos.map((video) => {
        const youtubeId = getYoutubeId(video.videoUrl);
        return {
          ...video,
          thumbnailUrl:
            video.thumbnailUrl ||
            (youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : video.imageUrl || "/default-video-thumbnail.svg"),
        };
      }),
    [videos, getYoutubeId]
  );

  const photoThumbnails = useMemo(
    () =>
      photos.map((photo) => {
        const baseUrl = photo.imageUrl;
        return {
          ...photo,
          thumbnailUrl: baseUrl
            ? `${baseUrl}?w=600&h=600&fit=crop&auto=format,compress&q=auto`
            : "/default-image.svg",
          fullUrl: baseUrl
            ? `${baseUrl}?w=1600&h=1600&fit=inside&auto=format,compress&q=90`
            : "/default-image.svg",
          small400: baseUrl
            ? `${baseUrl}?w=400&auto=format&q=auto`
            : "/default-image.svg",
          small800: baseUrl
            ? `${baseUrl}?w=800&auto=format&q=auto`
            : "/default-image.svg",
          small1200: baseUrl
            ? `${baseUrl}?w=1200&auto=format&q=auto`
            : "/default-image.svg",
        };
      }),
    [photos]
  );

  // ✅ Stable Handlers (memoized)
  const handleImageClick = useCallback((url) => setSelectedImage(url), []);
  const handleVideoClick = useCallback((url) => setSelectedVideo(url), []);
  const handleCloseImageModal = useCallback(() => setSelectedImage(null), []);
  const handleCloseVideoModal = useCallback(() => setSelectedVideo(null), []);

  // ✅ Responsive Columns
  const columnCount = useMemo(() => {
    const w = containerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  }, [containerWidth]);

  const GAP = 20;
  const itemWidth = Math.floor((containerWidth - GAP * (columnCount + 1)) / columnCount);
  const itemHeight = itemWidth;
  const items = viewType === "photos" ? photoThumbnails : videoThumbnails;
  const rowCount = Math.ceil(items.length / columnCount);

  // ✅ Memoize Grid Data
  const itemData = useMemo(
    () => ({ items, columnCount, handleImageClick, handleVideoClick, viewType }),
    [items, columnCount, handleImageClick, handleVideoClick, viewType]
  );

  const gridHeight = Math.max(window.innerHeight - 200, 400);

  // ✅ Early returns (loading / error)
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-500 animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Loading Gallery</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your media...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  // ✅ Main Render
  return (
    <>
      <div
        ref={containerRef}
        className="relative min-h-screen overflow-y-auto scroll-smooth bg-gradient-to-br from-pink-50 via-white to-purple-50"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center pt-32 pb-12 px-4">
          <div className="text-center space-y-4 max-w-4xl">
            <h1 className="text-5xl sm:text-7xl font-EmilysCandy font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] leading-tight">
              Our Gallery
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
            <p className="text-lg sm:text-xl font-Sedan text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore our collection of beautiful moments captured with passion and artistry
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-10 px-4">
          <Button onClick={() => setViewType("photos")} icon={Image} active={viewType === "photos"}>
            Photos ({photos.length})
          </Button>
          <Button onClick={() => setViewType("videos")} icon={Video} active={viewType === "videos"}>
            Videos ({videos.length})
          </Button>
        </div>

        {/* Grid Container: full width, but child is 85vw */}
        <div className="w-full flex justify-center pb-12">
          <div style={{ width: "85vw", maxWidth: "85vw" }}>
            {items.length === 0 ? (
              viewType === "photos" ? (
                <div className="text-center py-20">
                  <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Image className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Photos Yet</h3>
                    <p className="text-gray-500">Check back soon for amazing photos!</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Video className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Videos Yet</h3>
                    <p className="text-gray-500">Check back soon for exciting videos!</p>
                  </div>
                </div>
              )
            ) : (
              <div className="max-w-7xl mx-auto">
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
              </div>
            )}
          </div>
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
