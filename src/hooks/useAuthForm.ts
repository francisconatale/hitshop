import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth/auth';
import { AuthProvider } from '@/lib/auth/types';

export function useAuthForm(mode: 'login' | 'register') {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAuth = async (provider: AuthProvider, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      if (provider === 'email') {
        await authService[mode]('email', { email, displayName, password} as RegisterRequest);
      } else {
        await authService[mode]('google');
      }
            
      try {
        router.push('/');
        router.refresh();
      } catch (navError) {
        console.log("useAuthForm: Error de navegación (ignorable si redirige igual):", navError);
      }

    } catch (err: any) {
      console.error(`useAuthForm: ERROR CAPTURADO EN ${mode.toUpperCase()}:`, err);
      
      const errorMsg = err.message || 'AUTH_SYSTEM_FAILURE';
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  return {
    displayName, setDisplayName,
    email, setEmail,
    password, setPassword,
    error, isSubmitting,
    handleAuth
  };
}
