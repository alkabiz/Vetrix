import { QueryClient } from "@tanstack/react-query"

/**
 * Centralized QueryClient instance for React Query.
 * Configured with default options for caching and retries.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default queryClient
