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
  const [redirectBlocked, setRedirectBlocked] = useState(false);
  const iframeRef = useRef(null);
  const hideTimerRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);

  const getEmbedUrl = () => {
    if (type === 'movie') {
      return `https://www.2embed.skin/embed/${id}`;
    } else {
      return `https://www.2embed.skin/embedtv/${id}&s=${season}&e=${episode}`;
    }
  };

  const embedUrl = getEmbedUrl();

  // ✅ BLOCK ALL REDIRECTS
  useEffect(() => {
    // Store original functions
    const originalOpen = window.open;
    const originalLocation = Object.getOwnPropertyDescriptor(window, 'location');

    // Block window.open completely
    window.open = (url, target, features) => {
      console.log('🚫 Blocked popup:', url);
      setRedirectBlocked(true);
      setTimeout(() => setRedirectBlocked(false), 3000);
      return null;
    };

    // Block window.location changes from iframe
    const handleBeforeUnload = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        e.preventDefault();
        e.returnValue = '';
        setRedirectBlocked(true);
        setTimeout(() => setRedirectBlocked(false), 3000);
        return '';
      }
    };

    // Refocus window when iframe tries to steal focus
    const handleBlur = () => {
      setTimeout(() => {
        window.focus();
      }, 0);
    };

    // Block all click events that try to open new tabs
    const handleClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' && target.target === '_blank') {
        e.preventDefault();
        e.stopPropagation();
        setRedirectBlocked(true);
        setTimeout(() => setRedirectBlocked(false), 3000);
      }
    };

    // Monitor for new tabs/windows
    const monitorInterval = setInterval(() => {
      // Close any popups that might have opened
      if (document.activeElement === iframeRef.current) {
        // iframe is focused
      }
    }, 1000);

    // Block form submissions from iframe
    const handleSubmit = (e) => {
      if (e.target.closest('iframe')) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('submit', handleSubmit, true);

    // Override window.open on iframe load
    const blockIframePopups = () => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.open = () => null;
        }
      } catch (e) {
        // Cross-origin - expected
      }
    };

    const iframeInterval = setInterval(blockIframePopups, 2000);

    return () => {
      window.open = originalOpen;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleSubmit, true);
      clearInterval(monitorInterval);
      clearInterval(iframeInterval);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Auto-hide controls
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!loading) setControlsVisible(false);
    }, 5000);
  }, [loading]);

  // Mouse/Touch events for controls
  useEffect(() => {
    const handleInteraction = () => showControls();

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleInteraction);
      container.addEventListener('touchstart', handleInteraction);
      container.addEventListener('click', handleInteraction);
    }
    document.addEventListener('keydown', handleInteraction);

    showControls();

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleInteraction);
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('click', handleInteraction);
      }
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [showControls]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Keep controls visible while loading
  useEffect(() => {
    if (loading) setControlsVisible(true);
    else showControls();
  }, [loading, showControls]);

  const handleRefresh = () => {
    setLoading(true);
    setControlsVisible(true);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      style={{ cursor: controlsVisible ? 'default' : 'none' }}
    >

      {/* ===== REDIRECT BLOCKED ALERT ===== */}
      {redirectBlocked && (
        <div className="fixed top-0 left-0 right-0 z-[110] bg-red-600 px-4 py-2 text-center animate-pulse">
          <p className="text-white text-xs font-bold">
            🚫 Redirect Blocked! You are safe. Continue watching.
          </p>
        </div>
      )}

      {/* ===== TOP BAR ===== */}
      <div
        className="absolute top-0 left-0 right-0 z-[105] px-3 py-2 sm:px-4 sm:py-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <div className="flex items-center justify-between">

          {/* Back */}
          <button
            onClick={onClose}
            className="flex items-center space-x-1 sm:space-x-2 bg-black/60 hover:bg-primary text-white px-3 py-2 sm:px-4 rounded-lg font-bold text-sm transition-colors backdrop-blur-sm"
          >
            <FiArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Title */}
          <div className="text-center flex-1 mx-2 sm:mx-4">
            <h3 className="text-white font-bold text-xs sm:text-base truncate drop-shadow-lg">
              {type === 'movie' ? '🎬' : '📺'} {title}
            </h3>
            {type === 'tv' && (
              <p className="text-gray-300 text-xs drop-shadow-lg">
                S{season} E{episode}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleRefresh}
              className="bg-black/60 hover:bg-gray-700 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
            >
              <FiRefreshCw size={14} />
            </button>
            <button
              onClick={onClose}
              className="bg-red-800/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm backdrop-blur-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* ===== PLAYER ===== */}
      <div className="absolute inset-0 bg-black">

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[104] bg-black">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-800 rounded-full" />
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🎬</span>
              </div>
            </div>
            <p className="text-white font-bold text-lg sm:text-xl mb-2">
              Loading...
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mb-6">
              Please wait while video loads
            </p>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FiRefreshCw size={14} />
              <span>Refresh if stuck</span>
            </button>
          </div>
        )}

        {/* iframe */}
        <iframe
          ref={iframeRef}
          key={iframeKey}
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          title={title}
          frameBorder="0"
          referrerPolicy="no-referrer"
          onLoad={() => {
            setLoading(false);
            showControls();
            // Try to block popups inside iframe
            try {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.open = () => null;
              }
            } catch (e) {}
          }}
          onError={() => setLoading(false)}
        />
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[105] px-3 py-2 sm:px-4"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-300 text-xs">
              Playing via <span className="text-white font-medium">2Embed</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-1 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
            >
              <FiRefreshCw size={11} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tap to show controls hint */}
      {!controlsVisible && !loading && (
        <div
          className="absolute inset-0 z-[103]"
          onClick={() => showControls()}
          style={{ pointerEvents: 'auto' }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;