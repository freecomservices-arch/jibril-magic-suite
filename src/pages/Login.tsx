import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import loginBg from '@/assets/login-bg.jpg';
import logoJibril from '@/assets/logo-jibril.png';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img src={loginBg} alt="Immobilier Maroc" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(228,22%,13%)] via-[hsl(228,22%,13%,0.7)] to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoJibril} alt="Jibril Immo" className="h-14 w-auto" />
              <div>
                <h1 className="font-heading text-2xl font-bold text-[hsl(220,14%,91%)]">Jibril Immo Pro</h1>
                <p className="text-sm text-[hsl(220,14%,70%)]"><p className="text-sm text-[hsl(220,14%,70%)]">Suite Immobilière — Maroc</p></p>
              </div>
            </div>
            <p className="text-lg text-[hsl(220,14%,80%)] leading-relaxed">
              Gérez vos biens, contacts et transactions immobilières avec une plateforme moderne et complète, 
              adaptée au marché marocain.
            </p>
            <div className="mt-8 flex gap-6">
              {[{ n: '150+', l: 'Biens gérés' }, { n: '500+', l: 'Contacts' }, { n: '98%', l: 'Satisfaction' }].map(s => (
                <div key={s.l}>
                  <p className="text-2xl font-heading font-bold text-primary">{s.n}</p>
                  <p className="text-xs text-[hsl(220,14%,70%)]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex w-full lg:w-2/5 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={logoJibril} alt="Jibril Immo" className="h-10 w-auto" />
            <h1 className="font-heading text-xl font-bold text-foreground">Jibril Immo Pro</h1>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Connexion</h2>
            <p className="mt-2 text-sm text-muted-foreground">Accédez à votre espace de gestion immobilière</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Entrez votre identifiant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Comptes de démonstration
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Admin :</span> admin / admin123</p>
              <p><span className="font-medium text-foreground">Agent :</span> amin / agent123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
