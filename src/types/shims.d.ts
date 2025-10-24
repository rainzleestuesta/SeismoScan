declare module "react" {
  const React: any;
  export default React;
  export function useState<S>(initial: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useRef<T>(initial: T | null): { current: T | null };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: any[]): T;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): { render(children: any): void };
  const ReactDOM: {
    createRoot(container: Element | DocumentFragment): { render(children: any): void };
  };
  export default ReactDOM;
}

declare module "vitest" {
  export const describe: any;
  export const it: any;
  export const expect: any;
  export const vi: any;
}

declare module "maplibre-gl" {
  const maplibregl: any;
  export default maplibregl;
}

declare module "@vitejs/plugin-react" {
  const plugin: any;
  export default plugin;
}

declare module "vitest/config" {
  export const defineConfig: (...args: any[]) => any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
