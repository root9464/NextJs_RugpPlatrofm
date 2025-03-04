/* eslint-disable react-refresh/only-export-components */
'use client';
import { atom, useAtom } from 'jotai';
import { AnimatePresence, motion, Transition, Variants } from 'motion/react';
import { MouseEvent, ReactNode, useEffect } from 'react';
import { PageLayout } from './layouts/page.layout';

type ModalState = {
  isOpen: boolean;
  content: ReactNode | null;
  origin: { x: number; y: number; width: number; height: number } | null;
};

const modalAtom = atom<ModalState>({
  content: null,
  isOpen: false,
  origin: null,
});

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
  animate: {
    opacity: 1,
    scale: 1,
    width: '100%',
    height: '100%',
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      width: { duration: 0.6, delay: 0.1 },
      height: { duration: 0.6, delay: 0.1 },
      delay: 0.2,
      when: 'beforeChildren',
    },
  },
  exit: { opacity: 0, scale: 0.95, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.85, 0.6, 0.4, 0.2] } },
};

const contentVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const transition: Transition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.8,
  delay: 0.1,
  delayChildren: 0.1,
  when: 'beforeChildren',
};

const FullscreenModal = () => {
  const [{ isOpen, content, origin }] = useAtom(modalAtom);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          custom={origin}
          transition={transition}
          className='bg-uiPrimaryBg relative h-full w-full origin-center shadow-xl'
          style={{
            transformOrigin: origin ? `${origin.x}px ${origin.y}px` : 'center',
          }}>
          <motion.div variants={contentVariants}>
            <PageLayout className='grid h-full grid-cols-[73%_27%] gap-4'>{content}</PageLayout>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const useFullscreenModal = () => {
  const [modalState, setModalState] = useAtom(modalAtom);

  const mount = (event: MouseEvent, content: ReactNode) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalState({
      isOpen: true,
      content,
      origin: {
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY - window.innerHeight / 2,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const unmount = () => {
    setModalState({ isOpen: false, content: null, origin: null });
  };

  return { mount, unmount, modalState };
};

export { FullscreenModal, modalAtom, useFullscreenModal };

export const expandedViewAtom = atom<string | null>(null);
