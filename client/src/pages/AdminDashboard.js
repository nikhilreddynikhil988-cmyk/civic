import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [workerId, setWorkerId] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [complaintsRes, workersRes] = await Promise.all([
                    axios.get(`${API_URL}/api/complaints`, {
                        headers: { 'x-auth-token': token }
                    }),
                    Promise.resolve({ data: [] })
                ]);
                setComplaints(complaintsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handleAssign = async (complaintId) => {
        console.log('Assigning', complaintId, 'to', workerId);
        try {
            await axios.put(
                `${API_URL}/api/complaints/assign/${complaintId}`,
                { workerId },
                {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                }
            );
            const res = await axios.get(`${API_URL}/api/complaints`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setComplaints(res.data);
            setSelectedComplaint(null);
        } catch (err) {
            alert('Error assigning worker');
        }
    };
    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(
                `${API_URL}/api/complaints/status/${id}`,
                { status },
                {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                }
            );
            const res = await axios.get(`${API_URL}/api/complaints`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setComplaints(res.data);
        } catch (err) {
            alert('Error updating status');
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card bg-blue-50 border-blue-200">
                        <h3 className="text-lg font-bold text-blue-800">Total</h3>
                        <p className="text-3xl font-bold text-blue-600">{complaints.length}</p>
                    </div>
                    <div className="card bg-yellow-50 border-yellow-200">
                        <h3 className="text-lg font-bold text-yellow-800">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">
                            {complaints.filter(c => c.status === 'pending').length}
                        </p>
                    </div>
                    <div className="card bg-purple-50 border-purple-200">
                        <h3 className="text-lg font-bold text-purple-800">In Progress</h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {complaints.filter(c => c.status === 'in-progress').length}
                        </p>
                    </div>
                    <div className="card bg-green-50 border-green-200">
                        <h3 className="text-lg font-bold text-green-800">Resolved</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {complaints.filter(c => c.status === 'resolved').length}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {complaints.map(complaint => (
                                <tr key={complaint._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={`${API_URL}${complaint.photoURL}`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {complaint.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${complaint.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : complaint.status === 'resolved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {complaint.assignedTo ? complaint.assignedTo.name : 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <select
                                            className="border rounded p-1 mr-2"
                                            onChange={e => handleStatusUpdate(complaint._id, e.target.value)}
                                            value={complaint.status}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="assigned">Assigned</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};
export default AdminDashboard;