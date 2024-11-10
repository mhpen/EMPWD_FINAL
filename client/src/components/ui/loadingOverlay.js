import { useEffect, useState } from 'react';

const LoadingOverlay = () => {
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setLoading(false);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer); // Cleanup timer on component unmount
   }, []);

   if (!loading) return null; // Don't render anything if loading is false

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
   );
};

export default LoadingOverlay;