import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockData';

interface ReportData {
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  totalUsers: number;
  totalCabinets: number;
  activeCabinets: number;
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalUsers: 0,
    totalCabinets: 0,
    activeCabinets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Get data from mock API and calculate report data
        const [jobs, users, cabinets] = await Promise.all([
          mockApi.getJobs(),
          mockApi.getUsers(),
          mockApi.getCabinets()
        ]);

        const completedJobs = jobs.filter(job => job.status === 'completed').length;
        const pendingJobs = jobs.filter(job => job.status === 'pending').length;
        const activeCabinets = cabinets.filter(cabinet => cabinet.status === 'active').length;

        setReportData({
          totalJobs: jobs.length,
          completedJobs,
          pendingJobs,
          totalUsers: users.length,
          totalCabinets: cabinets.length,
          activeCabinets
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('An error occurred while fetching report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExportPDF = async () => {
    // Mock export functionality
    alert('PDF export functionality would be implemented here');
  };

  const handleExportExcel = async () => {
    // Mock export functionality
    alert('Excel export functionality would be implemented here');
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
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">System analytics and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <i className="fa fa-file-pdf mr-2"></i>
            Export PDF
          </button>
          <button 
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <i className="fa fa-file-excel mr-2"></i>
            Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {reportData.totalJobs}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-briefcase text-3xl text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                  Completed Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {reportData.completedJobs}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-check-circle text-3xl text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">
                  Pending Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {reportData.pendingJobs}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-clock text-3xl text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-cyan-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-cyan-600 uppercase tracking-wide">
                  Active Cabinets
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {reportData.activeCabinets}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-server text-3xl text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Job Status Distribution</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would be implemented here</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users:</span>
                <span className="text-sm font-medium text-gray-900">{reportData.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cabinets:</span>
                <span className="text-sm font-medium text-gray-900">{reportData.totalCabinets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate:</span>
                <span className="text-sm font-medium text-gray-900">
                  {reportData.totalJobs > 0 
                    ? Math.round((reportData.completedJobs / reportData.totalJobs) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
