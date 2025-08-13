
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { HowItWorks } from './components/HowItWorks';
import { SignInModal } from './components/SignInModal';
import { PaymentPage } from './components/PaymentPage';
import { Studio } from './components/Studio';
import { User, SubscriptionTier, AppView, Project } from './types';
import { onAuthChange, signOut, signInWithGoogle, signInWithApple } from './services/authService';
import { fetchUserProfile } from './services/userService';
import { loadProject } from './services/projectService';
import { AudioEngine } from './services/audioEngine';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { UpgradeModal } from './components/UpgradeModal';
import { AdSenseBanner } from './components/AdSenseBanner';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [view, setView] = useState<AppView>('app');
  const [targetTier, setTargetTier] = useState<SubscriptionTier | null>(null);

  const { addToast } = useToast();

  const audioEngine = useMemo(() => new AudioEngine(), []);
  
  useEffect(() => {
    audioEngine.loadSamples();
  }, [audioEngine]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
            const userProfile = await fetchUserProfile(firebaseUser);
            const userProject = await loadProject(firebaseUser.uid);
            setUser(userProfile);
            setProject(userProject);
        } catch(error: any) {
            addToast(error.message || 'Failed to load user data.', 'error');
            setUser(null);
            setProject(null);
        }
      } else {
        setUser(null);
        setProject(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [addToast]);

  const handleSignIn = async (provider: 'google' | 'apple') => {
    const signInFunction = provider === 'google' ? signInWithGoogle : signInWithApple;
    await signInFunction();
    setIsSignInModalOpen(false);
  };

  const handleSignOut = useCallback(() => {
    signOut();
    setView('app');
    setUser(null);
    setProject(null);
  }, []);

  const handleSubscribe = useCallback((tierToPurchase: SubscriptionTier) => {
    if (!user) {
      setIsSignInModalOpen(true);
      return;
    }
    setTargetTier(tierToPurchase);
    setView(tierToPurchase === user.subscriptionTier ? 'app' : 'payment');
    if (view === 'upgrade') setView('payment');
  }, [user, view]);
  
  const handleSuccessfulPayment = useCallback(async () => {
      if (user) {
        // Re-fetch user to get new tier, which the backend has updated
        const updatedUser = await fetchUserProfile(user); 
        setUser(updatedUser);
        addToast(`Subscription to ${updatedUser.subscriptionTier} successful!`, 'success');
      }
      setView('app');
      setTargetTier(null);
  }, [user, addToast]);

  const handleGoBack = useCallback(() => {
      setView('app');
      setTargetTier(null);
  }, []);
  
  const openUpgradeModal = useCallback(() => setView('upgrade'), []);
  const closeUpgradeModal = useCallback(() => setView('app'), []);
  
  const isAdVisible = user?.subscriptionTier === SubscriptionTier.Free;

  if (isLoading) {
      return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="font-orbitron text-2xl text-blue-400">Loading Tha Lab...</div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header user={user} onSignInClick={() => setIsSignInModalOpen(true)} onSignOut={handleSignOut} />
      
      <main style={{ paddingBottom: isAdVisible ? '80px' : '0' }}>
        {view === 'payment' && user && targetTier ? (
            <PaymentPage 
              onSuccess={handleSuccessfulPayment} 
              onGoBack={handleGoBack}
              tier={targetTier}
            />
        ) : (
          <>
            {user && project ? (
              <Studio user={user} project={project} setProject={setProject} onUpgrade={openUpgradeModal} audioEngine={audioEngine} />
            ) : ( user && !project ? (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="font-orbitron text-2xl text-blue-400">Loading Project...</div>
                </div>
            ) : (
              <>
                <Hero onGetStartedClick={() => setIsSignInModalOpen(true)} />
                <HowItWorks />
                <section id="pricing-section">
                    <Pricing onSubscribeClick={handleSubscribe} currentTier={SubscriptionTier.Free} />
                </section>
                <footer className="text-center py-8 text-gray-500 border-t border-gray-800">
                  <p>&copy; {new Date().getFullYear()} Tha Mobile Lab. All Rights Reserved.</p>
                </footer>
              </>
            ))}
          </>
        )}
      </main>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
      />
      
      <UpgradeModal 
        isOpen={view === 'upgrade'}
        onClose={closeUpgradeModal}
        onSubscribeClick={handleSubscribe}
        currentTier={user?.subscriptionTier || SubscriptionTier.Free}
      />
      
      {user && <AdSenseBanner user={user} />}
    </div>
  );
};

export const App: React.FC = () => (
    <ToastProvider>
        <AppContent />
    </ToastProvider>
);