import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi, type Cabinet } from '../services/mockData';

const Cabinets: React.FC = () => {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const data = await mockApi.getCabinets();
        setCabinets(data);
      } catch (error) {
        console.error('Error fetching cabinets:', error);
        setError('An error occurred while fetching cabinets');
      } finally {
        setLoading(false);
      }
    };

    fetchCabinets();
  }, []);

  const handleDelete = async (cabinetId: string) => {
    if (!window.confirm('Are you sure you want to delete this cabinet?')) {
      return;
    }

    try {
      const success = await mockApi.deleteCabinet(cabinetId);
      if (success) {
        setCabinets(cabinets.filter(cabinet => cabinet._id !== cabinetId));
      } else {
        alert('Failed to delete cabinet');
      }
    } catch (error) {
      console.error('Error deleting cabinet:', error);
      alert('An error occurred while deleting the cabinet');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Cabinets</h1>
          <p className="mt-2 text-gray-600">Manage telecom cabinets and their locations</p>
        </div>
        <Link 
          to="/cabinets/create" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <i className="fa fa-plus mr-2"></i>
          Add New Cabinet
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {cabinets.map((cabinet) => (
                <tr key={cabinet._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cabinet.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cabinet.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cabinet.status === 'active' ? 'bg-green-100 text-green-800' :
                      cabinet.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      cabinet.status === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                      cabinet.status === 'offline' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cabinet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {cabinet.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(cabinet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/cabinets/edit/${cabinet._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        title="Edit cabinet"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(cabinet._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        title="Delete cabinet"
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

export default Cabinets;
