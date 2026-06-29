import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll if we are not navigating with hash links or query params that might require position
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // or 'auto' for instant jump
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
