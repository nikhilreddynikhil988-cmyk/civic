import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
const Home = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Report Civic Issues</span>
                        <span className="block text-blue-600">Make Your City Better</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Instantly report potholes, garbage, water leakage, and more. Track the status and help us build a cleaner, safer city.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        {user ? (
                            <div className="rounded-md shadow">
                                <Link
                                    to={
                                        user.role === 'admin'
                                            ? '/admin'
                                            : user.role === 'worker'
                                                ? '/worker'
                                                : '/file-complaint'
                                    }
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent
                                    text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                                    md:py-4 md:text-lg md:px-10"
                                >
                                    {user.role === 'admin'
                                        ? 'Go to Dashboard'
                                        : user.role === 'worker'
                                            ? 'View Tasks'
                                            : 'Report an Issue'}
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-md shadow">
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent
                                    text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                                    md:py-4 md:text-lg md:px-10"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                        {!user && (
                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                <Link
                                    to="/register"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent
                                    text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50
                                    md:py-4 md:text-lg md:px-10"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="card text-center">
                        <div className="text-4xl mb-4">📸</div>
                        <h3 className="text-xl font-bold mb-2">Snap a Photo</h3>
                        <p className="text-gray-600">Take a picture of the issue directly from your phone.</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">📍</div>
                        <h3 className="text-xl font-bold mb-2">Auto-Location</h3>
                        <p className="text-gray-600">We automatically capture the exact GPS location.</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-xl font-bold mb-2">Track Status</h3>
                        <p className="text-gray-600">Get real-time updates when the issue is resolved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;