import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const WorkerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/complaints`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setTasks(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);
    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_URL}/api/complaints/status/${id}`, { status }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            const res = await axios.get(`${API_URL}/api/complaints`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setTasks(res.data);
        } catch (err) {
            alert('Error updating status');
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
                <div className="grid grid-cols-1 gap-6">
                    {tasks.map((task) => (
                        <div key={task._id} className="card flex flex-col md:flex-row gap-6">
                            <img
                                src={`${API_URL}${task.photoURL}`}
                                alt={task.title}
                                className="w-full md:w-48 h-48 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${task.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{task.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                                    <p>Category: {task.category}</p>
                                    <p>Date: {new Date(task.createdAt).toLocaleDateString()}</p>
                                    <p>Location: {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}</p>
                                </div>
                                <div className="flex gap-4">
                                    {task.status !== 'resolved' && (
                                        <>
                                            {task.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                                                    className="btn-secondary"
                                                >
                                                    Pick Up Task
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                                                    className="btn-secondary"
                                                >
                                                    Mark In Progress
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, 'resolved')}
                                                className="btn-primary"
                                            >
                                                Mark Resolved
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && <p>No tasks assigned.</p>}
                </div>
            </div>
        </div>
    );
};
export default WorkerDashboard;
