
import React from 'react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (provider: 'google' | 'apple') => void;
}

// Dummy SVG icons for Google and Apple
const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.841 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const AppleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.228 3.364c1.14-1.24 1.83-2.923 1.83-4.364h-3.413c-1.31 0-2.58.6-3.434 1.626-1.012 1.19-1.835 2.87-1.835 4.354 0 .47.045.922.13 1.364h-3.37c-1.63 0-3.085.82-3.99 2.146-2.14 3.084-2.22 7.53-.22 10.66 1.01 1.57 2.37 3.15 4.09 3.19.78.02 1.56-.34 2.35-.34.78 0 1.56.36 2.45.36 1.73 0 3.02-1.57 4.03-3.17 1.14-1.82.99-4.99-.29-6.73h-4.03c.06-.67.1-1.35.1-2.03 0-1.55-.8-3.04-1.85-4.04zM14.64 1.13c.49-.55.97-1.13 1.7-1.13h.1c-.04.6-.26 1.17-.65 1.68-.45.57-.93 1.12-1.63 1.12h-.13c.12-.49.33-.97.6-1.67z"></path>
    </svg>
);


export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-900 border border-blue-500/30 rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-orbitron text-white">Join Tha Lab</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
        <p className="text-gray-400 mb-8 text-center">
          Sign in to begin your session. We only accept official Google and Apple accounts to ensure platform security.
        </p>
        <div className="space-y-4">
          <button onClick={() => onSignIn('google')} className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 border border-gray-700 hover:border-blue-500">
            <GoogleIcon />
            Sign In with Google
          </button>
          <button onClick={() => onSignIn('apple')} className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 border border-gray-700 hover:border-blue-500">
            <AppleIcon />
            Sign In with Apple
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-6 text-center">
          By signing in, you agree to our Terms of Service. Fake or temporary emails are not permitted and will be blocked.
        </p>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }
      `}</style>
    </div>
  );
};
