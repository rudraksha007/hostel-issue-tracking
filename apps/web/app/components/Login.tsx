'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ShieldCheck, 
  Bell, 
  Clock, 
  FileText,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

/* ========================================
  TYPES & INTERFACES
  ========================================
*/
type AuthMode = 'login' | 'signup';
type StatusType = 'idle' | 'loading' | 'success' | 'error';

interface StatusMessage {
  type: StatusType;
  text: string;
}

interface FieldErrors {
  userId?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  email?: string;
}

/* ========================================
  CONSTANTS & CONFIG
  ========================================
*/
const VALIDATION_RULES = {
  userId: /^\d{8}$/, // Exactly 8 digits
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,14}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-Z\s]{2,50}$/,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/* ========================================
  MAIN COMPONENT
  ========================================
*/
export default function HostelAuthPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<AuthMode>('login');
  const [status, setStatus] = useState<StatusMessage>({ type: 'idle', text: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showFormMobile, setShowFormMobile] = useState(false); // Mobile: show form after tap
  
  // Login Form State
  const [loginData, setLoginData] = useState({ userId: '', password: '' });
  
  // Signup Form State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    userId: '',
    password: '',
    confirmPassword: ''
  });

  // --- EFFECT: Simulate Page Load & Initialize ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- VALIDATION FUNCTIONS ---
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'userId':
        if (!value) return 'User ID is required';
        if (!VALIDATION_RULES.userId.test(value)) return 'User ID must be exactly 8 digits';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (value.length > 14) return 'Password must not exceed 14 characters';
        if (!/[A-Z]/.test(value)) return 'Password needs at least 1 uppercase letter';
        if (!/[0-9]/.test(value)) return 'Password needs at least 1 number';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return 'Password needs at least 1 special character';
        break;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== signupData.password) return 'Passwords do not match';
        break;
      case 'name':
        if (!value) return 'Name is required';
        if (!VALIDATION_RULES.name.test(value)) return 'Name must be 2-50 letters only';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!VALIDATION_RULES.email.test(value)) return 'Please enter a valid email';
        break;
    }
    return undefined;
  };

  // --- HANDLERS: Input Changes with Real-time Validation ---
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For userId, only allow digits
    if (name === 'userId' && value !== '' && !/^\d*$/.test(value)) {
      return;
    }
    
    setLoginData({ ...loginData, [name]: value });
    
    // Clear field error on change
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For userId, only allow digits
    if (name === 'userId' && value !== '' && !/^\d*$/.test(value)) {
      return;
    }
    
    setSignupData({ ...signupData, [name]: value });
    
    // Clear field error on change
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  };

  // --- HANDLERS: Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (status.type === 'loading') return;
    
    setStatus({ type: 'loading', text: 'Processing request...' });
    setFieldErrors({});

    try {
      // Validation Logic
      const errors: FieldErrors = {};
      
      if (activeTab === 'login') {
        const userIdError = validateField('userId', loginData.userId);
        const passwordError = validateField('password', loginData.password);
        
        if (userIdError) errors.userId = userIdError;
        if (passwordError) errors.password = passwordError;
        
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setStatus({ type: 'error', text: 'Please fix the errors below.' });
          return;
        }

        // BACKEND API CALL - LOGIN
        const response = await fetch(`${API_BASE_URL}/auth/v1/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id: Number(loginData.userId),
            password: loginData.password,
            remember: rememberMe,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || data.message || 'Login failed');
        }

        if (data.success) {
          setStatus({ type: 'success', text: 'Login Successful! Redirecting...' });
          setTimeout(() => {
            router.push('/dashboard/user');
          }, 1500);
        } else {
          throw new Error(data.msg || 'Login failed');
        }

      } else {
        // Signup Validation
        const nameError = validateField('name', signupData.name);
        const emailError = validateField('email', signupData.email);
        const userIdError = validateField('userId', signupData.userId);
        const passwordError = validateField('password', signupData.password);
        const confirmError = validateField('confirmPassword', signupData.confirmPassword);
        
        if (nameError) errors.name = nameError;
        if (emailError) errors.email = emailError;
        if (userIdError) errors.userId = userIdError;
        if (passwordError) errors.password = passwordError;
        if (confirmError) errors.confirmPassword = confirmError;
        
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setStatus({ type: 'error', text: 'Please fix the errors below.' });
          return;
        }

        // BACKEND API CALL - SIGNUP
        const response = await fetch(`${API_BASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id: Number(signupData.userId),
            password: signupData.password,
            name: signupData.name,
            email: signupData.email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || data.message || 'Signup failed');
        }

        if (data.success) {
          setStatus({ type: 'success', text: 'Account Created Successfully! Please login.' });
          setTimeout(() => {
            setActiveTab('login');
            setLoginData({ userId: signupData.userId, password: '' });
            setSignupData({ name: '', email: '', userId: '', password: '', confirmPassword: '' });
            setStatus({ type: 'idle', text: '' });
          }, 2000);
        } else {
          throw new Error(data.msg || 'Signup failed');
        }
      }

    } catch (error: unknown) {
      // Comprehensive Error Handling
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized') || error.message.toLowerCase().includes('invalid')) {
          errorMessage = 'Invalid credentials. Please check your User ID and Password.';
        } else if (error.message.includes('409') || error.message.toLowerCase().includes('exists')) {
          errorMessage = 'An account with this User ID already exists.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setStatus({ type: 'error', text: errorMessage });
    }
  };

  // --- PAGE LOADING STATE ---
  if (isPageLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0f1a]">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          <p className="text-lg text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[#0a0f1a] text-white">
      {/* ============================================
          MOBILE VIEW: Fullscreen cards + overlay form
          ============================================ */}
      <div className="lg:hidden min-h-screen w-full relative">
        {/* Animated Cards Background */}
        <div 
          className={`absolute inset-0 bg-[#0d1321] overflow-hidden flex flex-col items-center justify-center transition-all duration-500 ${showFormMobile ? 'blur-md' : ''}`}
          onClick={() => !showFormMobile && setShowFormMobile(true)}
        >
          {/* Gradient Orbs Background */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl" />
          
          {/* Single Marquee Row - Centered */}
          <div className="w-full overflow-hidden">
            <div className="flex animate-marquee">
              <FeatureCard icon={<FileText size={48} />} title="Easy Log" sub="Report issues instantly" />
              <FeatureCard icon={<Clock size={48} />} title="Real-time" sub="Track status live" />
              <FeatureCard icon={<ShieldCheck size={48} />} title="Secure" sub="Verified access" />
              <FeatureCard icon={<Bell size={48} />} title="Alerts" sub="Get notified" />
            </div>
          </div>

          {/* Tap to continue hint */}
          {!showFormMobile && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-pulse z-10">
              <p className="text-base font-medium text-slate-300">Tap anywhere to continue</p>
              <div className="w-8 h-8 border-2 border-cyan-400/60 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Form Overlay (Mobile) */}
        <div 
          className={`
            absolute inset-0 z-20 flex items-center justify-center p-4
            transition-all duration-500 ease-in-out
            ${showFormMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          <div className="w-full max-w-md backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-6 max-h-[90vh] overflow-y-auto animate-fadeIn relative bg-[#0a0f1a]/95 border border-white/10">
            
            {/* Close Button */}
            <button
              onClick={() => setShowFormMobile(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>

            {/* Greeting */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Welcome Back!
              </h1>
              <p className="text-sm text-slate-400">Smart Hostel Issue Management System</p>
            </div>

            {/* Mobile Form Content */}
            <MobileFormContent 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              status={status}
              setStatus={setStatus}
              fieldErrors={fieldErrors}
              handleSubmit={handleSubmit}
              loginData={loginData}
              handleLoginChange={handleLoginChange}
              signupData={signupData}
              handleSignupChange={handleSignupChange}
              handleBlur={handleBlur}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
            />
          </div>
        </div>
      </div>

      {/* ============================================
          DESKTOP VIEW: 50/50 Split Layout
          ============================================ */}
      
      {/* Left Side: Orbit Animation (50%) */}
      <div className="hidden lg:flex w-1/2 min-h-screen relative overflow-hidden items-center justify-center bg-[#0d1321]">
        {/* Gradient Orbs Background */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl" />
        
        {/* Orbit Container */}
        <div className="relative w-80 h-80 xl:w-96 xl:h-96 z-10">
          {/* Orbit path circle */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed" />
          
          {/* Rotating container for cards */}
          <div className="absolute inset-0 animate-orbit">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <FeatureCardDesktop icon={<FileText size={24} />} title="Easy Log" sub="Report instantly" />
            </div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
              <FeatureCardDesktop icon={<Clock size={24} />} title="Real-time" sub="Track live" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <FeatureCardDesktop icon={<ShieldCheck size={24} />} title="Secure" sub="Verified" />
            </div>
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
              <FeatureCardDesktop icon={<Bell size={24} />} title="Alerts" sub="Notified" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form (50%) */}
      <div className="hidden lg:flex w-1/2 min-h-screen flex-col justify-center p-12 xl:p-16 overflow-y-auto bg-[#0a0f1a]">
        
        {/* Greeting */}
        <div className="text-center mb-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-slate-400">Smart Hostel Issue Management System</p>
        </div>
            
          {/* Tab Switcher */}
          <div className="flex mb-4 md:mb-8 max-w-md mx-auto w-full rounded-xl p-1 bg-[#141b2d]">
            <button
              onClick={() => { setActiveTab('login'); setStatus({type:'idle', text:''}); setFieldErrors({}); }}
              className={`flex-1 py-2.5 md:py-3 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'login' 
                ? 'bg-linear-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25' 
                : 'text-slate-400 hover:text-white'
              }`}
              aria-selected={activeTab === 'login'}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setStatus({type:'idle', text:''}); setFieldErrors({}); }}
              className={`flex-1 py-2.5 md:py-3 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'signup' 
                ? 'bg-linear-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25' 
                : 'text-slate-400 hover:text-white'
              }`}
            aria-selected={activeTab === 'signup'}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="max-w-md mx-auto w-full">

          {/* Status Message Display */}
          {status.type !== 'idle' && (
            <div 
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn backdrop-blur-sm ${
                status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}
              role="alert"
            >
              {status.type === 'loading' && <Loader2 className="animate-spin shrink-0" size={18} />}
              {status.type === 'error' && <AlertCircle className="shrink-0" size={18} />}
              {status.type === 'success' && <CheckCircle className="shrink-0" size={18} />}
              <span>{status.text}</span>
              {status.type === 'error' && (
                <button 
                  onClick={() => setStatus({ type: 'idle', text: '' })}
                  className="ml-auto hover:opacity-70 text-lg font-bold"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              )}
            </div>
          )}
          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form 
              onSubmit={handleSubmit} 
              className="space-y-5 animate-slideInRight"
              noValidate
            >
              <div>
                <Label text="User ID (8 Digits)" htmlFor="login-userId" />
                <Input 
                  id="login-userId"
                  name="userId" 
                  type="text" 
                  maxLength={8} 
                  placeholder="12345678" 
                  value={loginData.userId} 
                  onChange={handleLoginChange}
                  onBlur={handleBlur}
                  error={fieldErrors.userId}
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <Label text="Password" htmlFor="login-password" />
                <div className="relative">
                  <Input 
                    id="login-password"
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter Password" 
                    value={loginData.password} 
                    onChange={handleLoginChange}
                    onBlur={handleBlur}
                    error={fieldErrors.password}
                    required
                    autoComplete="current-password"
                    maxLength={14}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-cyan-400 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  8-14 chars with 1 Uppercase, 1 Number, 1 Special character
                </p>
              </div>
              
              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-400">
                  Remember me
                </label>
              </div>
              
              <SubmitButton isLoading={status.type === 'loading'} text="Login to Dashboard" />
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 animate-slideInLeft"
              noValidate
            >
              <div>
                <Label text="Full Name" htmlFor="signup-name" />
                <Input 
                  id="signup-name"
                  name="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={signupData.name} 
                  onChange={handleSignupChange}
                  onBlur={handleBlur}
                  error={fieldErrors.name}
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <Label text="Email ID" htmlFor="signup-email" />
                <Input 
                  id="signup-email"
                  name="email" 
                  type="email" 
                  placeholder="john@college.edu" 
                  value={signupData.email} 
                  onChange={handleSignupChange}
                  onBlur={handleBlur}
                  error={fieldErrors.email}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label text="User ID (8 Digits)" htmlFor="signup-userId" />
                <Input 
                  id="signup-userId"
                  name="userId" 
                  type="text" 
                  maxLength={8} 
                  placeholder="Create 8-digit ID" 
                  value={signupData.userId} 
                  onChange={handleSignupChange}
                  onBlur={handleBlur}
                  error={fieldErrors.userId}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label text="Password" htmlFor="signup-password" />
                  <div className="relative">
                    <Input 
                      id="signup-password"
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Password" 
                      value={signupData.password} 
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      error={fieldErrors.password}
                      required
                      autoComplete="new-password"
                      maxLength={14}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-cyan-400 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label text="Confirm" htmlFor="signup-confirmPassword" />
                  <div className="relative">
                    <Input 
                      id="signup-confirmPassword"
                      name="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm" 
                      value={signupData.confirmPassword} 
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      error={fieldErrors.confirmPassword}
                      required
                      autoComplete="new-password"
                      maxLength={14}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-cyan-400 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Password: 8-14 chars, 1 Uppercase, 1 Number, 1 Special character
              </p>
              <SubmitButton isLoading={status.type === 'loading'} text="Create Account" />
            </form>
          )}

        </div>
        
        {/* Connection Error Retry */}
        {status.type === 'error' && status.text.includes('connect') && (
          <button
            onClick={() => setStatus({ type: 'idle', text: '' })}
            className="mt-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 animate-fadeIn mx-auto transition-colors"
          >
            <RefreshCw size={16} />
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
}

/* ========================================
  SUB-COMPONENTS
  ========================================
*/

const Label = ({ text, htmlFor }: { text: string; htmlFor?: string }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1 text-slate-300"
    >
      {text}
    </label>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = ({ error, className = '', ...props }: InputProps) => {
  return (
    <div>
      <input 
        {...props}
        className={`w-full px-4 py-3 rounded-xl border ${
          error 
            ? 'border-red-500/50 focus:ring-red-500/50' 
            : 'border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50'
        } bg-[#141b2d] text-white placeholder:text-slate-500 focus:ring-2 outline-none transition-all ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <p id={`${props.id}-error`} className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

const SubmitButton = ({ isLoading, text }: { isLoading: boolean; text: string }) => (
  <button 
    type="submit" 
    disabled={isLoading}
    className="w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
  >
    {isLoading && <Loader2 className="animate-spin" size={20} />}
    {isLoading ? 'Please wait...' : text}
  </button>
);

// Card for Mobile marquee animation - Large size to occupy screen
const FeatureCard = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => {
  return (
    <div className="w-72 h-72 mx-6 shrink-0 backdrop-blur-md rounded-3xl shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center text-center p-8 transform transition-all bg-[#141b2d]/80 border border-white/10">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <div className="text-2xl font-bold leading-tight text-white">{title}</div>
      <div className="text-base leading-tight mt-2 text-slate-400">{sub}</div>
      <div className=""></div>
    </div>
  );
};

// Card for Desktop orbit animation
const FeatureCardDesktop = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => {
  return (
    <div className="w-28 h-28 xl:w-32 xl:h-32 backdrop-blur-md rounded-2xl shadow-xl shadow-cyan-500/10 flex flex-col items-center justify-center text-center p-3 animate-counter transform transition-all hover:scale-110 hover:border-cyan-500/30 hover:shadow-cyan-500/20 cursor-pointer bg-[#141b2d]/90 border border-white/10">
      <div className="text-cyan-400 mb-2">{icon}</div>
      <div className="text-sm font-bold leading-tight text-white">{title}</div>
      <div className="text-xs leading-tight mt-1 text-slate-400">{sub}</div>
    </div>
  );
};

// Mobile Form Content Component
interface MobileFormContentProps {
  activeTab: AuthMode;
  setActiveTab: (tab: AuthMode) => void;
  status: StatusMessage;
  setStatus: (status: StatusMessage) => void;
  fieldErrors: FieldErrors;
  handleSubmit: (e: React.FormEvent) => void;
  loginData: { userId: string; password: string };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  signupData: { name: string; email: string; userId: string; password: string; confirmPassword: string };
  handleSignupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
}

const MobileFormContent = ({
  activeTab,
  setActiveTab,
  status,
  setStatus,
  fieldErrors,
  handleSubmit,
  loginData,
  handleLoginChange,
  signupData,
  handleSignupChange,
  handleBlur,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  rememberMe,
  setRememberMe,
}: MobileFormContentProps) => {
  return (
  <>
    {/* Tab Switcher */}
    <div className="flex mb-4 w-full rounded-xl p-1 bg-[#141b2d]">
      <button
        onClick={() => { setActiveTab('login'); setStatus({type:'idle', text:''}); }}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
          activeTab === 'login' 
          ? 'bg-linear-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25' 
          : 'text-slate-400 hover:text-white'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => { setActiveTab('signup'); setStatus({type:'idle', text:''}); }}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
          activeTab === 'signup' 
          ? 'bg-linear-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25' 
          : 'text-slate-400 hover:text-white'
        }`}
      >
        Sign Up
      </button>
    </div>

    {/* Status Message */}
    {status.type !== 'idle' && (
      <div 
        className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
          status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        }`}
      >
        {status.type === 'loading' && <Loader2 className="animate-spin shrink-0" size={16} />}
        {status.type === 'error' && <AlertCircle className="shrink-0" size={16} />}
        {status.type === 'success' && <CheckCircle className="shrink-0" size={16} />}
        <span className="flex-1">{status.text}</span>
      </div>
    )}

    {/* Login Form */}
    {activeTab === 'login' && (
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label text="User ID (8 Digits)" htmlFor="mobile-login-userId" />
          <Input 
            id="mobile-login-userId"
            name="userId" 
            type="text" 
            maxLength={8} 
            placeholder="12345678" 
            value={loginData.userId} 
            onChange={handleLoginChange}
            onBlur={handleBlur}
            error={fieldErrors.userId}
            required
          />
        </div>
        <div>
          <Label text="Password" htmlFor="mobile-login-password" />
          <div className="relative">
            <Input 
              id="mobile-login-password"
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Enter Password" 
              value={loginData.password} 
              onChange={handleLoginChange}
              onBlur={handleBlur}
              error={fieldErrors.password}
              required
              maxLength={14}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-500 hover:text-cyan-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mobile-remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-500 border-slate-600 bg-slate-800"
          />
          <label htmlFor="mobile-remember" className="text-sm text-slate-400">Remember me</label>
        </div>
        <SubmitButton isLoading={status.type === 'loading'} text="Login" />
      </form>
    )}

    {/* Signup Form */}
    {activeTab === 'signup' && (
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <Label text="Full Name" htmlFor="mobile-signup-name" />
          <Input 
            id="mobile-signup-name"
            name="name" 
            type="text" 
            placeholder="John Doe" 
            value={signupData.name} 
            onChange={handleSignupChange}
            onBlur={handleBlur}
            error={fieldErrors.name}
            required
          />
        </div>
        <div>
          <Label text="Email" htmlFor="mobile-signup-email" />
          <Input 
            id="mobile-signup-email"
            name="email" 
            type="email" 
            placeholder="john@college.edu" 
            value={signupData.email} 
            onChange={handleSignupChange}
            onBlur={handleBlur}
            error={fieldErrors.email}
            required
          />
        </div>
        <div>
          <Label text="User ID (8 Digits)" htmlFor="mobile-signup-userId" />
          <Input 
            id="mobile-signup-userId"
            name="userId" 
            type="text" 
            maxLength={8} 
            placeholder="Create 8-digit ID" 
            value={signupData.userId} 
            onChange={handleSignupChange}
            onBlur={handleBlur}
            error={fieldErrors.userId}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label text="Password" htmlFor="mobile-signup-password" />
            <div className="relative">
              <Input 
                id="mobile-signup-password"
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={signupData.password} 
                onChange={handleSignupChange}
                onBlur={handleBlur}
                error={fieldErrors.password}
                required
                maxLength={14}
                className="pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-slate-500 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <Label text="Confirm" htmlFor="mobile-signup-confirm" />
            <div className="relative">
              <Input 
                id="mobile-signup-confirm"
                name="confirmPassword" 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Confirm" 
                value={signupData.confirmPassword} 
                onChange={handleSignupChange}
                onBlur={handleBlur}
                error={fieldErrors.confirmPassword}
                required
                maxLength={14}
                className="pr-8"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-3 text-slate-500 hover:text-cyan-400"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500">8-14 chars, 1 Uppercase, 1 Number, 1 Special char</p>
        <SubmitButton isLoading={status.type === 'loading'} text="Create Account" />
      </form>
    )}
  </>
  );
};