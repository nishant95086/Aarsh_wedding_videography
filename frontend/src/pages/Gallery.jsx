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
    typeof window !== "undefined" ? Math.min(window.innerWidth, 1200) : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      const w = el ? el.clientWidth : window.innerWidth;
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

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await mediaAPI.getAll();
        const items = Array.isArray(res) ? res : res?.data || [];

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
        small400: baseUrl ? `${baseUrl}?w=400&auto=format&q=auto` : "/default-image.svg",
        small800: baseUrl ? `${baseUrl}?w=800&auto=format&q=auto` : "/default-image.svg",
        small1200: baseUrl ? `${baseUrl}?w=1200&auto=format&q=auto` : "/default-image.svg",
      };
    });
  }, [photos]);

  const handleImageClick = useCallback((url) => setSelectedImage(url), []);
  const handleVideoClick = useCallback((url) => setSelectedVideo(url), []);
  const handleCloseImageModal = useCallback(() => setSelectedImage(null), []);
  const handleCloseVideoModal = useCallback(() => setSelectedVideo(null), []);

  const columnCount = useMemo(() => {
    const w = containerWidth;
    if (w < 640) return 1;
    if (w < 768) return 2;
    if (w < 1024) return 3;
    return 4;
  }, [containerWidth]);

  const GAP = 16;
  const itemWidth = Math.floor((containerWidth - GAP * (columnCount + 1)) / columnCount);
  const itemHeight = itemWidth;

  const items = viewType === "photos" ? photoThumbnails : videoThumbnails;
  const rowCount = Math.ceil(items.length / columnCount);

  const itemData = useMemo(
    () => ({ items, columnCount, handleImageClick, handleVideoClick, viewType }),
    [items, columnCount, handleImageClick, handleVideoClick, viewType]
  );

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

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const index = rowIndex * data.columnCount + columnIndex;
    const item = data.items[index];
    if (!item) return null;

    const commonWrapperClass =
      "group relative rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform duration-150 transform-gpu";

    const cardStyle = {
      ...style,
      left: style.left + GAP,
      top: style.top + GAP,
      width: style.width - GAP,
      height: style.height - GAP
    };

    if (data.viewType === "photos") {
      return (
        <div style={cardStyle} onClick={() => data.handleImageClick(item.fullUrl)}>
          <div className={commonWrapperClass + " aspect-square"}>
            <img
              src={item.thumbnailUrl}
              srcSet={`${item.small400} 400w, ${item.small800} 800w, ${item.small1200} 1200w`}
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
              alt={item.title || "Photo"}
              className="w-full h-full rounded-2xl object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: "auto" }}
              onError={(e) => (e.target.src = "/default-image.svg")}
            />
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-sm p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-sm truncate">{item.title}</h3>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={cardStyle} onClick={() => data.handleVideoClick(item.videoUrl)}>
          <div className={commonWrapperClass + " aspect-video"}>
            <img
              src={item.thumbnailUrl}
              alt={item.title || "Video"}
              className="w-full h-full rounded-2xl object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: "auto" }}
              onError={(e) => (e.target.src = "/default-video-thumbnail.svg")}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <Play className="w-7 h-7 text-white" fill="white" />
              </div>
            </div>
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-sm p-2 text-center">
              <h3 className="font-semibold text-gray-800 text-sm truncate">{item.title}</h3>
            </div>
          </div>
        </div>
      );
    }
  };

  const gridHeight = Math.max(window.innerHeight - 200, 400);

  return (
    <>
      <div ref={containerRef} className="relative min-h-screen overflow-y-auto scroll-smooth">
        <ScrollProgress
          containerRef={containerRef}
          className="fixed top-0 left-0 right-0 h-1 bg-red-500 z-50"
        />

        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl mt-40 font-EmilysCandy font-bold bg-gradient-to-l from-pink-500 to-purple-500 bg-clip-text text-transparent p-4">
            Our Gallery
          </h1>
          <p className="text-60 sm:text-xl font-Sedan font-bold text-gray-600 text-center">
            Explore our collection of beautiful moments captured with passion and artistry
          </p>
        </div>

        <div className="flex justify-center gap-5 mt-5">
          <Button onClick={() => setViewType("photos")} icon={Image} active={viewType === "photos"}>
            Photos ({photos.length})
          </Button>
          <Button onClick={() => setViewType("videos")} icon={Video} active={viewType === "videos"}>
            Videos ({videos.length})
          </Button>
        </div>

        <div className="w-full p-5">
          {items.length === 0 ? (
            viewType === "photos" ? (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No photos available yet.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No videos available yet.</p>
              </div>
            )
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
