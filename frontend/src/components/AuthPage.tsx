import { useState, type FormEvent } from 'react';
import { FaShoppingCart } from 'react-icons/fa'

type Props = {
    handleLogin: (e: FormEvent<HTMLFormElement>) => void,
    handleSignup: (e: FormEvent<HTMLFormElement>) => void,
}

const AuthPage = ({ handleLogin, handleSignup, }: Props) => {

    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                        <FaShoppingCart className="w-8 h-8" />
                    </div>
                    <h1 className="text-blue-600 mb-2">FamilyCart</h1>
                    <p className="text-gray-600">Manage your family shopping together</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="mb-1">Welcome</h2>
                        <p className="text-gray-600">Login or create an account to get started</p>
                    </div>

                    <div className="p-6">
                        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-2 px-4 rounded-md transition-all ${activeTab === 'login'
                                    ? 'bg-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setActiveTab('signup')}
                                className={`flex-1 py-2 px-4 rounded-md transition-all ${activeTab === 'signup'
                                    ? 'bg-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {activeTab === 'login' && (
                            <form
                                onSubmit={handleLogin}
                                className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="login-email" className="block">
                                        Email
                                    </label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="login-password" className="block">
                                        Password
                                    </label>
                                    <input
                                        id="login-password"
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </button>
                            </form>
                        )}

                        {activeTab === 'signup' && (
                            <form
                                onSubmit={handleSignup}
                                className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="signup-name" className="block">
                                        Full Name
                                    </label>
                                    <input
                                        id="signup-name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="signup-email" className="block">
                                        Email
                                    </label>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="signup-password" className="block">
                                        Password
                                    </label>
                                    <input
                                        id="signup-password"
                                        type="password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Create Account
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage