import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Data will be fetched from the backend API

function AvatarStack({ count, initialEnrolled = 0, isIncremented = false }) {
  const avatars = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3"
  ];

  return (
    <div 
      className="flex items-center gap-2 group/avatars cursor-help" 
      title={`Join ${count} other students learning this subject`}
    >
      <div className="flex -space-x-2 transition-transform group-hover/avatars:translate-x-1">
        {avatars.map((url, i) => (
          <img 
            key={i} 
            src={url} 
            alt="User avatar"
            className="w-7 h-7 rounded-full border-2 border-white transition-all group-hover/avatars:border-blue-400 group-hover/avatars:scale-110 object-cover bg-slate-100" 
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
        {isIncremented ? (parseFloat(count) + 0.1).toFixed(1) : count} Enrolled
      </span>
    </div>
  );
}

function StarRating({ initialRating, onRate }) {
  const [rating, setRating] = useState(parseFloat(initialRating));
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-all duration-200 ${star <= (hover || rating) ? "text-amber-400 scale-110" : "text-slate-200"} hover:scale-125 active:scale-90`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => {
            e.stopPropagation();
            setRating(star);
            if (onRate) onRate(star);
          }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
      <span className="text-slate-400 text-[10px] font-bold ml-1">({rating > 0 ? rating.toFixed(1) : "0.0"})</span>
    </div>
  );
}

// Helper to convert watch?v= and lists to embed/
const getEmbedUrl = (url) => {
  if (!url) return "";
  
  // Extract Video ID
  const videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const videoMatch = url.match(videoRegExp);
  const videoId = (videoMatch && videoMatch[2].length === 11) ? videoMatch[2] : null;

  // Extract Playlist ID
  const listMatch = url.match(/[?&]list=([^#\&\?]*)/);
  const listId = listMatch ? listMatch[1] : null;

  if (videoId) {
    let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    if (listId) embedUrl += `&list=${listId}`;
    return embedUrl;
  }
  
  return url;
};

function VideoModal({ videoUrl, title, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (videoUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl cursor-crosshair" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] ring-1 ring-white/10 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 shadow-xl group"
          title="Close Tutorial"
        >
          <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <iframe
          className="w-full h-full"
          src={getEmbedUrl(videoUrl)}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

function CourseCard({ course, onPlay }) {
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const reviews = course.reviews || "128";

  const handleEnroll = (e) => {
    e.stopPropagation();
    setIsEnrolled(!isEnrolled);
  };

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col ${hovered ? "-translate-y-1 shadow-xl shadow-blue-100 border-blue-100" : "shadow-md border-slate-100"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-44 overflow-hidden relative shrink-0 bg-slate-100">
        <img
          src={course.image}
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />
        {/* Play Button Overlay */}
        <button 
          onClick={() => onPlay()}
          className="absolute inset-0 flex items-center justify-center group/play transition-colors hover:bg-black/10"
        >
          <div className="w-12 h-12 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover/play:scale-110 border border-white/50">
            <svg className="w-5 h-5 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {/* Save Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }} 
            className={`w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all duration-300 active:scale-75 ${saved ? "bg-rose-500 text-white shadow-lg" : "bg-slate-900/40 text-white hover:bg-slate-900/60"}`}
          >
            <svg className={`w-4 h-4 transition-transform ${saved ? "scale-110" : "scale-100"}`} fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        {/* Top Row: Badge & Rating */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-blue-100 shadow-sm">
            {course.badge}
          </span>
          <StarRating initialRating={course.rating} />
        </div>
        
        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {course.title}
        </h3>
        {/* Description */}
        <p className="text-slate-500 text-[12px] line-clamp-2 mb-3 leading-relaxed font-medium">{course.description}</p>
        
        {/* Meta info: Level */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 ${course.levelColor}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 20h2v-5H5v5zm4 0h2V4H9v16zm4 0h2v-8h-2v8zm4 0h2v-11h-2v11z" />
              </svg>
              {course.level}
          </span>
        </div>

        {/* Bottom Actions row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
           <AvatarStack 
             count={course.enrolled} 
             initialEnrolled={course.enrolled} 
             isIncremented={isEnrolled} 
           />
           
           <button 
             onClick={handleEnroll}
             className={`h-9 px-4 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 shadow-md ${isEnrolled ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-200"}`}
           >
             {isEnrolled ? (
               <>
                 <svg className="w-3.5 h-3.5 animate-in zoom-in spin-in-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
                 Enrolled
               </>
             ) : (
               <>
                 Enroll
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}

export default function EducationHub() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch courses and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Courses
        const courseRes = await fetch("http://localhost:8080/api/courses");
        const courseData = await courseRes.json();
        setCourses(courseData);

        // Fetch Subjects for categories
        const subjectRes = await fetch("http://localhost:8080/api/subjects");
        const subjectData = await subjectRes.json();
        if (subjectData && subjectData.length > 0) {
          const cats = ["All", ...subjectData.map(s => s.name)];
          setCategories(cats);
        }
      } catch (error) {
        console.error("Failed to fetch education data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEnrollAction = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${courseId}/enroll`, {
        method: "PUT",
      });
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-transparent text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <VideoModal 
        videoUrl={selectedVideo?.videoUrl} 
        title={selectedVideo?.title} 
        onClose={() => setSelectedVideo(null)} 
      />

      <div className="p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {activeCategory === "All" ? "Tutorials" : `${activeCategory} Tutorials`}
                </h1>
                <p className="text-slate-500 text-sm max-w-md">
                  {activeCategory === "All" 
                    ? "Accelerate your learning journey with our AI-curated curriculum. Master modern technologies with precision-guided courses."
                    : `Explore our specialized ${activeCategory} curriculum. Master these skills with our precision-guided tutorials.`}
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="Search courses, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide mt-1">
              {!loading && categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {loading && [1,2,3,4,5].map(i => (
                <div key={i} className="w-24 h-9 bg-slate-200 rounded-full animate-pulse" />
              ))}
            </div>
          </header>

          {/* Course Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl">
            {loading ? (
              // Loading Shimmers
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-100 animate-pulse overflow-hidden">
                  <div className="h-44 bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              filtered.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onPlay={() => setSelectedVideo(course)}
                  onEnroll={() => handleEnrollAction(course.id)}
                />
              ))
            )}

            {!loading && (
              /* AI Path Card */
              <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white hover:bg-blue-50/40 hover:border-blue-300 transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Personalized Path?
                </h3>
                <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                  Let our AI analyze your skill gap and curate a custom learning track for you.
                </p>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200">
                  Generate Path
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-slate-400">
                <span className="text-5xl block mb-3">🔍</span>
                <p className="font-semibold text-slate-600 mb-1">No courses found</p>
                <p className="text-sm">Try a different search or category.</p>
              </div>
            )}
          </section>
      </div>

      {/* Floating AI Status Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full flex items-center gap-5 shadow-xl border border-slate-200/60 transition-all hover:scale-105">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          <span className="text-slate-800 text-xs font-bold uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI Copilot</span>
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <button className="flex items-center gap-1.5 text-blue-600 font-bold text-xs hover:text-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z" />
          </svg>
          Quick Enroll
        </button>
      </div>
      </div>
  );
}
