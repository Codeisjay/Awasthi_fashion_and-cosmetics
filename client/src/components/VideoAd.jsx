import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const VideoAd = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showVolumeHint, setShowVolumeHint] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Intersection Observer to detect when video is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        
        if (entry.isIntersecting && videoRef.current) {
          // Start playing when in viewport
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => console.log('Auto-play error:', err));
          }
          setIsPlaying(true);
        } else if (!entry.isIntersecting && videoRef.current) {
          // Stop playing when out of viewport
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.5 // Trigger when 50% of video is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(err => console.log('Play error:', err));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle video ended event to restart if needed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Video will auto-restart due to loop attribute, but ensure it plays
      if (isInViewport) {
        video.play().catch(err => console.log('Play error on ended:', err));
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [isInViewport]);

  if (!isVisible) return null;

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handlePauseClick = () => {
    setIsPlaying(false);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    setShowVolumeHint(false);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="py-12 xs:py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50 to-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 xs:mb-12 animate-fade-in">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black text-gray-900 mb-3 xs:mb-4">
            Featured Advertisement
          </h2>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg">
            Discover our premium collection
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          {/* Decorative elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0" />

          <div className="relative z-10 bg-black rounded-3xl overflow-hidden aspect-video">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              controls={false}
              autoPlay
              loop
              playsInline
            >
              <source src="/ads/awasthi-fashion-ad.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Overlay - Shows when paused by user */}
            {!isPlaying && isInViewport && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 flex flex-col items-center justify-center cursor-pointer group">
                {/* Play Button */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-300" />
                  <button
                    onClick={handlePlayClick}
                    className="relative flex items-center justify-center w-24 xs:w-28 sm:w-32 h-24 xs:h-28 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
                  >
                    <Play className="w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 text-white fill-white ml-1" />
                  </button>
                </div>

                {/* Text Overlay */}
                <div className="text-center px-4">
                  <h3 className="text-white font-bold text-lg xs:text-xl sm:text-2xl mb-2">
                    Awasthi Fashion & Cosmetics
                  </h3>
                  <p className="text-white/80 text-xs xs:text-sm sm:text-base mb-4">
                    Click to watch our latest collection
                  </p>
                  
                  {/* Volume Hint */}
                  {showVolumeHint && (
                    <div className="animate-pulse inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Volume2 className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-semibold">Sound enabled</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls Bar - Shows when playing */}
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 xs:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Volume Button - Always Visible */}
                  <button
                    onClick={handleVolumeToggle}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 transition-all text-white hover:scale-110 shadow-lg"
                    title={isMuted ? 'Unmute (sound off)' : 'Mute (sound on)'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>

                  {/* Status Text */}
                  <span className="text-white text-xs xs:text-sm font-semibold">
                    {isMuted ? 'Muted' : 'Sound On'}
                  </span>

                  {/* Pause Button */}
                  <button
                    onClick={handlePauseClick}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition-all text-white hover:scale-110"
                    title="Pause"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  </button>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => {
                    if (videoRef.current?.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition-all text-white hover:scale-110"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-all shadow-lg hover:scale-110"
              title="Close ad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Section Below Video */}
        <div className="mt-8 xs:mt-10 sm:mt-12 bg-white rounded-2xl p-6 xs:p-8 sm:p-10 shadow-lg border border-gray-100">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-6">
            <div>
              <h3 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Premium Fashion & Cosmetics
              </h3>
              <p className="text-gray-600 text-sm xs:text-base leading-relaxed max-w-2xl">
                Experience luxury and elegance with our curated collection of premium fashion and cosmetics. Designed for the modern, style-conscious individual who appreciates quality and excellence.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap text-sm xs:text-base"
              >
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAd;
