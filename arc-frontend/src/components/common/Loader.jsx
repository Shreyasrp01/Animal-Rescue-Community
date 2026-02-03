const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative">
        
        {/* Outer Spinner */}
        <div className="h-16 w-16 rounded-full border-4 
          border-t-green-600 border-r-green-600 
          border-b-transparent border-l-transparent 
          animate-spin">
        </div>

        {/* Inner Spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 
            border-t-blue-600 border-r-blue-600 
            border-b-transparent border-l-transparent 
            animate-spin">
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loader;
