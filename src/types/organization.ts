export interface Organization {
  id: string;
  name: string;
  slug: string;
  shortId?: string;
  description?: string | null;
  logo?: string | null;
  ownerId: string;
  owner?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  members?: OrganizationMember[];
  _count?: {
    members: number;
    projects: number;
  };
  userRole?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  status: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationDetail extends Organization {
  members: OrganizationMember[];
}

export interface CreateOrganizationInput {
  name: string;
  description?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  description?: string;
  logo?: string;
}

export interface OrganizationProject {
  id: string;
  name: string;
  slug: string;
  shortId?: string;
  description?: string | null;
  status: string;
  customDomain?: string | null;
  organizationId: string;
  ownerId: string;
  owner?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  members?: ProjectMember[];
  _count?: {
    members: number;
    contentTypes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  roleId: string;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: string;
  customDomain?: string | null;
}

export interface AddProjectMemberInput {
  userId?: string;
  email?: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Extended types with user details
export interface OrganizationMemberWithUser extends OrganizationMember {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface OrganizationWithDetails extends Organization {
  owner: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  members: OrganizationMemberWithUser[];
  _count: {
    members: number;
    projects: number;
  };
}

// Input types
export interface InviteMemberInput {
  email: string;
  role?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}
