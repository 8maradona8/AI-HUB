import { useState, useEffect, useCallback } from 'react';
import { toolService } from '@/services/api';
import { useToast } from '@/context/ToastContext';

export function useTools(initialFilterType = 'all') {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState(initialFilterType);
    const { addToast } = useToast();

    const fetchTools = useCallback(async () => {
        setLoading(true);
        try {
            const params = filterType === 'recommended' ? { recommended: 'true' } : {};
            const data = await toolService.getTools(params);
            setTools(data);
        } catch (error) {
            addToast('Failed to load tools', 'error');
        } finally {
            setLoading(false);
        }
    }, [filterType, addToast]);

    const fetchMetadata = useCallback(async () => {
        try {
            const [cats, rls] = await Promise.all([
                toolService.getCategories(),
                toolService.getRoles()
            ]);
            setCategories(cats);
            setRoles(rls);
        } catch (error) {
            addToast('Failed to load categories or roles', 'error');
        }
    }, [addToast]);

    useEffect(() => {
        fetchMetadata();
    }, [fetchMetadata]);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    const createTool = async (data) => {
        const result = await toolService.createTool(data);
        if (result) {
            addToast('Tool submitted for review!', 'success');
            fetchTools();
        } else {
            addToast('Failed to create tool', 'error');
        }
        return result;
    };

    const updateTool = async (id, data) => {
        const result = await toolService.updateTool(id, data);
        if (result) {
            addToast('Tool updated successfully!', 'success');
            fetchTools();
        } else {
            addToast('Failed to update tool', 'error');
        }
        return result;
    };

    const deleteTool = async (id) => {
        const success = await toolService.deleteTool(id);
        if (success) {
            addToast('Tool deleted', 'success');
            fetchTools();
        } else {
            addToast('Failed to delete tool', 'error');
        }
        return success;
    };

    const toggleFavorite = async (id) => {
        const result = await toolService.toggleFavorite(id);
        if (result) {
            // Update local state instead of refetching for better UX
            setTools(currentTools =>
                currentTools.map(t =>
                    t.id === id ? { ...t, is_favorited: result.favorited } : t
                )
            );
            addToast(result.message, 'success');
        } else {
            addToast('Failed to update favorite', 'error');
        }
    };

    return {
        tools,
        categories,
        roles,
        loading,
        filterType,
        setFilterType,
        refresh: fetchTools,
        createTool,
        updateTool,
        deleteTool,
        toggleFavorite,
    };
}
