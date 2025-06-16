'use client'
import { useEffect, useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__SESSION_ID__) {
      setSessionId(window.__SESSION_ID__);
    }
  }, []);

  const handleSubmit = async(e :React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    //for login purpose api call
    if(isLogin) {
      if(!email || !password) {
        setError('Email and password are required');
        return;
      }
      const res = await fetch(`http://127.0.1:8000/api/login?session_id=${sessionId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if(res.ok) {
        const data = await res.json();
        console.log('Login successful:', data.userId);
        // Store user ID in localStorage
        localStorage.setItem('user_id',data.userId)
        // Redirect to listing page with session_id and userId
        const logAction = await fetch(`http://127.0.0.1:8000/_synthetic/log_event?session_id=${sessionId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'actionType': 'set_storage',
            'payload':{
              "text": "Setting user ID in session storage",
              "page_url": "str",
              "storage_type": "session",
              "key": "user_id",
              "value": `${data.userId}`
            }
          }),
        })
        router.push(`/`);
      }else {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } 
    //for signup purpose api call
    else {
      if( password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const res = await fetch(`http://127.0.0.1:8000/api/signup?session_id=${sessionId}`,{
        method : "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      if(res.ok) { 
        const data = await res.json();
        console.log('Sign up successful:', data.userId);
        setIsLogin(true);
      }
      else {
        const errorData = await res.json();
        setError(errorData.message || 'Sign up failed. Please try again.');
      }
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-400 focus:text-black"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-400"
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-400"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-purple-600 hover:underline">Sign Up</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-purple-600 hover:underline">Log In</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}