import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/User/UserSlice';

function AppLogoutHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Check if the page is being refreshed
      if (performance.navigation.type === 1) {
        console.log("The page is being refreshed.");
      } else {
        console.log("The tab or browser is being closed.");
        dispatch(logout());
      }
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  return null;
}

export default AppLogoutHandler;
