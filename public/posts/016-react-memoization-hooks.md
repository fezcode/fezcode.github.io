# 016 - React: Memoization Hooks (`useCallback`, `useMemo`) and `React.memo`

In React, components re-render when their state or props change. While React is highly optimized, unnecessary re-renders can sometimes impact performance, especially for complex components or frequently updated lists. Memoization techniques help prevent these unnecessary re-renders by caching computation results or function definitions.

## 1. `useCallback` Hook

`useCallback` is a Hook that returns a memoized callback function. It's useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary re-renders.

### Syntax

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b], // dependencies
);
```

*   The function `() => { doSomething(a, b); }` will only be re-created if `a` or `b` changes.

### Example from `src/components/ToastProvider.js`

```javascript
// src/components/ToastProvider.js
import React, { createContext, useState, useCallback } from 'react';
// ...

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const newToast = { ...toast, id: id++ };
    setToasts((prevToasts) => {
      if (prevToasts.length >= 5) {
        const updatedToasts = prevToasts.slice(0, prevToasts.length - 1);
        return [newToast, ...updatedToasts];
      }
      return [newToast, ...prevToasts];
    });
  }, []); // Empty dependency array: addToast is created only once

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []); // Empty dependency array: removeToast is created only once

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {/* ... */}
    </ToastContext.Provider>
  );
};
```

**Explanation:**

*   Both `addToast` and `removeToast` functions are wrapped in `useCallback` with an empty dependency array (`[]`). This means these functions are created only once when the `ToastProvider` component first renders and will not change on subsequent re-renders.
*   This is important because `addToast` and `removeToast` are passed down as part of the `value` to `ToastContext.Provider`. If these functions were re-created on every render, any child component consuming this context and relying on reference equality (e.g., with `React.memo` or `useMemo`) might unnecessarily re-render.

## 2. `useMemo` Hook

`useMemo` is a Hook that returns a memoized value. It's useful for optimizing expensive calculations that don't need to be re-computed on every render.

### Syntax

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

*   The function `() => computeExpensiveValue(a, b)` will only execute if `a` or `b` changes. Otherwise, it returns the previously computed value.

### Conceptual Example (Not directly in project, but common use case)

Imagine a component that filters a large list based on some criteria:

```javascript
function ProductList({ products, filterText }) {
  // This filtering operation can be expensive if products is a very large array
  const filteredProducts = products.filter(product =>
    product.name.includes(filterText)
  );

  // With useMemo, the filtering only re-runs if products or filterText changes
  const memoizedFilteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.includes(filterText)
    );
  }, [products, filterText]);

  return (
    <div>
      {memoizedFilteredProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 3. `React.memo` (Higher-Order Component)

`React.memo` is a higher-order component (HOC) that memoizes a functional component. It works similarly to `PureComponent` for class components. If the component's props are the same as the previous render, `React.memo` will skip rendering the component and reuse the last rendered result.

### Syntax

```javascript
const MyMemoizedComponent = React.memo(MyComponent, [arePropsEqual]);
```

*   `MyComponent`: The functional component to memoize.
*   `arePropsEqual` (optional): A custom comparison function. If provided, React will use it to compare `prevProps` and `nextProps`. If it returns `true`, the component will not re-render.

### Conceptual Example (Not directly in project, but common use case)

```javascript
// ProductItem.js
function ProductItem({ product }) {
  console.log('Rendering ProductItem', product.name);
  return <li>{product.name}</li>;
}

export default React.memo(ProductItem);

// In ProductList component (from useMemo example)
// If ProductItem is memoized, it will only re-render if its 'product' prop changes.
```

**Explanation:**

*   By wrapping `ProductItem` with `React.memo`, React will perform a shallow comparison of its props. If the `product` prop (and any other props) remains the same between renders of its parent, `ProductItem` will not re-render, saving computational resources.

## Summary

`useCallback`, `useMemo`, and `React.memo` are powerful tools for optimizing the performance of React applications by preventing unnecessary re-renders. They are particularly useful in scenarios involving expensive computations, frequently updated components, or when passing functions/objects as props to child components that rely on reference equality. While not every component needs memoization, understanding when and how to apply these techniques is crucial for building high-performance React applications.