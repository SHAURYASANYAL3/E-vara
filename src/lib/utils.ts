import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and safely merges Tailwind CSS classes,
 * resolving any conflicting utility classes.
 *
 * @param {...ClassValue} inputs - Conditional, array, or string class names.
 * @returns {string} A single string of merged and optimized Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}