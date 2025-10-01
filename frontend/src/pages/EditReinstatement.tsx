import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockApi, type Reinstatement } from '../services/mockData';

const EditReinstatement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reinstatement, setReinstatement] = useState<Reinstatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    streetLocation: '',
    length: 0,
    width: 0,
    status: 'pending',
    assignedTo: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchReinstatement = async () => {
      try {
        const reinstatements = await mockApi.getReinstatements();
        const foundReinstatement = reinstatements.find(r => r._id === id);
        if (foundReinstatement) {
          setReinstatement(foundReinstatement);
          setFormData({
            streetLocation: foundReinstatement.streetLocation,
            length: foundReinstatement.length,
            width: foundReinstatement.width,
            status: foundReinstatement.status,
            assignedTo: foundReinstatement.assignedTo,
            imageUrl: foundReinstatement.imageUrl || ''
          });
        } else {
          setError('Reinstatement not found');
        }
      } catch (error) {
        console.error('Error fetching reinstatement:', error);
        setError('Failed to load reinstatement data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReinstatement();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'length' || name === 'width' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!id) {
        throw new Error('Reinstatement ID is required');
      }

      const updateData = {
        ...formData,
        imageUrl: formData.imageUrl || undefined
      };

      await mockApi.updateReinstatement(id, updateData);
      navigate('/reinstatements');
    } catch (error) {
      console.error('Error updating reinstatement:', error);
      setError('Failed to update reinstatement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !reinstatement) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
        <Link 
          to="/reinstatements" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          Back to Reinstatements
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Reinstatement</h1>
          <p className="mt-2 text-gray-600">Update reinstatement project information</p>
        </div>
        <Link 
          to="/reinstatements" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          Back to Reinstatements
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="streetLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Street Location *
              </label>
              <input
                type="text"
                id="streetLocation"
                name="streetLocation"
                value={formData.streetLocation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                Length (meters) *
              </label>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Width (meters) *
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To *
              </label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/reinstatements"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa fa-save mr-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReinstatement;
