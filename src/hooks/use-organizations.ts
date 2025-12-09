"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  Organization,
  OrganizationWithDetails,
  OrganizationMemberWithUser,
  OrganizationProject,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  CreateProjectInput,
  InviteMemberInput,
  ApiResponse,
  PaginatedResponse
} from "@/types/organization"

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<OrganizationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (search) params.set("search", search)

      const res = await fetch(`/api/organizations?${params}`)
      const data: PaginatedResponse<OrganizationWithDetails> = await res.json()

      if (data.success && data.data) {
        setOrganizations(data.data)
      } else {
        setError("Failed to fetch organizations")
      }
    } catch (err) {
      setError("Failed to fetch organizations")
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrganization = async (input: CreateOrganizationInput) => {
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
      const data: ApiResponse<OrganizationWithDetails> = await res.json()

      if (data.success && data.data) {
        setOrganizations(prev => [data.data!, ...prev])
        return { success: true, data: data.data }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to create organization" }
    }
  }

  const deleteOrganization = async (id: string) => {
    try {
      const res = await fetch(`/api/organizations/${id}`, {
        method: "DELETE"
      })
      const data: ApiResponse<null> = await res.json()

      if (data.success) {
        setOrganizations(prev => prev.filter(org => org.id !== id))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to delete organization" }
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations,
    createOrganization,
    deleteOrganization
  }
}

export function useOrganization(slugOrId: string) {
  const [organization, setOrganization] = useState<OrganizationWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganization = useCallback(async () => {
    if (!slugOrId) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/organizations/${slugOrId}`)
      const data: ApiResponse<OrganizationWithDetails> = await res.json()

      if (data.success && data.data) {
        setOrganization(data.data)
      } else {
        setError(data.error || "Organization not found")
      }
    } catch (err) {
      setError("Failed to fetch organization")
    } finally {
      setLoading(false)
    }
  }, [slugOrId])

  const updateOrganization = async (input: UpdateOrganizationInput) => {
    try {
      const res = await fetch(`/api/organizations/${slugOrId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
      const data: ApiResponse<OrganizationWithDetails> = await res.json()

      if (data.success && data.data) {
        setOrganization((prev: OrganizationWithDetails | null) => prev ? { ...prev, ...data.data } : data.data!)
        return { success: true, data: data.data }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to update organization" }
    }
  }

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  return {
    organization,
    loading,
    error,
    refetch: fetchOrganization,
    updateOrganization
  }
}

export function useOrganizationMembers(orgSlugOrId: string) {
  const [members, setMembers] = useState<OrganizationMemberWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async (search?: string) => {
    if (!orgSlugOrId) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (search) params.set("search", search)

      const res = await fetch(`/api/organizations/${orgSlugOrId}/members?${params}`)
      const data: ApiResponse<OrganizationMemberWithUser[]> = await res.json()

      if (data.success && data.data) {
        setMembers(data.data)
      } else {
        setError(data.error || "Failed to fetch members")
      }
    } catch (err) {
      setError("Failed to fetch members")
    } finally {
      setLoading(false)
    }
  }, [orgSlugOrId])

  const inviteMember = async (input: InviteMemberInput) => {
    try {
      const res = await fetch(`/api/organizations/${orgSlugOrId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
      const data: ApiResponse<OrganizationMemberWithUser> = await res.json()

      if (data.success && data.data) {
        setMembers(prev => [...prev, data.data!])
        return { success: true, data: data.data }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to invite member" }
    }
  }

  const removeMember = async (userId: string) => {
    try {
      const res = await fetch(`/api/organizations/${orgSlugOrId}/members/${userId}`, {
        method: "DELETE"
      })
      const data: ApiResponse<null> = await res.json()

      if (data.success) {
        setMembers(prev => prev.filter(m => m.userId !== userId))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to remove member" }
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    inviteMember,
    removeMember
  }
}

export function useOrganizationProjects(orgSlugOrId: string) {
  const [projects, setProjects] = useState<OrganizationProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (search?: string) => {
    if (!orgSlugOrId) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (search) params.set("search", search)

      const res = await fetch(`/api/organizations/${orgSlugOrId}/projects?${params}`)
      const data: ApiResponse<OrganizationProject[]> = await res.json()

      if (data.success && data.data) {
        setProjects(data.data)
      } else {
        setError(data.error || "Failed to fetch projects")
      }
    } catch (err) {
      setError("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }, [orgSlugOrId])

  const createProject = async (input: CreateProjectInput) => {
    try {
      const res = await fetch(`/api/organizations/${orgSlugOrId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
      const data: ApiResponse<OrganizationProject> = await res.json()

      if (data.success && data.data) {
        setProjects(prev => [data.data!, ...prev])
        return { success: true, data: data.data }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to create project" }
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      })
      const data: ApiResponse<null> = await res.json()

      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Failed to delete project" }
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    deleteProject
  }
}

export function useRoles(projectId?: string) {
  const [roles, setRoles] = useState<Array<{
    id: string
    name: string
    slug: string
    color: string | null
    description: string | null
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const params = new URLSearchParams()
        if (projectId) params.set("projectId", projectId)

        const res = await fetch(`/api/roles?${params}`)
        const data = await res.json()

        if (data.success) {
          setRoles(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [projectId])

  return { roles, loading }
}
