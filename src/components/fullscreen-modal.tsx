/* eslint-disable react-refresh/only-export-components */
'use client';
import { atom, useAtom, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

const fullScreenModalAtom = atom<{
  key: string;
  content: React.ReactNode;
} | null>(null);

const FullscreenModal = () => {
  const [modal, setModal] = useAtom(fullScreenModalAtom);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modal]);

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          key={modal.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[3] h-full w-full bg-red-400'>
          <div className='relative h-full w-full'>{modal.content}</div>

          <button className='absolute top-4 right-4 z-10' onClick={() => setModal(null)}>
            закрыть
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const useFullscreenModal = () => {
  const setModalContent = useSetAtom(fullScreenModalAtom);

  const mount = (key: string, content: React.ReactNode) => {
    setModalContent({ key, content });
  };

  const unmount = () => {
    setModalContent(null);
  };

  return { mount, unmount };
};

export { FullscreenModal, fullScreenModalAtom, useFullscreenModal };
