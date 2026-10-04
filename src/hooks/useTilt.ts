import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { PointerEvent } from 'react';
import { followSpring } from '@/lib/motion';
import { useHasFinePointer } from './useMediaQuery';

/**
 * Leichtes 3D-Kippen eines Elements in Richtung Mauszeiger.
 * Nur mit Maus (nicht auf Touch-Geräten) und nicht bei reduzierter Bewegung.
 */
export function useTilt(maxDegrees = 4) {
  const hasFinePointer = useHasFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = hasFinePointer && !reduceMotion;
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [maxDegrees, -maxDegrees]),
    followSpring.soft,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-maxDegrees, maxDegrees]),
    followSpring.soft,
  );

  if (!enabled) return { enabled, handlers: {}, style: undefined };

  return {
    enabled,
    handlers: {
      onPointerMove(event: PointerEvent<HTMLElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width);
        pointerY.set((event.clientY - rect.top) / rect.height);
      },
      onPointerLeave() {
        pointerX.set(0.5);
        pointerY.set(0.5);
      },
    },
    style: { rotateX, rotateY, transformPerspective: 900 },
  };
}
