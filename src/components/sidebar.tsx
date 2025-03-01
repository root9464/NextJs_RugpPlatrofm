'use client';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import LogoIco from '@assets/svg/logo.svg';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

const sidebarVariants = {
  open: { width: '200px' },
  closed: { width: '72px' },
};

export const Sidebar = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  return (
    <motion.div
      className='bg-uiSecondaryBg fixed top-0 left-0 z-[2] flex h-screen flex-col items-center px-2.5 pt-4'
      variants={sidebarVariants}
      initial='closed'
      animate={isOpen ? 'open' : 'closed'}
      transition={{ duration: 0.3 }}
    >
      <Image src={LogoIco} alt='logo' className='h-[57px] w-[57px] cursor-pointer' onClick={onOpenChange} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className='mt-4'>
            <p>Sidebar Content</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
