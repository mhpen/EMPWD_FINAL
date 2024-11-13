import React, { useState, useEffect } from 'react';
import SidebarAdmin from './sideNavAdmin';
import { Plus, Loader, Trash2, Edit, X, Upload } from 'lucide-react';
import axios from 'axios';

const AdminResources = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/resources/videos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResources(response.data.videos || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!formData.file || !formData.title) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('video', formData.file);
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/resources/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            setShowUploadModal(false);
            setFormData({ title: '', description: '', file: null });
            fetchResources();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/resources/${videoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchResources();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingResource) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/resources/${editingResource.id}`, {
                title: editingResource.title,
                description: editingResource.description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingResource(null);
            fetchResources();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <SidebarAdmin />
            
            <div className="flex-1 overflow-auto ml-64 p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Resources Management</h1>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={20} />
                        Upload New Video
                    </button>
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-100">
                                    {resource.thumbnail && (
                                        <img
                                            src={resource.thumbnail}
                                            alt={resource.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {editingResource?.id === resource.id ? (
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <input
                                                type="text"
                                                value={editingResource.title}
                                                onChange={(e) => setEditingResource({
                                                    ...editingResource,
                                                    title: e.target.value
                                                })}
                                                className="w-full p-2 border rounded"
                                                placeholder="Video Title"
                                            />
                                            <textarea
                                                value={editingResource.description}
                                                onChange={(e) => setEditingResource({
                                                    ...editingResource,
                                                    description: e.target.value
                                                })}
                                                className="w-full p-2 border rounded"
                                                placeholder="Description"
                                                rows="3"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-black text-white rounded-lg"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingResource(null)}
                                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingResource(resource)}
                                                    className="p-2 text-gray-600 hover:text-black"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-2 text-gray-600 hover:text-red-600"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Upload New Video</h2>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video File
                                    </label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                {uploading && (
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-black h-2.5 rounded-full"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {uploadProgress}% uploaded
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={uploading || !formData.file || !formData.title}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                                        ${uploading || !formData.file || !formData.title
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {uploading ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload size={20} />
                                    )}
                                    {uploading ? 'Uploading...' : 'Upload Video'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminResources;
