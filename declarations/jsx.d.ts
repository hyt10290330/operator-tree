declare module '*.jsx'

declare namespace JSX {
  interface IntrinsicElements {
    [element: string]: any
  }
}
