import { apiFetch } from '@/utils/api';

export const toolService = {
    async getTools(params = {}) {
        const searchParams = new URLSearchParams(params);
        const response = await apiFetch(`/tools?${searchParams}`);
        return response.ok ? await response.json() : [];
    },

    async getCategories() {
        const response = await apiFetch('/categories');
        return response.ok ? await response.json() : [];
    },

    async getRoles() {
        const response = await apiFetch('/roles');
        return response.ok ? await response.json() : [];
    },

    async createTool(data) {
        const response = await apiFetch('/tools', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.ok ? await response.json() : null;
    },

    async updateTool(id, data) {
        const response = await apiFetch(`/tools/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.ok ? await response.json() : null;
    },

    async deleteTool(id) {
        const response = await apiFetch(`/tools/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    async toggleFavorite(id) {
        const response = await apiFetch(`/tools/${id}/favorite`, {
            method: 'POST',
        });
        return response.ok ? await response.json() : null;
    },

    async getReviews(toolId) {
        const response = await apiFetch(`/tools/${toolId}/reviews`);
        return response.ok ? await response.json() : { reviews: [], average_rating: 0 };
    },

    async addReview(toolId, data) {
        const response = await apiFetch(`/tools/${toolId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.ok ? await response.json() : null;
    },
};

export const adminService = {
    async getStats() {
        const response = await apiFetch('/admin/stats');
        return response.ok ? await response.json() : null;
    },

    async getTools(filters = {}) {
        const searchParams = new URLSearchParams(filters);
        const response = await apiFetch(`/admin/tools?${searchParams}`);
        if (response.ok) {
            const data = await response.json();
            return data.data || data;
        }
        return [];
    },

    async approveTool(id) {
        const response = await apiFetch(`/admin/tools/${id}/approve`, {
            method: 'POST',
        });
        return response.ok;
    },

    async rejectTool(id) {
        const response = await apiFetch(`/admin/tools/${id}/reject`, {
            method: 'POST',
        });
        return response.ok;
    },

    async getActivityLogs() {
        const response = await apiFetch('/admin/activity-logs');
        return response.ok ? await response.json() : { data: [] };
    },
};
