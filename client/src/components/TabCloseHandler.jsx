import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/User/UserSlice'; // Update path as needed

function TabCloseHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUnload = (event) => {
      console.log("Tab or browser is being closed. Logging out...");
      dispatch(logout());
    };

    // Add event listener for unload
    window.addEventListener('unload', handleUnload);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, [dispatch]);

  return null;
}

export default TabCloseHandler;
