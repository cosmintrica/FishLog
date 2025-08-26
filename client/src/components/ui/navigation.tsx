import { Fish } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  user: any;
  onLogout: () => void;
}

export function Navigation({ onLoginClick, onRegisterClick, user, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Fish className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-gray-900" data-testid="site-title">PescArt România</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#map" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-map">Hartă</a>
            <a href="#leaderboards" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-leaderboards">Clasamente</a>
            <a href="#records" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-records">Recorduri</a>
            <a href="#community" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-community">Comunitate</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700" data-testid="user-greeting">Bună, {user.firstName}!</span>
                <Button variant="outline" onClick={onLogout} data-testid="button-logout">
                  Deconectare
                </Button>
              </div>
            ) : (
              <>
                <button 
                  onClick={onLoginClick}
                  className="text-gray-700 hover:text-primary transition-colors"
                  data-testid="button-login"
                >
                  Conectare
                </button>
                <Button 
                  onClick={onRegisterClick}
                  className="bg-primary text-white hover:bg-green-700"
                  data-testid="button-register"
                >
                  Înregistrare
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
