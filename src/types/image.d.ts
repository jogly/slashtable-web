declare module "*&as=img" {
  const image: { src: string; w: number; h: number; srcset?: string };
  export default image;
}

declare module "*?as=img" {
  const image: { src: string; w: number; h: number; srcset?: string };
  export default image;
}
