// Mock data service for frontend development
export interface User {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

export interface Cabinet {
  _id: string;
  name: string;
  location: string;
  status: string;
  description: string;
  assignedTo?: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  cabinet: string;
  createdAt: string;
  dueDate?: string;
  imageUrl?: string;
}

export interface Reinstatement {
  _id: string;
  streetLocation: string;
  length: number;
  width: number;
  status: string;
  assignedTo: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalUsers: number;
  totalTasks: number;
  totalCabinets: number;
}

// Mock data
const mockUsers: User[] = [
  {
    _id: '1',
    username: 'admin',
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@telecms.com',
    role: 'Administrator',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    username: 'john.doe',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@telecms.com',
    role: 'Technician',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    username: 'jane.smith',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane.smith@telecms.com',
    role: 'Supervisor',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

const mockRoles: Role[] = [
  {
    _id: '1',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Supervisor',
    description: 'Supervisory access',
    permissions: ['read', 'write'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Technician',
    description: 'Basic technician access',
    permissions: ['read'],
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockCabinets: Cabinet[] = [
  {
    _id: '1',
    name: 'CAB-001',
    location: 'Main Street, Downtown',
    status: 'active',
    description: 'Main distribution cabinet for downtown area',
    assignedTo: 'john.doe',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'CAB-002',
    location: 'Oak Avenue, Suburb',
    status: 'maintenance',
    description: 'Secondary cabinet serving suburban area',
    assignedTo: 'jane.smith',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    name: 'CAB-003',
    location: 'Pine Street, Industrial',
    status: 'active',
    description: 'Industrial zone cabinet with high capacity',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

const mockTasks: Task[] = [
  {
    _id: '1',
    title: 'Cabinet Maintenance',
    description: 'Perform routine maintenance on CAB-001',
    status: 'pending',
    priority: 'high',
    assignedTo: 'john.doe',
    dueDate: '2024-12-31T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    title: 'Installation Check',
    description: 'Verify installation of new equipment',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'jane.smith',
    dueDate: '2024-12-25T00:00:00Z',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    title: 'System Update',
    description: 'Update cabinet software',
    status: 'completed',
    priority: 'low',
    assignedTo: 'john.doe',
    dueDate: '2024-12-20T00:00:00Z',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

const mockJobs: Job[] = [
  {
    _id: '1',
    title: 'Network Installation',
    description: 'Install new network equipment in downtown area',
    status: 'in-progress',
    assignedTo: 'john.doe',
    cabinet: 'CAB-001',
    dueDate: '2024-12-31T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    title: 'Fiber Optic Setup',
    description: 'Set up fiber optic connections',
    status: 'pending',
    assignedTo: 'jane.smith',
    cabinet: 'CAB-002',
    dueDate: '2024-12-28T00:00:00Z',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    title: 'Equipment Replacement',
    description: 'Replace outdated equipment',
    status: 'completed',
    assignedTo: 'john.doe',
    cabinet: 'CAB-003',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

const mockReinstatements: Reinstatement[] = [
  {
    _id: '1',
    streetLocation: 'Main Street, Block 1',
    length: 50,
    width: 2,
    status: 'completed',
    assignedTo: 'john.doe',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    streetLocation: 'Oak Avenue, Block 2',
    length: 75,
    width: 2.5,
    status: 'in-progress',
    assignedTo: 'jane.smith',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

// Mock API functions
export const mockApi = {
  // Authentication
  login: async (username: string, _password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication - accept any username/password
    const user = mockUsers.find(u => u.username === username) || mockUsers[0];
    
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: user
    };
  },

  verifyToken: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token.startsWith('mock-jwt-token-')) {
      return {
        success: true,
        user: mockUsers[0] // Return admin user
      };
    }
    
    throw new Error('Invalid token');
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalJobs: mockJobs.length,
      totalUsers: mockUsers.length,
      totalTasks: mockTasks.length,
      totalCabinets: mockCabinets.length
    };
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockUsers];
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      _id: Date.now().toString(),
      username: userData.username || '',
      firstname: userData.firstname || '',
      lastname: userData.lastname || '',
      email: userData.email || '',
      role: userData.role || 'Technician',
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      return mockUsers[userIndex];
    }
    throw new Error('User not found');
  },

  deleteUser: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      return true;
    }
    return false;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockRoles];
  },

  createRole: async (roleData: Partial<Role>): Promise<Role> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRole: Role = {
      _id: Date.now().toString(),
      name: roleData.name || '',
      description: roleData.description || '',
      permissions: roleData.permissions || [],
      createdAt: new Date().toISOString()
    };
    mockRoles.push(newRole);
    return newRole;
  },

  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const roleIndex = mockRoles.findIndex(r => r._id === id);
    if (roleIndex !== -1) {
      mockRoles[roleIndex] = { ...mockRoles[roleIndex], ...roleData };
      return mockRoles[roleIndex];
    }
    throw new Error('Role not found');
  },

  deleteRole: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const roleIndex = mockRoles.findIndex(r => r._id === id);
    if (roleIndex !== -1) {
      mockRoles.splice(roleIndex, 1);
      return true;
    }
    return false;
  },

  // Cabinets
  getCabinets: async (): Promise<Cabinet[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCabinets];
  },

  createCabinet: async (cabinetData: Partial<Cabinet>): Promise<Cabinet> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCabinet: Cabinet = {
      _id: Date.now().toString(),
      name: cabinetData.name || '',
      location: cabinetData.location || '',
      status: cabinetData.status || 'active',
      description: cabinetData.description || '',
      assignedTo: cabinetData.assignedTo,
      createdAt: new Date().toISOString()
    };
    mockCabinets.push(newCabinet);
    return newCabinet;
  },

