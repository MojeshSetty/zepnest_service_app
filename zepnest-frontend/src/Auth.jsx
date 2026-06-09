import { useState } from 'react';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
   const url = isLogin ? 'http://127.0.0.1:8000/api/auth/login' : 'http://127.0.0.1:8000/api/auth/register';
    
    // FastAPI OAuth2 expects form data for login, but JSON for register in our setup
    let body, headers;
    if (isLogin) {
      body = new URLSearchParams({ username: formData.email, password: formData.password });
      headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    } else {
      body = JSON.stringify(formData);
      headers = { 'Content-Type': 'application/json' };
    }

    try {
      const res = await fetch(url, { method: 'POST', headers, body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      setToken(data.access_token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input className="w-full border p-2 rounded" placeholder="Full Name" required 
                 onChange={e => setFormData({...formData, full_name: e.target.value})} />
        )}
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" required 
               onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" required 
               onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 text-sm mt-4">
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}