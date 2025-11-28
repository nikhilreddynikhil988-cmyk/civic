import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold">
                            CivicPortal
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            {user && user.role === 'user' && (
                                <>
                                    <Link
                                        to="/file-complaint"
                                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Report Issue
                                    </Link>
                                    <Link
                                        to="/my-complaints"
                                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        My Complaints
                                    </Link>
                                </>
                            )}
                            {user && user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            )}
                            {user && user.role === 'worker' && (
                                <Link
                                    to="/worker"
                                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    My Tasks
                                </Link>
                            )}
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
