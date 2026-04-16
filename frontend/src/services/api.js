import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

export const tasksApi = {
  getByProject: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const commentsApi = {
  getByTask: (taskId) => api.get(`/tasks/${taskId}/comments`),
  create: (taskId, data) => api.post(`/tasks/${taskId}/comments`, data),
  delete: (id) => api.delete(`/comments/${id}`),
}

export const dashboardApi = {
  get: () => api.get('/dashboard'),
}

export default api
