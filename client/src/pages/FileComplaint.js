import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LocationPicker from '../components/LocationPicker';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FileComplaint = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Pothole');
    const [otherCategory, setOtherCategory] = useState(''); // ⬅️ NEW FIELD
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location) {
            setError('Please select a location on the map.');
            return;
        }

        if (!photo) {
            setError('Please upload a photo.');
            return;
        }

        if (category === 'Other' && !otherCategory.trim()) {
            setError('Please specify the category.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        formData.append('category', category === 'Other' ? otherCategory : category);

        formData.append('photo', photo);
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);

        try {
            await axios.post(`${API_URL}/api/complaints`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token'),
                },
            });

            navigate('/my-complaints');
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Report an Issue</h1>

                <div className="card">
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Title</label>
                            <input
                                type="text"
                                className="input-field bg-white"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Brief title of the issue"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <select
                                className="input-field bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Pothole">Pothole</option>
                                <option value="Garbage">Garbage</option>
                                <option value="Water Leakage">Water Leakage</option>
                                <option value="Streetlight">Streetlight</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {category === 'Other' && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Specify Category
                                </label>
                                <input
                                    type="text"
                                    className="input-field bg-white"
                                    value={otherCategory}
                                    onChange={(e) => setOtherCategory(e.target.value)}
                                    placeholder="Enter custom category"
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <textarea
                                className="input-field bg-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="4"
                                placeholder="Describe the issue in detail..."
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">
                                Location (Auto-detected, click to adjust)
                            </label>
                            <LocationPicker onLocationSelect={setLocation} />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex justify-center"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Complaint'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FileComplaint;
