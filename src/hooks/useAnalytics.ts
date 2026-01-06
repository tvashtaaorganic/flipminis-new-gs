'use client';

import { useEffect, useRef } from 'react';

type AnalyticsAction = 'view' | 'whatsapp_click' | 'enquiry_click';

interface AnalyticsData {
    store_id: string;
    product_id?: string;
}

export function useAnalytics() {
    const hasViewed = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const trackEvent = async (action: AnalyticsAction, data: AnalyticsData) => {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action_type: action,
                    ...data
                }),
                priority: 'low'
            });
        } catch (err) {
            console.error('Analytics failed', err);
        }
    };

    const trackView = (data: AnalyticsData) => {
        if (hasViewed.current) return;

        // 60s delay to filter bots/bounces - Only record if user stays 1 minute
        timeoutRef.current = setTimeout(() => {
            hasViewed.current = true;
            trackEvent('view', data);
        }, 60000);
    };

    return { trackEvent, trackView };
}
