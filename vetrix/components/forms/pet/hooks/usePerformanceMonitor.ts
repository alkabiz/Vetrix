import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderCount: number
  averageRenderTime: number
  lastRenderTime: number
  maxRenderTime: number
  minRenderTime: number
}

export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0)
  const renderStartTimeRef = useRef(0)
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: Infinity
  })

  useEffect(() => {
    renderStartTimeRef.current = performance.now()
    renderCountRef.current++

    return () => {
      const renderTime = performance.now() - renderStartTimeRef.current

      const currentMetrics = metricsRef.current
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const newRenderCount = renderCountRef.current

      metricsRef.current = {
        renderCount: newRenderCount,
        averageRenderTime: (currentMetrics.averageRenderTime * (newRenderCount - 1) + renderTime) / newRenderCount,
        lastRenderTime: renderTime,
        maxRenderTime: Math.max(currentMetrics.maxRenderTime, renderTime),
        minRenderTime: Math.min(currentMetrics.minRenderTime, renderTime)
      }

      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        // Only log in development and if render takes longer than a frame (16ms)
        console.warn(
          `[Performance] ${componentName}: ${renderTime.toFixed(2)}ms\n` +
          `  Total Renders: ${newRenderCount}\n` +
          `  Average: ${metricsRef.current.averageRenderTime.toFixed(2)}ms\n` +
          `  Max: ${metricsRef.current.maxRenderTime.toFixed(2)}ms\n` +
          `  Min: ${metricsRef.current.minRenderTime.toFixed(2)}ms`
        )
      }
    }
  })

  return metricsRef.current
}