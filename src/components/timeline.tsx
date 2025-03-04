'use client';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const minDistance = 20; // Минимальное расстояние между контроллерами в пикселях

  // Инициализация Motion Values
  const leftX = useMotionValue(0);
  const rightX = useMotionValue(0);
  const highlightWidth = useTransform(() => rightX.get() - leftX.get());

  // Обработчик изменения размера контейнера
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      const width = containerRef.current?.offsetWidth || 0;
      setContainerWidth(width);
      rightX.set(width - minDistance);
    };

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    // Инициализация начальной ширины
    updateWidth();

    return () => observer.disconnect();
  }, [rightX]);

  // Обработчики перемещения контроллеров
  const handleLeftDrag = () => {
    const maxPosition = rightX.get() - minDistance;
    if (leftX.get() > maxPosition) leftX.set(maxPosition);
  };

  const handleRightDrag = () => {
    const minPosition = leftX.get() + minDistance;
    if (rightX.get() < minPosition) rightX.set(minPosition);
  };

  return (
    <div className='mx-auto w-full max-w-2xl p-4'>
      <motion.div ref={containerRef} className='relative h-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50'>
        {/* Шкала линейки */}
        <div className='absolute inset-0 flex items-center justify-between px-2'>
          {[...Array(11)].map((_, i) => (
            <div key={i} className='h-4 w-px bg-red-500' style={{ marginLeft: `${i * 10 - 0.5}%` }} />
          ))}
        </div>

        {/* Выделенная область */}
        <motion.div
          className='absolute h-full bg-blue-100/50'
          style={{
            x: leftX,
            width: highlightWidth,
          }}
        />

        {/* Левый контроллер */}
        <motion.div
          drag='x'
          onDrag={handleLeftDrag}
          dragConstraints={containerRef}
          dragElastic={0}
          style={{ x: leftX }}
          className='absolute top-0 h-full w-2 cursor-col-resize'>
          <div className='absolute top-1/2 left-0 h-8 w-6 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>

        {/* Правый контроллер */}
        <motion.div
          drag='x'
          onDrag={handleRightDrag}
          dragConstraints={containerRef}
          dragElastic={0}
          style={{ x: rightX }}
          className='absolute top-0 h-full w-2 cursor-col-resize'>
          <div className='absolute top-1/2 right-0 h-8 w-6 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg' />
        </motion.div>
      </motion.div>

      {/* Отображение значений */}
      <div className='mt-2 flex justify-between text-sm text-gray-600'>
        <motion.span>{useTransform(leftX, (x) => `${Math.round((x / containerWidth) * 100)}%`)}</motion.span>
        <motion.span>{useTransform(rightX, (x) => `${Math.round((x / containerWidth) * 100)}%`)}</motion.span>
      </div>
    </div>
  );
};
