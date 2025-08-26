import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthModals } from "@/components/modals/auth-modals";
import { SubmitRecordModal } from "@/components/modals/submit-record-modal";
import { Fish, Menu, X, FileText, User, Trophy } from "lucide-react";

interface HeaderProps {
  user: any;
  onAuthSuccess: (user: any) => void;
  onLogout: () => void;
}

export function Header({ user, onAuthSuccess, onLogout }: HeaderProps) {
  const [location] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Acasă", href: "/", icon: Fish },
    { name: "Ghid Submisie", href: "/guidelines", icon: FileText },
  ];

  const isActive = (href: string) => location === href;

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Fish className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">PescArt România</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="bg-accent text-white hover:bg-yellow-600"
                    data-testid="button-submit-record"
                  >
                    <Fish className="h-4 w-4 mr-2" />
                    Adaugă Record
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Link href={`/user/${user.id}`}>
                      <Button variant="ghost" size="sm" data-testid="button-profile">
                        <User className="h-4 w-4 mr-1" />
                        {user.firstName}
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={onLogout} data-testid="button-logout">
                      Ieșire
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  onClick={() => setIsLoginModalOpen(true)}
                  data-testid="button-login"
                >
                  Conectare / Înregistrare
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setIsSubmitModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-accent text-white hover:bg-yellow-600"
                      >
                        <Fish className="h-4 w-4 mr-2" />
                        Adaugă Record
                      </Button>
                      <Link href={`/user/${user.id}`} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Profilul meu
                        </Button>
                      </Link>
                      <Button variant="ghost" onClick={onLogout} className="w-full justify-start">
                        Ieșire
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Conectare / Înregistrare
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modals */}
      <AuthModals
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onLoginClose={() => setIsLoginModalOpen(false)}
        onRegisterClose={() => setIsRegisterModalOpen(false)}
        onLoginSuccess={onAuthSuccess}
      />

      {/* Submit Record Modal */}
      <SubmitRecordModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        user={user}
      />
    </>
  );
}