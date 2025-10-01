import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi, type Reinstatement } from '../services/mockData';

const Reinstatements: React.FC = () => {
  const [reinstatements, setReinstatements] = useState<Reinstatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReinstatements = async () => {
      try {
        const data = await mockApi.getReinstatements();
        setReinstatements(data);
      } catch (error) {
        console.error('Error fetching reinstatements:', error);
        setError('An error occurred while fetching reinstatements');
      } finally {
        setLoading(false);
      }
    };

    fetchReinstatements();
  }, []);

  const handleDelete = async (reinstatementId: string) => {
    if (!window.confirm('Are you sure you want to delete this reinstatement?')) {
      return;
    }

    try {
      const success = await mockApi.deleteReinstatement(reinstatementId);
      if (success) {
        setReinstatements(reinstatements.filter(reinstatement => reinstatement._id !== reinstatementId));
      } else {
        alert('Failed to delete reinstatement');
      }
    } catch (error) {
      console.error('Error deleting reinstatement:', error);
      alert('An error occurred while deleting the reinstatement');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reinstatements</h1>
          <p className="mt-2 text-gray-600">Manage street reinstatement projects</p>
        </div>
        <Link 
          to="/reinstatements/create" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <i className="fa fa-plus mr-2"></i>
          Add New Reinstatement
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Street Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reinstatements.map((reinstatement) => (
                <tr key={reinstatement._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reinstatement.streetLocation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reinstatement.length}m × {reinstatement.width}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(reinstatement.status)}>
                      {reinstatement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reinstatement.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reinstatement.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/reinstatements/edit/${reinstatement._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        title="Edit reinstatement"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(reinstatement._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        title="Delete reinstatement"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
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

export default Reinstatements;
