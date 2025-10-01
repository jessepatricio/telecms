import React, { useState, useEffect } from 'react';
import { apiService, type DashboardStats } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalUsers: 0,
    totalTasks: 0,
    totalCabinets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the Telecom Cabinet Tracking System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalJobs}
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
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-users text-3xl text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-cyan-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-cyan-600 uppercase tracking-wide">
                  Total Tasks
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalTasks}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-tasks text-3xl text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">
                  Total Cabinets
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalCabinets}
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
              <h3 className="text-lg font-medium text-gray-900">Cabinet Completion Status</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <p className="text-gray-500">Recent activity will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
