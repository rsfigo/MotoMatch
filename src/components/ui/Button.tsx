import { motion, type HTMLMotionProps } from 'motion/react';
import type { ComponentProps } from 'react';
import { Link } from 'react-router';
import { spring } from '@/lib/motion';
import { buttonClasses, type ButtonStyleProps } from './buttonStyles';

/** Federnde Mikro-Interaktion für alle Buttons. */
const pressMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: spring.snappy,
} as const;

type ButtonProps = ButtonStyleProps & HTMLMotionProps<'button'>;

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return (
    <motion.button
      type={type}
      {...pressMotion}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

const MotionLink = motion.create(Link);

type ButtonLinkProps = ButtonStyleProps & ComponentProps<typeof MotionLink>;

/** Sieht aus wie ein Button, navigiert aber wie ein Link. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return (
    <MotionLink
      {...pressMotion}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
