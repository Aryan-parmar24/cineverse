import { useState, useEffect, useRef, useCallback } from 'react';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const VideoPlayer = ({
  id,
  title,
  type = 'movie',
  season = 1,
  episode = 1,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const iframeRef = useRef(null);
  const hideTimerRef = useRef(null);
  const containerRef = useRef(null);

  // Build 2embed URL
  const getEmbedUrl = () => {
    if (type === 'movie') {
      return `https://www.2embed.skin/embed/${id}`;
    } else {
      return `https://www.2embed.skin/embedtv/${id}&s=${season}&e=${episode}`;
    }
  };

  const embedUrl = getEmbedUrl();

  // Block popups globally
  useEffect(() => {
    const originalOpen = window.open;
    window.open = (url) => {
      console.log('🚫 Blocked:', url);
      return null;
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleBlur = () => {
      setTimeout(() => window.focus(), 100);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.open = originalOpen;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Auto-hide controls after 5 seconds
  const showControls = useCallback(() => {
    setControlsVisible(true);
    
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    
    hideTimerRef.current = setTimeout(() => {
      if (!loading) {
        setControlsVisible(false);
      }
    }, 5000);
  }, [loading]);

  // Show controls on mouse move
  useEffect(() => {
    const handleMouseMove = () => showControls();
    const handleKeyPress = () => showControls();

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleMouseMove);
    }
    document.addEventListener('keydown', handleKeyPress);

    // Start initial timer
    showControls();

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleMouseMove);
      }
      document.removeEventListener('keydown', handleKeyPress);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [showControls]);

  // Keep controls visible while loading
  useEffect(() => {
    if (loading) {
      setControlsVisible(true);
    } else {
      showControls();
    }
  }, [loading, showControls]);

  const handleIframeLoad = () => {
    setLoading(false);
    showControls();
  };

  const handleRefresh = () => {
    setLoading(true);
    setControlsVisible(true);
    setIframeKey(prev => prev + 1);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      style={{ cursor: controlsVisible ? 'default' : 'none' }}
    >

      {/* ===== TOP BAR - Auto hides ===== */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-transparent flex-shrink-0 absolute top-0 left-0 right-0 z-30"
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        {/* Back */}
        <button
          onClick={onClose}
          className="flex items-center space-x-2 bg-black/50 hover:bg-primary text-white px-4 py-2 rounded-lg font-bold transition-colors backdrop-blur-sm"
        >
          <FiArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Title */}
        <div className="text-center flex-1 mx-4">
          <h3 className="text-white font-bold text-sm sm:text-lg truncate drop-shadow-lg">
            {type === 'movie' ? '🎬' : '📺'} {title}
          </h3>
          {type === 'tv' && (
            <p className="text-gray-300 text-xs drop-shadow-lg">
              Season {season} • Episode {episode}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="bg-black/50 hover:bg-gray-700 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
            title="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
          <button
            onClick={onClose}
            className="bg-red-800/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-sm transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ===== PLAYER AREA - Full Screen ===== */}
      <div className="flex-1 relative bg-black overflow-hidden">

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black">
            <div className="relative mb-6">
              <div className="w-24 h-24 border-4 border-gray-800 rounded-full" />
              <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">🎬</span>
              </div>
            </div>
            <p className="text-white font-bold text-2xl mb-2">
              Loading...
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Please wait while video loads
            </p>

            <div className="bg-gray-900/80 rounded-xl p-4 w-72 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-300 text-sm">
                  Connecting to server
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Loading video source
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-700 rounded-full flex-shrink-0" />
                <span className="text-gray-500 text-sm">
                  Starting playback
                </span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="mt-6 flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FiRefreshCw size={14} />
              <span>Refresh if stuck</span>
            </button>
          </div>
        )}

        {/* iframe - Full Screen */}
        <iframe
          ref={iframeRef}
          key={iframeKey}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          title={title}
          frameBorder="0"
          referrerPolicy="no-referrer"
          onLoad={handleIframeLoad}
          onError={() => setLoading(false)}
        />
      </div>

      {/* ===== BOTTOM BAR - Auto hides ===== */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 z-30"
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300 text-xs drop-shadow-lg">
            Playing via <span className="text-white font-medium">2Embed</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1 bg-black/50 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors"
          >
            <FiRefreshCw size={12} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onClose}
            className="bg-red-800/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors"
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* ===== Click to show controls hint ===== */}
      {!controlsVisible && !loading && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 hover:opacity-100 transition-opacity">
          <p className="text-gray-500 text-xs bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            Move mouse to show controls
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;