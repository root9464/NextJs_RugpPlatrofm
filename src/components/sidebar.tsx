'use client';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import LogoIco from '@assets/svg/logo.svg';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

const sidebarVariants = {
  open: {
    width: '200px',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
      mass: 0.8,
    },
  },
  closed: {
    width: '72px',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
      mass: 0.8,
    },
  },
};

const contentVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
      delay: 0.1,
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <motion.div
      className='bg-uiSecondaryBg fixed top-0 left-0 z-[2] flex h-screen flex-col items-center overflow-hidden px-2.5 pt-4'
      variants={sidebarVariants}
      initial='closed'
      animate={isOpen ? 'open' : 'closed'}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}>
      <AnimatePresence>
        <motion.div
          className='flex w-full flex-row items-center justify-between'
          animate={{ paddingLeft: isOpen ? 8 : 0, paddingRight: isOpen ? 8 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
          <Image src={LogoIco} alt='logo' className='h-[57px] w-[57px] cursor-pointer' />
          {isOpen && (
            <motion.h1
              className='text-base font-bold whitespace-nowrap select-none'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}>
              The platformer
            </motion.h1>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className='mt-4 w-full cursor-pointer text-center'>
            <h1>1111</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
