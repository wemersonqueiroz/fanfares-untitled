import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

/**
 * Merge Tailwind CSS class names safely, resolving conflicts in favour of
 * the last value (same behaviour as Untitled UI's own cx helper).
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
