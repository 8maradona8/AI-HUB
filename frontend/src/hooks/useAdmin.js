import { useState, useEffect, useCallback } from 'react';
import { adminService, toolService } from '@/services/api';
import { useToast } from '@/context/ToastContext';

export function useAdmin(initialFilters = { status: 'pending' }) {
    const [tools, setTools] = useState([]);
    const [stats, setStats] = useState(null);
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(initialFilters);
    const { addToast } = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsData, toolsData, cats, rls] = await Promise.all([
                adminService.getStats(),
                adminService.getTools(filters),
                toolService.getCategories(),
                toolService.getRoles(),
            ]);
            setStats(statsData);
            setTools(toolsData);
            setCategories(cats);
            setRoles(rls);
        } catch (error) {
            addToast('Failed to load admin dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    }, [filters, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const approveTool = async (id) => {
        const success = await adminService.approveTool(id);
        if (success) {
            addToast('Tool approved!', 'success');
            fetchData();
        } else {
            addToast('Failed to approve tool', 'error');
        }
        return success;
    };

    const rejectTool = async (id) => {
        const success = await adminService.rejectTool(id);
        if (success) {
            addToast('Tool rejected', 'warning');
            fetchData();
        } else {
            addToast('Failed to reject tool', 'error');
        }
        return success;
    };

    return {
        tools,
        stats,
        categories,
        roles,
        loading,
        filters,
        setFilters,
        refresh: fetchData,
        approveTool,
        rejectTool,
    };
}
