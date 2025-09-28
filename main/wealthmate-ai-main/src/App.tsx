import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingFlow from "./components/Onboarding/OnboardingFlow";
import NotificationsCenter from "./components/Notifications/NotificationsCenter";
import AIChatbot from "./components/AI/AIChatbot";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Check if onboarding is complete
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('profile_completed')
            .eq('user_id', session.user.id)
            .single();
          
          setIsOnboardingComplete(profile?.profile_completed || false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Check onboarding status
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('profile_completed')
            .eq('user_id', session.user.id)
            .single();
          
          setIsOnboardingComplete(profile?.profile_completed || false);
        } else {
          setUser(null);
          setIsOnboardingComplete(false);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = async () => {
    setIsOnboardingComplete(true);
    // Update profile in database
    if (user) {
      await supabase
        .from('user_profiles')
        .update({ profile_completed: true })
        .eq('user_id', user.id);
    }
  };

  const handleOnboardingSkip = () => {
    setIsOnboardingComplete(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading TaxWise AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show login/signup page (simplified for demo)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gradient-primary mb-4">Welcome to TaxWise AI</h1>
          <p className="text-muted-foreground mb-6">
            Your intelligent financial companion for tax optimization, credit management, and investment planning.
          </p>
          <button
            onClick={() => {
              // Simulate login for demo
              setUser({ id: 'demo-user', email: 'demo@taxwise.ai' });
              setIsOnboardingComplete(false);
            }}
            className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get Started (Demo)
          </button>
        </div>
      </div>
    );
  }

  if (!isOnboardingComplete) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Global Components */}
        <NotificationsCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
        
        <AIChatbot
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
        />
        
        {/* Floating Action Buttons */}
        <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
          <button
            onClick={() => setShowAIChat(true)}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
            title="AI Assistant"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowNotifications(true)}
            className="w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center relative"
            title="Notifications"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L19 5l-5 5" />
            </svg>
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
