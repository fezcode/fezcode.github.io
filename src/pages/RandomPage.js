import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import Loading from '../components/Loading';
import { useToast } from '../hooks/useToast';

// * `hasNavigated` Ref: I introduced a useRef variable called hasNavigated.
// * Guard Clause: The useEffect now checks hasNavigated.current at the very beginning. If it's already true, it means a
// navigation attempt has been made, and it returns early.
// * Set Ref: hasNavigated.current is set to true just before calling navigate.
//
// This pattern effectively acts as a flag that ensures the navigation logic runs only once, even if React's Strict Mode
// re-runs useEffect in development or if other factors cause multiple renders.
//
//   Now, clicking "Random" should only redirect you once! ✅
const RandomPage = () => {
  const { items, isLoading } = useSearchableData();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) return; // Prevent double navigation in StrictMode or on re-render

    if (!isLoading && items.length > 0) {
      const allNavigableItems = items.filter(item => item.path && item.path !== '/random'); // Exclude itself

      if (allNavigableItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * allNavigableItems.length);
        const randomItem = allNavigableItems[randomIndex];
        hasNavigated.current = true; // Set ref before navigating
        navigate(randomItem.path);
        addToast({title: 'Random', message: `Navigating to ${randomItem.title || randomItem.path}`, duration: 2000});
      } else {
        hasNavigated.current = true; // Set ref before navigating
        navigate('/'); // Fallback to home if no other items exist
        addToast({title: 'Info', message: 'No random items found, redirecting to home.', duration: 3000});
      }
    } else if (!isLoading && items.length === 0) {
        hasNavigated.current = true; // Set ref before navigating
        navigate('/'); // Fallback to home if no items loaded
        addToast({title: 'Info', message: 'No searchable items loaded, redirecting to home.', duration: 3000});
    }
  }, [isLoading, items, navigate, addToast]); // Dependency array

  return <Loading />; // Show loading spinner while redirecting
};

export default RandomPage;
