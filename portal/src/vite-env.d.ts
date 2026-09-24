/// <reference types="vite/client" />

declare module '*.csv?raw' {
  const content: string;
  export default content;
}

declare module '*.geojson' {
  const content: any;
  export default content;
}