  updateCabinet: async (id: string, cabinetData: Partial<Cabinet>): Promise<Cabinet> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cabinetIndex = mockCabinets.findIndex(c => c._id === id);
    if (cabinetIndex !== -1) {
      mockCabinets[cabinetIndex] = { ...mockCabinets[cabinetIndex], ...cabinetData };
      return mockCabinets[cabinetIndex];
    }
    throw new Error('Cabinet not found');
  },

  deleteCabinet: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cabinetIndex = mockCabinets.findIndex(c => c._id === id);
    if (cabinetIndex !== -1) {
      mockCabinets.splice(cabinetIndex, 1);
      return true;
    }
    return false;
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockTasks];
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTask: Task = {
      _id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      assignedTo: taskData.assignedTo || '',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return newTask;
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const taskIndex = mockTasks.findIndex(t => t._id === id);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...taskData };
      return mockTasks[taskIndex];
    }
    throw new Error('Task not found');
  },

  deleteTask: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const taskIndex = mockTasks.findIndex(t => t._id === id);
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
      return true;
    }
    return false;
  },

  // Jobs
  getJobs: async (): Promise<Job[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockJobs];
  },

  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newJob: Job = {
      _id: Date.now().toString(),
      title: jobData.title || '',
      description: jobData.description || '',
      status: jobData.status || 'pending',
      assignedTo: jobData.assignedTo || '',
      cabinet: jobData.cabinet || '',
      dueDate: jobData.dueDate,
      imageUrl: jobData.imageUrl,
      createdAt: new Date().toISOString()
    };
    mockJobs.push(newJob);
    return newJob;
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const jobIndex = mockJobs.findIndex(j => j._id === id);
    if (jobIndex !== -1) {
      mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...jobData };
      return mockJobs[jobIndex];
    }
    throw new Error('Job not found');
  },

  deleteJob: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const jobIndex = mockJobs.findIndex(j => j._id === id);
    if (jobIndex !== -1) {
      mockJobs.splice(jobIndex, 1);
      return true;
    }
    return false;
  },

  // Reinstatements
  getReinstatements: async (): Promise<Reinstatement[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockReinstatements];
  },

  createReinstatement: async (reinstatementData: Partial<Reinstatement>): Promise<Reinstatement> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newReinstatement: Reinstatement = {
      _id: Date.now().toString(),
      streetLocation: reinstatementData.streetLocation || '',
      length: reinstatementData.length || 0,
      width: reinstatementData.width || 0,
      status: reinstatementData.status || 'pending',
      assignedTo: reinstatementData.assignedTo || '',
      imageUrl: reinstatementData.imageUrl,
      createdAt: new Date().toISOString()
    };
    mockReinstatements.push(newReinstatement);
    return newReinstatement;
  },

  updateReinstatement: async (id: string, reinstatementData: Partial<Reinstatement>): Promise<Reinstatement> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const reinstatementIndex = mockReinstatements.findIndex(r => r._id === id);
    if (reinstatementIndex !== -1) {
      mockReinstatements[reinstatementIndex] = { ...mockReinstatements[reinstatementIndex], ...reinstatementData };
      return mockReinstatements[reinstatementIndex];
    }
    throw new Error('Reinstatement not found');
  },

  deleteReinstatement: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const reinstatementIndex = mockReinstatements.findIndex(r => r._id === id);
    if (reinstatementIndex !== -1) {
      mockReinstatements.splice(reinstatementIndex, 1);
      return true;
    }
    return false;
  }
};
