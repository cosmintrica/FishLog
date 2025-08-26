import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onLoginClose: () => void;
  onRegisterClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export function AuthModals({ isLoginOpen, isRegisterOpen, onLoginClose, onRegisterClose, onLoginSuccess }: AuthModalsProps) {
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (user) => {
      toast({ title: "Conectare reușită!" });
      onLoginSuccess(user);
      onLoginClose();
      setLoginForm({ email: "", password: "" });
    },
    onError: () => {
      toast({ title: "Eroare", description: "Date de conectare invalide", variant: "destructive" });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (user) => {
      toast({ title: "Cont creat cu succes!" });
      onLoginSuccess(user);
      onRegisterClose();
      setRegisterForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Eroare", 
        description: error.message || "Nu s-a putut crea contul", 
        variant: "destructive" 
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: "Eroare", description: "Parolele nu coincid", variant: "destructive" });
      return;
    }

    const { confirmPassword, ...data } = registerForm;
    registerMutation.mutate(data);
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent data-testid="modal-login">
          <DialogHeader>
            <DialogTitle>Conectare</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="exemplu@email.com"
                required
                data-testid="input-email"
              />
            </div>
            <div>
              <Label htmlFor="login-password">Parolă</Label>
              <Input
                id="login-password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
                data-testid="input-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
              data-testid="button-submit-login"
            >
              {loginMutation.isPending ? "Se conectează..." : "Conectare"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={onRegisterClose}>
        <DialogContent data-testid="modal-register">
          <DialogHeader>
            <DialogTitle>Înregistrare</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="register-firstName">Prenume</Label>
                <Input
                  id="register-firstName"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  placeholder="Ion"
                  required
                  data-testid="input-firstname"
                />
              </div>
              <div>
                <Label htmlFor="register-lastName">Nume</Label>
                <Input
                  id="register-lastName"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  placeholder="Popescu"
                  required
                  data-testid="input-lastname"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="register-username">Nume utilizator</Label>
              <Input
                id="register-username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                placeholder="ion_popescu"
                required
                data-testid="input-username"
              />
            </div>
            <div>
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="exemplu@email.com"
                required
                data-testid="input-register-email"
              />
            </div>
            <div>
              <Label htmlFor="register-password">Parolă</Label>
              <Input
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="••••••••"
                required
                data-testid="input-register-password"
              />
            </div>
            <div>
              <Label htmlFor="register-confirmPassword">Confirmă Parola</Label>
              <Input
                id="register-confirmPassword"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                data-testid="input-confirm-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={registerMutation.isPending}
              data-testid="button-submit-register"
            >
              {registerMutation.isPending ? "Se înregistrează..." : "Înregistrare"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
