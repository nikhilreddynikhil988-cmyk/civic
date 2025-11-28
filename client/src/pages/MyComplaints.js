import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/complaints/my`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'assigned': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-purple-100 text-purple-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">My Complaints</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : complaints.length === 0 ? (
                    <p>No complaints found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {complaints.map((complaint) => (
                            <div key={complaint._id} className="card hover:shadow-xl transition-shadow duration-300">
                                <img
                                    src={`${API_URL}${complaint.photoURL}`}
                                    alt={complaint.title}
                                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                                />
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{complaint.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                        {complaint.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2 text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-700 mb-4 line-clamp-2">{complaint.description}</p>
                                <div className="text-sm text-gray-500">
                                    <p>Category: {complaint.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MyComplaints;
