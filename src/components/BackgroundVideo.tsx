import React, { useRef, useEffect, useCallback } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const currentOpacityRef = useRef<number>(0);

  // Custom requestAnimationFrame-based fade system (no CSS transitions)
  // Each new fade cancels any running animation frame to prevent competing animations.
  // Fades resume from the current opacity rather than snapping.
  const fadeTo = useCallback((targetOpacity: number, durationMs: number, onComplete?: () => void) => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const video = videoRef.current;
    if (!video) return;

    const startOpacity = currentOpacityRef.current;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const newOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      currentOpacityRef.current = newOpacity;

      if (videoRef.current) {
        videoRef.current.style.opacity = String(newOpacity);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        if (onComplete) onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Fade-in on initial load / mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';
    currentOpacityRef.current = 0;

    const handleCanPlay = () => {
      if (!fadingOutRef.current && currentOpacityRef.current < 1) {
        fadeTo(1, 500);
      }
    };

    video.addEventListener('canplay', handleCanPlay);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          fadeTo(1, 500);
        })
        .catch((err) => {
          console.warn('Video autoplay policy note:', err);
        });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [fadeTo]);

  // 500ms fade-out when 0.55 seconds remain before the video ends.
  // fadingOutRef prevents re-triggering the fade-out from repeated timeUpdate events.
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const timeLeft = video.duration - video.currentTime;
    if (timeLeft <= 0.55 && !fadingOutRef.current) {
      fadingOutRef.current = true;
      fadeTo(0, 500);
    }
  };

  // On ended, opacity is set to 0, then after 100ms the video resets to currentTime = 0,
  // plays, and fades back in.
  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    currentOpacityRef.current = 0;
    video.style.opacity = '0';

    setTimeout(() => {
      fadingOutRef.current = false;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            fadeTo(1, 500);
          })
          .catch(() => {
            fadeTo(1, 500);
          });
      } else {
        fadeTo(1, 500);
      }
    }, 100);
  };

  return (
    <div id="video-wrapper" className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] scale-125 pointer-events-none"
        style={{ opacity: 0 }}
      />
      {/* Subtle cinematic gradient vignette to enhance contrast and depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};
