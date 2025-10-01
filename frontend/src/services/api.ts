// Native fetch API service
const API_BASE_URL = '/api'; // Vite proxy will handle this

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Types
export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string | { id: number; name: string; description: string; permissions: string[]; createdAt: string; updatedAt: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cabinet {
  id: string;
  name: string;
  location: string;
  status: string;
  description: string;
  assignedTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  cabinet: string;
  dueDate?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reinstatement {
  id: string;
  streetLocation: string;
  length: number;
  width: number;
  status: string;
  assignedTo: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalUsers: number;
  totalTasks: number;
  totalCabinets: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API Service
export const apiService = {
  // Authentication
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiRequest<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response.data;
  },

  verifyToken: async (token: string): Promise<{ success: boolean; user: User }> => {
    const response = await apiRequest<ApiResponse<{ user: User }>>('/auth/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, user: response.data.user };
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    // For now, return mock stats since dashboard endpoint is not implemented
    // TODO: Implement dashboard stats endpoint in backend
    return {
      totalJobs: 0,
      totalUsers: 0,
      totalTasks: 0,
      totalCabinets: 0
    };
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await apiRequest<ApiResponse<{ users: User[] }>>('/users');
    return response.data.users;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiRequest<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await apiRequest<ApiResponse<User>>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiRequest<ApiResponse<User>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const response = await apiRequest<ApiResponse<boolean>>(`/users/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    const response = await apiRequest<ApiResponse<Role[]>>('/roles');
    return response.data;
  },

  getRole: async (id: string): Promise<Role> => {
    const response = await apiRequest<ApiResponse<Role>>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (roleData: Partial<Role>): Promise<Role> => {
    const response = await apiRequest<ApiResponse<Role>>('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    return response.data;
  },

  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    const response = await apiRequest<ApiResponse<Role>>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
    return response.data;
  },

  deleteRole: async (id: string): Promise<boolean> => {
    const response = await apiRequest<ApiResponse<boolean>>(`/roles/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Cabinets
  getCabinets: async (): Promise<Cabinet[]> => {
    const response = await apiRequest<ApiResponse<Cabinet[]>>('/cabinets');
    return response.data;
  },

  getCabinet: async (id: string): Promise<Cabinet> => {
    const response = await apiRequest<ApiResponse<Cabinet>>(`/cabinets/${id}`);
    return response.data;
  },

  createCabinet: async (cabinetData: Partial<Cabinet>): Promise<Cabinet> => {
    const response = await apiRequest<ApiResponse<Cabinet>>('/cabinets', {
      method: 'POST',
      body: JSON.stringify(cabinetData),
    });
    return response.data;
  },

  updateCabinet: async (id: string, cabinetData: Partial<Cabinet>): Promise<Cabinet> => {
    const response = await apiRequest<ApiResponse<Cabinet>>(`/cabinets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cabinetData),
    });
    return response.data;
  },

  deleteCabinet: async (id: string): Promise<boolean> => {
    const response = await apiRequest<ApiResponse<boolean>>(`/cabinets/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await apiRequest<ApiResponse<Task[]>>('/tasks');
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await apiRequest<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    const response = await apiRequest<ApiResponse<Task>>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await apiRequest<ApiResponse<Task>>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return response.data;
  },

  deleteTask: async (id: string): Promise<boolean> => {
    const response = await apiRequest<ApiResponse<boolean>>(`/tasks/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Jobs
  getJobs: async (): Promise<Job[]> => {
    const response = await apiRequest<ApiResponse<Job[]>>('/jobs');
    return response.data;
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await apiRequest<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    const response = await apiRequest<ApiResponse<Job>>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    const response = await apiRequest<ApiResponse<Job>>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    return response.data;
  },

  deleteJob: async (id: string): Promise<boolean> => {
    const response = await apiRequest<ApiResponse<boolean>>(`/jobs/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Reinstatements
  getReinstatements: async (): Promise<Reinstatement[]> => {
    const response = await apiRequest<ApiResponse<Reinstatement[]>>('/reinstatements');
    return response.data;
  },

  getReinstatement: async (id: string): Promise<Reinstatement> => {
    const response = await apiRequest<ApiResponse<Reinstatement>>(`/reinstatements/${id}`);
    return response.data;
  },

  createReinstatement: async (reinstatementData: Partial<Reinstatement>): Promise<Reinstatement> => {
    const response = await apiRequest<ApiResponse<Reinstatement>>('/reinstatements', {
      method: 'POST',
      body: JSON.stringify(reinstatementData),
    });
    return response.data;
  },

  updateReinstatement: async (id: string, reinstatementData: Partial<Reinstatement>): Promise<Reinstatement> => {
    const response = await apiRequest<ApiResponse<Reinstatement>>(`/reinstatements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reinstatementData),
    });
    return response.data;
  },

  deleteReinstatement: async (id: string): Promise<boolean> => {
    const response = await apiRequest<ApiResponse<boolean>>(`/reinstatements/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // File upload
  uploadFile: async (file: File, type: 'job' | 'reinstatement'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = getAuthToken();
    const url = `${API_BASE_URL}/images/upload`;
    
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    return handleResponse<{ url: string }>(response);
  },
};

export default apiService;