import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BuildingStorefrontIcon, ArrowLeftIcon } from '../components/icons';
import Spinner from '../components/Spinner';

const LoginPage: React.FC<{onSwitchToSignup: () => void, onBackToHome: () => void}> = ({ onSwitchToSignup, onBackToHome }) => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('client1');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userId || !password) {
      setError('Please enter both User ID and Password.');
      return;
    }
    setIsLoading(true);
    const success = await login(userId, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  const DemoCredentials: React.FC<{role: string; id: string}> = ({ role, id }) => (
    <div className="text-left text-sm">
        <p className="font-semibold">{role}</p>
        <button onClick={() => {setUserId(id); setPassword('password');}} className="text-left hover:text-blue-600">
            <p>ID: <code className="bg-slate-200 px-1 rounded">{id}</code></p>
            <p>Pass: <code className="bg-slate-200 px-1 rounded">password</code></p>
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
       <div className="absolute top-4 left-4">
            <button onClick={onBackToHome} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Home
            </button>
        </div>
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 text-blue-600">
          <BuildingStorefrontIcon className="h-10 w-10 mr-3" />
          <h1 className="text-4xl font-bold">TradieStop</h1>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-700">
                User ID
              </label>
              <div className="mt-1">
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  autoComplete="username"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., client1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {isLoading ? <Spinner size="sm" /> : 'Sign in'}
              </button>
            </div>
          </form>
          
           <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </button>
              </p>
           </div>

           <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-3">
                <h4 className="text-center font-medium text-slate-600 text-sm">Demo Accounts (Click to use)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-500">
                    <DemoCredentials role="Client" id="client1" />
                    <DemoCredentials role="Tradie" id="tradie1" />
                    <DemoCredentials role="Admin" id="admin1" />
                </div>
            </div>
        </div>
         <p className="text-center text-sm text-slate-500 mt-6">
            A showcase app by a world-class front-end engineer.
          </p>
      </div>
    </div>
  );
};

export default LoginPage;