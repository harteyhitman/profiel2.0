'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AgreementSlider.module.scss';

interface AgreementSliderProps {
  value: number;
  onChange: (value: number) => void;
}

// Internal scale: -5, -3, -1, 0, 1, 3, 5 (negative = A, positive = B). Display only 0, 1, 3, 5.
const SCALE_VALUES = [-5, -3, -1, 0, 1, 3, 5];

export default function AgreementSlider({ value, onChange }: AgreementSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const snapToScale = (val: number) => {
    let closest = SCALE_VALUES[0];
    let minDist = Infinity;
    for (const s of SCALE_VALUES) {
      const d = Math.abs(val - s);
      if (d < minDist) {
        minDist = d;
        closest = s;
      }
    }
    return closest;
  };

  const clampedValue = (() => {
    const v = Math.max(-5, Math.min(5, value));
    return snapToScale(v);
  })();

  const getPositionFromValue = (val: number) => {
    const index = SCALE_VALUES.indexOf(val);
    if (index === -1) return 50;
    return (index / (SCALE_VALUES.length - 1)) * 100;
  };

  const getValueFromPosition = (percent: number) => {
    const p = Math.max(0, Math.min(100, percent));
    const index = Math.round((p / 100) * (SCALE_VALUES.length - 1));
    return SCALE_VALUES[Math.max(0, Math.min(index, SCALE_VALUES.length - 1))];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    onChange(getValueFromPosition(((e.clientX - (sliderRef.current?.getBoundingClientRect().left ?? 0)) / (sliderRef.current?.offsetWidth ?? 1)) * 100));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    onChange(getValueFromPosition(percent));
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const positionPercent = getPositionFromValue(clampedValue);

  const fillStyle = (() => {
    if (clampedValue === 0) {
      return { left: '50%', width: '2px' };
    }
    if (clampedValue > 0) {
      return { left: '50%', width: `${positionPercent - 50}%` };
    }
    return { left: `${positionPercent}%`, width: `${50 - positionPercent}%` };
  })();

  const displayLabel = (internalVal: number) => {
    if (internalVal === 0) return '0';
    return String(Math.abs(internalVal));
  };

  return (
    <div className={styles.sliderWrapper}>
      <div
        ref={sliderRef}
        className={styles.sliderTrack}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.sliderLabels}>
          {SCALE_VALUES.map((num) => (
            <button
              key={num}
              type="button"
              className={num === 0 ? styles.labelButtonZero : styles.labelButton}
              onClick={() => onChange(num)}
              style={{ left: `${getPositionFromValue(num)}%` }}
            >
              {displayLabel(num)}
            </button>
          ))}
        </div>

        <div className={styles.sliderBar}>
          <div
            className={clampedValue < 0 ? `${styles.sliderFill} ${styles.sliderFillLeft}` : styles.sliderFill}
            style={fillStyle}
          />
          <div
            className={styles.sliderThumb}
            style={{ left: `${positionPercent}%`, transform: 'translateX(-50%)' }}
          />
        </div>

        <div className={styles.sliderEndLabels}>
          <span className={styles.endLabel}>5:Strongly A</span>
          <span className={styles.endLabel}>Strongly B</span>
        </div>
      </div>
    </div>
  );
}
