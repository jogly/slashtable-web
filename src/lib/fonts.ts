import localFont from "next/font/local";

// Self-hosted variable faces with a real `font-display: optional` (next/font
// writes the @font-face `src`). Empty overrides in CSS cannot change the
// imported fontsource `swap` faces.
export const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "optional",
  variable: "--font-manrope",
  adjustFontFallback: "Arial",
});

export const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  style: "normal",
  display: "optional",
  variable: "--font-jetbrains",
  adjustFontFallback: "Arial",
});

export const playfair = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
      weight: "400 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2",
      weight: "400 900",
      style: "italic",
    },
  ],
  display: "optional",
  variable: "--font-playfair",
  adjustFontFallback: "Times New Roman",
});

export const sourceSerif = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  display: "optional",
  variable: "--font-source-serif",
  adjustFontFallback: "Times New Roman",
});

export const fontVariables = `${manrope.variable} ${jetbrainsMono.variable} ${playfair.variable} ${sourceSerif.variable}`;
