import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const HEALTH_CHECK_INTERVAL = 30000; // Check every 30 seconds
const INITIAL_CHECK_DELAY = 1000; // Initial check after 1 second

export const useBackendHealth = () => {
    const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
    const [hasChecked, setHasChecked] = useState(false);

    const checkBackendHealth = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(`${BASE_URL}/health`, {
                method: "GET",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setIsBackendOnline(true);
            } else {
                setIsBackendOnline(false);
            }
        } catch (error) {
            console.error("Backend health check failed:", error);
            setIsBackendOnline(false);
        } finally {
            setHasChecked(true);
        }
    };

    useEffect(() => {
        // Initial check after a short delay
        const initialTimeout = setTimeout(() => {
            checkBackendHealth();
        }, INITIAL_CHECK_DELAY);

        // Set up periodic health checks
        const interval = setInterval(() => {
            checkBackendHealth();
        }, HEALTH_CHECK_INTERVAL);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return { isBackendOnline, hasChecked, recheckHealth: checkBackendHealth };
};
