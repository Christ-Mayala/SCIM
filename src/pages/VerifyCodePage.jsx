import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function VerifyCodePage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email) newErrors.email = 'Email requis';
    if (!code) newErrors.code = 'Code requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { authAPI } = await import('../lib/api');
      const res = await authAPI.verifyResetCode(email, code);
      toast.success(res?.data?.message || 'Code valide');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Erreur';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-light/40 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification du code</h1>
            <p className="text-gray-700">Saisissez l'email et le code reçu pour continuer.</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({...prev, email: ''}));
                }}
                placeholder="votre@email.com"
                required
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email}
              />
            </div>

            <div>
              <Input
                label="Code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (errors.code) setErrors(prev => ({...prev, code: ''}));
                }}
                placeholder="123456"
                required
                leftIcon={<KeyRound className="w-5 h-5" />}
                error={errors.code}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Vérification...' : 'Valider'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="w-full text-gold-primary py-3 px-4 rounded-lg font-medium hover:bg-gold-light/30 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
