import { useEffect, useCallback } from 'react';

interface MetricsStorage {
  date: string;
  [key: string]: any;
}

export function useDateAwareMetrics(storageKey: string, initialMetricsStructure: any) {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Load metrics for specific date
  const loadMetrics = useCallback((date: string) => {
    try {
      const allMetrics = localStorage.getItem(storageKey);
      if (!allMetrics) return null;
      
      const parsedMetrics = JSON.parse(allMetrics);
      return parsedMetrics[date] || null;
    } catch (error) {
      console.error(`Error loading metrics for ${date}:`, error);
      return null;
    }
  }, [storageKey]);

  // Save metrics for specific date
  const saveMetrics = useCallback((date: string, metrics: any) => {
    try {
      const allMetrics = localStorage.getItem(storageKey);
      const parsedMetrics = allMetrics ? JSON.parse(allMetrics) : {};
      
      parsedMetrics[date] = {
        ...initialMetricsStructure,
        ...parsedMetrics[date],
        ...metrics,
        date // Ensure date is always included
      };
      
      localStorage.setItem(storageKey, JSON.stringify(parsedMetrics));
    } catch (error) {
      console.error(`Error saving metrics for ${date}:`, error);
    }
  }, [storageKey, initialMetricsStructure]);

  // Check and handle date transitions
  const handleDateTransition = useCallback(() => {
    const currentDate = getCurrentDate();
    const lastAccessDate = localStorage.getItem(`${storageKey}_last_access`);

    if (lastAccessDate !== currentDate) {
      // Initialize new date entry if it doesn't exist
      const currentMetrics = loadMetrics(currentDate);
      if (!currentMetrics) {
        saveMetrics(currentDate, initialMetricsStructure);
      }
      
      // Update last access date
      localStorage.setItem(`${storageKey}_last_access`, currentDate);
    }
  }, [getCurrentDate, loadMetrics, saveMetrics, storageKey, initialMetricsStructure]);

  // Clean up old metrics (optional, keeps last 30 days)
  const cleanupOldMetrics = useCallback(() => {
    try {
      const allMetrics = localStorage.getItem(storageKey);
      if (!allMetrics) return;

      const parsedMetrics = JSON.parse(allMetrics);
      const dates = Object.keys(parsedMetrics);
      const currentDate = new Date();
      
      // Keep only last 30 days of metrics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const updatedMetrics = Object.fromEntries(
        Object.entries(parsedMetrics).filter(([date]) => {
          const metricDate = new Date(date);
          return metricDate >= thirtyDaysAgo && metricDate <= currentDate;
        })
      );

      localStorage.setItem(storageKey, JSON.stringify(updatedMetrics));
    } catch (error) {
      console.error('Error cleaning up old metrics:', error);
    }
  }, [storageKey]);

  // Setup date check interval
  useEffect(() => {
    handleDateTransition();
    cleanupOldMetrics();

    const intervalId = setInterval(() => {
      handleDateTransition();
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [handleDateTransition, cleanupOldMetrics]);

  return {
    getCurrentDate,
    loadMetrics,
    saveMetrics,
    handleDateTransition,
    cleanupOldMetrics
  };
}