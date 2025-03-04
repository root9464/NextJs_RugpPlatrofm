/* eslint-disable react-refresh/only-export-components */
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
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

const modalVariants = {
  initial: (origin: { x: number; y: number }) => ({
    opacity: 0,
    scale: 0.5,
    x: origin?.x ?? 0,
    y: origin?.y ?? 0,
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  exit: (origin: { x: number; y: number }) => ({
    opacity: 0,
    scale: 0.5,
    x: origin?.x ?? 0,
    y: origin?.y ?? 0,
  }),
};

const modalTransition = {
  type: 'spring',
  mass: 0.8,
  damping: 25,
  stiffness: 150,
  duration: 0.8,
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
          transition={modalTransition}
          className='bg-uiPrimaryBg relative h-full w-full origin-center shadow-xl'>
          <PageLayout className='grid h-full grid-cols-[73%_27%] gap-4'>{content}</PageLayout>
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
