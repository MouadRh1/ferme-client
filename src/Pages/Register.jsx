import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      return setError('Les mots de passe ne correspondent pas');
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Erreur inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          📝 Inscription
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Nom complet', key: 'name', type: 'text', placeholder: 'Votre nom' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'email@exemple.com' },
            { label: 'Mot de passe', key: 'password', type: 'password', placeholder: '••••••' },
            { label: 'Confirmer mot de passe', key: 'password_confirmation', type: 'password', placeholder: '••••••' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}