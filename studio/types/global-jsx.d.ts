import type { JSX as ReactJSX } from 'react';

/**
 * React 19 moved the JSX namespace under `React`, so the global one is gone.
 * Packages typed before that - @monaco-editor/react among them - still write
 * `JSX.Element` in their declarations. Without a global namespace those
 * signatures silently degrade and `memo()` collapses their props to `never`,
 * which surfaces as "cannot be used as a JSX component" on perfectly valid
 * props. Point the old name back at React's own types.
 */
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type ElementType = ReactJSX.ElementType;
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}
