"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function ReactQueryWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        suspense: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}