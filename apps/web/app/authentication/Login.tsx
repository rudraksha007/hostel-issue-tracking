'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type TabType = 'login' | 'signup';

const AuthPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('login');
    
    // Login state
    const [loginUserId, setLoginUserId] = useState<number | null>(null);
    const [loginPassword, setLoginPassword] = useState<string>('');
    
    // Signup state
    const [signupName, setSignupName] = useState<string>('');
    const [signupEmail, setSignupEmail] = useState<string>('');
    const [signupPassword, setSignupPassword] = useState<string>('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState<string>('');
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const validateUserId = (id: number | null): string | null => {
        if (id === null) {
            return 'User ID is required';
        }
        if (id.toString().length !== 8) {
            return 'User ID must be exactly 8 digits';
        }
        return null;
    };

    const validatePassword = (pwd: string): string | null => {
        if (!pwd) {
            return 'Password is required';
        }
        if (pwd.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (pwd.length > 12) {
            return 'Password must not exceed 12 characters';
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain at least one capital letter';
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const validateEmail = (email: string): string | null => {
        if (!email) {
            return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const userIdError = validateUserId(loginUserId);
        if (userIdError) {
            setError(userIdError);
            return;
        }

        const passwordError = validatePassword(loginPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: loginUserId,
                    password: loginPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            router.push('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!signupName.trim()) {
            setError('Name is required');
            return;
        }

        const emailError = validateEmail(signupEmail);
        if (emailError) {
            setError(emailError);
            return;
        }

        const passwordError = validatePassword(signupPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (signupPassword !== signupConfirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    password: signupPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            setSuccess('Account created successfully! Please login.');
            setActiveTab('login');
            // Clear signup form
            setSignupName('');
            setSignupEmail('');
            setSignupPassword('');
            setSignupConfirmPassword('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-blue-500 text-white py-6 shadow-lg">
                <h1 className="text-3xl md:text-4xl font-italic text-center">
                    Welcome to Smart Hostel Issue Tracking System
                </h1>
            </header>

            {/* Main Content - Two Equal Parts */}
            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Part - Image */}
                <div className="w-full md:w-1/2 relative">
                    <Image
                        src="/img.jpg"
                        alt="Hostel Issue Tracking"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center">
                        <div className="text-center text-white p-8">
                            <h2 className="text-3xl font-bold mb-4">Report Issues Easily</h2>
                            <p className="text-blue-100 text-lg max-w-md mx-auto">
                                Track and manage hostel maintenance issues efficiently with our smart tracking system
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="text-4xl mb-2">🔧</div>
                                    <p className="text-sm">Quick Repairs</p>
                                </div>
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="text-4xl mb-2">📋</div>
                                    <p className="text-sm">Track Status</p>
                                </div>
                                <div className="bg-white/20 rounded-lg p-4">
                                    <div className="text-4xl mb-2">✅</div>
                                    <p className="text-sm">Get Updates</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Part - Login/Signup Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                        {/* Tab Bar */}
                        <div className="flex mb-6 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => handleTabChange('login')}
                                className={`flex-1 py-3 text-center font-semibold transition-colors ${
                                    activeTab === 'login'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTabChange('signup')}
                                className={`flex-1 py-3 text-center font-semibold transition-colors ${
                                    activeTab === 'signup'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-4 text-green-600 text-sm bg-green-50 p-3 rounded animate-fadeIn">
                                {success}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded animate-fadeIn">
                                {error}
                            </div>
                        )}

                        {/* Forms Container with Fixed Height */}
                        <div className="h-[520px] relative overflow-hidden">
                            {/* Login Form */}
                            <div
                                className={`transition-all duration-500 ease-in-out ${
                                    activeTab === 'login'
                                        ? 'opacity-100 translate-x-0'
                                        : 'opacity-0 -translate-x-full absolute inset-0'
                                }`}
                            >
                                {activeTab === 'login' && (
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="login-userid">
                                                User ID
                                            </label>
                                            <input
                                                id="login-userid"
                                                value={loginUserId ?? ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '') {
                                                        setLoginUserId(null);
                                                    } else if (/^\d{0,8}$/.test(value)) {
                                                        setLoginUserId(Number(value));
                                                    }
                                                }}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                                placeholder="Enter 8-digit user ID"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Must be exactly 8 digits</p>
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="login-password">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="login-password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                                placeholder="Enter your password"
                                                maxLength={12}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                8-12 characters with uppercase, number & special character
                                            </p>
                                        </div>
                                        <div className="mt-50">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                                            >
                                                {loading ? 'Logging in...' : 'Login'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Signup Form */}
                            <div
                                className={`transition-all duration-500 ease-in-out ${
                                    activeTab === 'signup'
                                        ? 'opacity-100 translate-x-0'
                                        : 'opacity-0 translate-x-full absolute inset-0'
                                }`}
                            >
                                {activeTab === 'signup' && (
                                    <form onSubmit={handleSignup}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="signup-name">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="signup-name"
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="signup-email">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="signup-email"
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="signup-password">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="signup-password"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                                placeholder="Create a password"
                                                maxLength={12}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                8-12 characters with uppercase, number & special character
                                            </p>
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="signup-confirm-password">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                id="signup-confirm-password"
                                                value={signupConfirmPassword}
                                                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                                placeholder="Confirm your password"
                                                maxLength={12}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                                        >
                                            {loading ? 'Creating Account...' : 'Sign Up'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;