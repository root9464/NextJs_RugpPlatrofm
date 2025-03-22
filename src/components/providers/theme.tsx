import { ThemeProvider as NextThemesProvider } from 'next-themes';

export const ThemeProvider = ({ children, ...props }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider enableSystem storageKey='justd-theme' defaultTheme='dark' {...props}>
      {children}
    </NextThemesProvider>
  );
};
