export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b ">
      <div className="text-center">
        
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>

        <p className=" font-medium text-sm md:text-base">
          لطفاً کمی صبر کنید، داشبورد در حال بارگذاری است...
        </p>
      </div>
    </div>
  );
}
