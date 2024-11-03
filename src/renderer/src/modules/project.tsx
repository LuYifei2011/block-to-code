import React, { useState, useEffect, forwardRef } from 'react';

const ProjectLoader: React.FC<{ id: string }> = forwardRef(({ id }, ref) => {
    const [Component, setComponent] = useState<React.FC | null>(null);

    useEffect(() => {
        const loadComponent = async () => {
            try {
                const context = await import(`./projects/${id}.tsx`);
                setComponent(() => context.default);
            } catch (error) {
                console.error(`Error loading component for id: ${id}`, error);
                setComponent(null);
            }
        };

        loadComponent();
    }, [id]);

    return Component ? <Component ref={ref} /> : <div>Component not found</div>;
});

export default ProjectLoader;
