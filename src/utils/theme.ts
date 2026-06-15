export type Theme = "dark" | "light"

const STORAGE_KEY = "fanfares-theme"

/** Read the active theme from localStorage (falls back to "dark"). */
export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === "light" || stored === "dark") return stored
  return document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
}

/** Apply a theme to the DOM without persisting it (live preview). */
export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode")
  } else {
    document.documentElement.classList.remove("dark-mode")
  }
}

/** Apply a theme AND persist it to localStorage. */
export function saveTheme(theme: Theme): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
}
