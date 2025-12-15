import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyCodePage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/scim';

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/users/reset-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json().catch(() => ({}));
      if (data?.success !== true) {
        toast.error(data?.message || 'Code invalide');
        return;
      }

      toast.success(data?.message || 'Code valide');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err) {
      toast.error(err?.message || 'Erreur');
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
            <p className="text-gray-600">Saisissez l'email et le code reçu pour continuer.</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-primary focus:border-transparent transition-colors"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Vérification...' : 'Valider'}
            </button>

            <Link to="/login" className="w-full text-gold-primary py-3 px-4 rounded-lg font-medium hover:bg-gold-light/30 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
