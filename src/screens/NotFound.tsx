import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/logo-orange.png" 
            alt="Lani" 
            className="w-16 h-16"
          />
        </div>

        {/* 404 Text */}
        <div>
          <h1 className="text-8xl font-bold text-primary_1">404</h1>
          <h2 className="text-2xl font-semibold text-main mt-2">Page Not Found</h2>
          <p className="text-sub mt-2 font-dm">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Back to Home Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary_1 text-white rounded-xl hover:bg-primary_1/90 transition-colors"
          >
            <Home size={20} />
            <span>Back to Previous Page</span>
          </button>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm font-dm text-sub">
          If you believe this is a mistake, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default NotFound; 