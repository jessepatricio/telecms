"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Telecom Cabinet Tracking System (TCTS) API',
            version: '1.0.0',
            description: 'A comprehensive REST API for managing telecom cabinets, tasks, jobs, and reinstatements with user authentication and role-based access control.',
            contact: {
                name: 'TCTS Development Team',
                email: 'dev@tcts.com',
                url: 'https://github.com/your-org/telecms'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:8888',
                description: 'Development server'
            },
            {
                url: 'https://api.tcts.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token obtained from login endpoint'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        username: {
                            type: 'string',
                            example: 'john_doe'
                        },
                        firstname: {
                            type: 'string',
                            example: 'John'
                        },
                        lastname: {
                            type: 'string',
                            example: 'Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com'
                        },
                        roleId: {
                            type: 'integer',
                            example: 1
                        },
                        isActive: {
                            type: 'boolean',
                            example: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z'
                        }
                    }
                },
                UserWithRole: {
                    allOf: [
                        { $ref: '#/components/schemas/User' },
                        {
                            type: 'object',
                            properties: {
                                role: {
                                    $ref: '#/components/schemas/Role'
                                }
                            }
                        }
                    ]
                },
                Role: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'admin'
                        },
                        description: {
                            type: 'string',
                            example: 'Administrator role with full access'
                        },
                        permissions: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            example: ['read', 'write', 'delete', 'admin']
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            example: 'john_doe',
                            description: 'Username or email address'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123',
                            description: 'User password'
                        }
                    }
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['username', 'firstname', 'lastname', 'email', 'password', 'roleId'],
                    properties: {
                        username: {
                            type: 'string',
                            example: 'john_doe',
                            description: 'Unique username'
                        },
                        firstname: {
                            type: 'string',
                            example: 'John',
                            description: 'User first name'
                        },
                        lastname: {
                            type: 'string',
                            example: 'Doe',
                            description: 'User last name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                            description: 'User email address'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123',
                            description: 'User password'
                        },
                        roleId: {
                            type: 'integer',
                            example: 1,
                            description: 'Role ID for the user'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: {
                            $ref: '#/components/schemas/UserWithRole'
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            description: 'JWT access token'
                        },
                        refreshToken: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            description: 'JWT refresh token'
                        }
                    }
                },
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data (varies by endpoint)'
                        },
                        error: {
                            type: 'string',
                            example: 'Error message',
                            description: 'Error message (only present when success is false)'
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: {
                                    type: 'integer',
                                    example: 1
                                },
                                limit: {
                                    type: 'integer',
                                    example: 10
                                },
                                total: {
                                    type: 'integer',
                                    example: 100
                                },
                                totalPages: {
                                    type: 'integer',
                                    example: 10
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'An error occurred'
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error message'
                        }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Validation failed'
                        },
                        error: {
                            type: 'string',
                            example: 'Invalid input data'
                        },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'email'
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Invalid email format'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints'
            },
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Health',
                description: 'System health check endpoints'
            }
        ]
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/middleware/*.ts'
    ]
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
//# sourceMappingURL=swagger.js.map