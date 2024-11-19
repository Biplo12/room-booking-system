"use client";
import React from "react";
import {
  LucideIcon,
  PieChart,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: "PieChart" | "Calendar" | "Users" | "AlertCircle";
}

const icons: Record<EmptyStateProps["icon"], LucideIcon> = {
  PieChart,
  Calendar,
  Users,
  AlertCircle,
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {description}
      </p>
    </div>
  );
}
