/* eslint-disable @typescript-eslint/no-unused-vars */
import { z, ZodError } from 'zod';

const validateResult = <T, U>(data: U, resType: z.ZodType<T>) => {
  try {
    return resType.parse(data);
  } catch (error) {
    console.error('Validation error:', (error as ZodError).message);
    throw error;
  }
};

const generateColor = () => {
  const lightness = Math.random() * 0.4 + 0.4;
  const chroma = Math.random() * 0.2 + 0.1;
  const hue = 250 + (Math.random() * 40 - 20);

  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
};

const copyClipboard = async (text: string) => await navigator.clipboard.writeText(text);

const formatUnixTime = (utime: number) => {
  const d = new Date(utime * 1000);
  const [_, day, month] = d.toUTCString().split(' ');
  const time = d.toTimeString().substring(0, 8);
  return `${day} ${month}, ${time}`;
};

export { copyClipboard, formatUnixTime, generateColor, validateResult };
