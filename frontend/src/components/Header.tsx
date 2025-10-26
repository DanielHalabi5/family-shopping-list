
import type { User } from '../types';
import { FaHistory, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { BiLogOutCircle } from 'react-icons/bi';


type HeaderProps = {
    user: User;
    isAdmin: boolean;
    currentPage: string;
    setCurrentPage: (page: 'home' | 'dashboard' | 'join-requests' | 'previous-lists') => void;
    clearAuth: () => void;
};

export function Header({ user, isAdmin, currentPage, setCurrentPage, clearAuth }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center flex-wrap h-16 sm:text-xs">
                    <div className="flex items-center gap-8">
                        {user && (
                            <nav className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage('dashboard')}
                                    className={`px-4 py-2 rounded-md transition-colors ${currentPage === 'dashboard'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaShoppingCart className="w-4 h-4 inline mr-2" />
                                    Shopping List
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={() => setCurrentPage('join-requests')}
                                        className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${currentPage === 'join-requests'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <FaUsers className="w-4 h-4" />
                                        Join Requests
                                    </button>
                                )}

                                <button
                                    onClick={() => setCurrentPage('previous-lists')}
                                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${currentPage === 'previous-lists'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaHistory className="w-4 h-4" />
                                    Previous Lists
                                </button>
                            </nav>
                        )}
                    </div>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={clearAuth}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <div className="text-sm text-gray-600">
                                {user.name}
                            </div>
                            <BiLogOutCircle className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
