import type { User } from '../types';
import { FaHistory, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { BiLogOutCircle } from 'react-icons/bi';

type HeaderProps = {
    user: User;
    isAdmin: boolean;
    currentPage: string;
    setCurrentPage: (page: 'dashboard' | 'join-requests' | 'previous-lists') => void;
    clearAuth: () => void;
};

export function Header({ user, isAdmin, currentPage, setCurrentPage, clearAuth }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4 gap-4">
                    {/* Navigation Section */}
                    <div className="flex-1 overflow-x-auto">
                        {user && (
                            <nav className="flex gap-2 min-w-max">
                                <button
                                    onClick={() => setCurrentPage('dashboard')}
                                    className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm whitespace-nowrap ${
                                        currentPage === 'dashboard'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <FaShoppingCart className="w-4 h-4" />
                                    <span className="hidden sm:inline">Shopping List</span>
                                    <span className="sm:hidden">List</span>
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={() => setCurrentPage('join-requests')}
                                        className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm whitespace-nowrap ${
                                            currentPage === 'join-requests'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <FaUsers className="w-4 h-4" />
                                        <span className="hidden sm:inline">Join Requests</span>
                                        <span className="sm:hidden">Requests</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => setCurrentPage('previous-lists')}
                                    className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm whitespace-nowrap ${
                                        currentPage === 'previous-lists'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <FaHistory className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous Lists</span>
                                    <span className="sm:hidden">History</span>
                                </button>
                            </nav>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={clearAuth}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="hidden sm:inline text-gray-600">{user.name}</span>
                            <BiLogOutCircle className="w-4 h-4" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}