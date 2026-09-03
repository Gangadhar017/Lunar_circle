import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ArrowsLeftRight } from '@phosphor-icons/react';

interface MapSwipeControlProps {
  layer1Url: string;
  layer2Url: string;
  label1?: string;
  label2?: string;
  onClose: () => void;
}

export const MapSwipeControl: React.FC<MapSwipeControlProps> = ({
  layer1Url,
  layer2Url,
  label1 = 'Before (T1)',
  label2 = 'After (T2)',
  onClose,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage (0 to 100)
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '60px',
        left: '20px',
        right: '20px',
        bottom: '80px',
        zIndex: 1002,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        background: '#0a0a0a',
        userSelect: 'none',
      }}
    >
      {/* Layer 2: Right / Bottom Base Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${layer2Url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Layer 1: Left Top Image with Clip Path */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${layer1Url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
        }}
      />

      {/* Top Labels Banner */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#60A5FA',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid rgba(59, 130, 246, 0.4)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {label1}
        </div>

        <button
          onClick={onClose}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          <X size={16} /> Exit Swipe View
        </button>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#34D399',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid rgba(52, 211, 153, 0.4)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {label2}
        </div>
      </div>

      {/* Draggable Vertical Divider Line */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          width: '4px',
          background: '#ffffff',
          cursor: 'ew-resize',
          zIndex: 20,
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Handle Button */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#1e3a8a',
            border: '2px solid #ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'ew-resize',
          }}
        >
          <ArrowsLeftRight size={18} weight="bold" />
        </div>
      </div>
    </div>
  );
};
