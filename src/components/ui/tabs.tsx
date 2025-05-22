"use client"

import * as React from "react"
import { createContext, useContext } from "react"

// Create a context for the tabs
type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

// Hook to use the tabs context
function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component")
  }
  return context
}

// Main Tabs component
interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, className = "", children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// TabsList component
interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${className}`}>
      {children}
    </div>
  )
}

// TabsTrigger component
interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function TabsTrigger({ value, className = "", children }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all
        ${isSelected 
          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600" 
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        } ${className}`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  )
}

// TabsContent component
interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function TabsContent({ value, className = "", children }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext()
  const isSelected = selectedValue === value

  if (!isSelected) return null

  return (
    <div className={className}>
      {children}
    </div>
  )
}
