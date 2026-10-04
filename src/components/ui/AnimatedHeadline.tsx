import { motion, type Variants } from 'motion/react';
import { Fragment } from 'react';
import { duration, ease, staggerContainer, staggerStep } from '@/lib/motion';

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.7em' },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slower, ease: ease.out } },
};

interface AnimatedHeadlineProps {
  text: string;
  className?: string;
  /** Verzögerung vor dem ersten Wort (Sekunden). */
  delay?: number;
}

/**
 * Überschrift, deren Wörter nacheinander von unten hereingleiten.
 * Jedes Wort steckt in einer Maske (overflow-hidden), dadurch wirkt es wie «aufgedeckt».
 * Screenreader lesen den Satz ganz normal vor.
 */
export function AnimatedHeadline({ text, className, delay = 0 }: AnimatedHeadlineProps) {
  const words = text.split(' ');

  return (
    <motion.h1
      className={className}
      variants={staggerContainer(staggerStep.loose, delay)}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.h1>
  );
}
