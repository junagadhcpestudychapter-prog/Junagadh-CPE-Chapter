import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { X, Images } from "lucide-react";
import { resolveAsset } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(searchParams.get("album") || "All");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    axios.get(`${API}/gallery`)
      .then((r) => { setPhotos(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Sync URL ?album= → state when user navigates
  useEffect(() => {
    const fromUrl = searchParams.get("album");
    if (fromUrl && fromUrl !== selectedAlbum) setSelectedAlbum(fromUrl);
  }, [searchParams]);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    if (album === "All") setSearchParams({});
    else setSearchParams({ album });
  };

  const albums = ["All", ...new Set(photos.map((p) => p.album))];
  const filtered = selectedAlbum === "All" ? photos : photos.filter((p) => p.album === selectedAlbum);

  const openLightbox = (photo) => setLightbox(photo);
  const closeLightbox = () => setLightbox(null);

  const navigate = (dir) => {
    const idx = filtered.findIndex((p) => p.id === lightbox.id);
    const newIdx = (idx + dir + filtered.length) % filtered.length;
    setLightbox(filtered[newIdx]);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, filtered]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="gallery-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Gallery</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Photo Gallery</h1>
          <p className="text-white/70 mt-3 text-lg">A glimpse into our events, programs, and chapter activities.</p>
        </div>
      </div>

      {/* Album Filter */}
      <div className="bg-[#F8FAFC] border-b border-slate-200" data-testid="gallery-filter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => handleAlbumClick(album)}
              data-testid={`album-filter-${album.toLowerCase().replace(/\s/g, "-")}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedAlbum === album
                  ? "bg-[#0A1E3F] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-[#0A1E3F] hover:text-[#0A1E3F]"
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-16" data-testid="gallery-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-slate-100 rounded-xl aspect-video animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Images size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No photos in this album.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((photo) => (
                <div
                  key={photo.id}
                  data-testid={`gallery-photo-${photo.id}`}
                  onClick={() => openLightbox(photo)}
                  className="group relative overflow-hidden rounded-xl aspect-square bg-slate-100 cursor-pointer hover-card"
                >
                  <img
                    src={resolveAsset(photo.photo_url)}
                    alt={photo.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#0A1E3F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-start justify-end p-3">
                    <span className="text-white/60 text-xs mb-0.5">{photo.album}</span>
                    <p className="text-white text-sm font-medium leading-tight">{photo.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          data-testid="lightbox"
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            data-testid="lightbox-close"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            data-testid="lightbox-prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full"
          >
            &#8592;
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={resolveAsset(lightbox.photo_url)}
              alt={lightbox.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{lightbox.title}</p>
              <p className="text-white/50 text-sm mt-1">{lightbox.album} • {new Date(lightbox.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            data-testid="lightbox-next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full"
          >
            &#8594;
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
