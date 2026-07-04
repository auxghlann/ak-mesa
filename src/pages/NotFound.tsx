import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-[120px] leading-none font-display font-bold text-gray-900 mb-6 drop-shadow-sm">
          4<span className="text-google-blue">0</span>4
        </h1>
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-google-blue text-white px-8 py-4 rounded-full font-medium hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-lg"
        >
          <span className="material-symbols-rounded text-[24px]">home</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
