import { writable } from "svelte/store";

const THEME_KEY = "illusionsynth-theme";

function getInitialTheme(): "dark" | "light" {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }
  return "dark";
}

export const theme = writable<"dark" | "light">(getInitialTheme());

theme.subscribe((value) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", value);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(THEME_KEY, value);
  }
});

export function toggleTheme() {
  theme.update((t) => (t === "dark" ? "light" : "dark"));
}
