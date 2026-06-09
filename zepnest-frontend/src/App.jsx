import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between">
          <h1 className="text-2xl font-bold">Zepnest</h1>
          {token && <button onClick={() => setToken(null)} className="bg-red-500 px-3 py-1 rounded">Logout</button>}
        </header>
        <main className="p-6 max-w-5xl mx-auto">
          <Routes>
            <Route path="/auth" element={!token ? <Auth setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <Dashboard token={token} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;