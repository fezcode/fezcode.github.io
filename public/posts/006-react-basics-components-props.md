# 006 - React Basics: Components and Props

At the core of React applications are **components**. Components are independent, reusable pieces of UI. They can be thought of as JavaScript functions that return JSX (JavaScript XML), which describes what the UI should look like. React applications are built by composing these components.

## Functional Components

The project primarily uses **functional components**, which are JavaScript functions that accept a single `props` (properties) object argument and return React elements.

### Example: `App` Component (`src/App.js`)

```javascript
// src/App.js
import React from 'react';
// ... imports

function App() {
  return (
    <Router>
      {/* ... other components */}
      <Layout>
        <AnimatedRoutes />
      </Layout>
      {/* ... */}
    </Router>
  );
}

export default App;
```

*   **`function App() { ... }`**: This defines a functional component named `App`. 
*   The `return` statement contains JSX, which is a syntax extension for JavaScript recommended by React to describe UI.
*   `<Layout>` and `<AnimatedRoutes>` are other components being used within `App`.

### Example: `Layout` Component (`src/components/Layout.js`)

Let's look at `src/components/Layout.js` to see a slightly more complex functional component.

```javascript
// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
// ... other imports

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  // ... other state and effects

  return (
    <div className="bg-gray-950 min-h-screen font-sans flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
```

*   **`const Layout = ({ children }) => { ... };`**: This defines another functional component, `Layout`, using an arrow function syntax. It directly destructures `children` from the `props` object. This is a common pattern.

## Props (Properties)

**Props** are how you pass data from a parent component to a child component. They are read-only and allow components to be dynamic and reusable.

### Passing Props

In the `App` component, you can see `Layout` being used:

```jsx
// Inside App component's return
<Layout>
  <AnimatedRoutes />
</Layout>
```

Here, `AnimatedRoutes` is passed as a special prop called `children` to the `Layout` component. Whatever content you place between the opening and closing tags of a component becomes its `children` prop.

### Receiving and Using Props

In the `Layout` component, `children` is received as a prop:

```javascript
const Layout = ({ children }) => {
  // ...
  return (
    // ...
    <main className="flex-grow">{children}</main>
    // ...
  );
};
```

The `Layout` component then renders `{children}` inside its `<main>` tag, meaning the `AnimatedRoutes` (or whatever was passed as children) will be rendered in that spot.

Another example of props in `Layout.js`:

```jsx
<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
<Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
```

Here:
*   The `Sidebar` component receives two props: `isOpen` (a boolean state variable) and `toggleSidebar` (a function).
*   The `Navbar` component also receives `toggleSidebar` and `isSidebarOpen`.

These props are defined in the `Layout` component's scope and passed down to its child components (`Sidebar`, `Navbar`) to control their behavior or appearance. For instance, `isOpen` might control the visibility of the sidebar, and `toggleSidebar` would be a function to change that visibility when a button in the `Navbar` is clicked.

## Summary

Functional components are the building blocks of React UIs, and props are the essential mechanism for communicating data and functionality between these components in a unidirectional flow (from parent to child). This modular approach makes React applications easier to manage, test, and scale.