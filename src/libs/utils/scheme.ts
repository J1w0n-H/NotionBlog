import { getCookie, setCookie } from "cookies-next"
import { CONFIG } from "site.config"
import type { SchemeType } from "src/types"

export const SCHEME_COOKIE = "scheme"

export function followsSystemTheme(): boolean {
  return CONFIG.blog.scheme === "system"
}

/** Site default when no cookie / DOM attribute is present. */
export function resolveDefaultScheme(): SchemeType {
  if (followsSystemTheme()) {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark"
    }
    return "light"
  }
  return CONFIG.blog.scheme as SchemeType
}

export function readStoredScheme(): SchemeType | null {
  const cached = getCookie(SCHEME_COOKIE) as SchemeType | undefined
  return cached === "light" || cached === "dark" ? cached : null
}

export function readDomScheme(): SchemeType | null {
  if (typeof document === "undefined") return null
  const attr = document.documentElement.getAttribute("data-scheme")
  return attr === "light" || attr === "dark" ? attr : null
}

/** Resolve active scheme: DOM (blocking script) → cookie → site default. */
export function resolveScheme(): SchemeType {
  return readDomScheme() ?? readStoredScheme() ?? resolveDefaultScheme()
}

export function applySchemeToDocument(scheme: SchemeType): void {
  if (typeof document === "undefined") return
  document.documentElement.setAttribute("data-scheme", scheme)
  document.documentElement.style.colorScheme = scheme
}

export function persistScheme(scheme: SchemeType): void {
  setCookie(SCHEME_COOKIE, scheme)
}

/** `data-scheme` for SSR `<html>` when not using system theme. */
export function getSsrSchemeAttribute(): SchemeType | undefined {
  if (followsSystemTheme()) return undefined
  return CONFIG.blog.scheme as SchemeType
}

/** Inline script: apply cookie/system scheme before first paint (FOUC guard). */
export function schemeBootstrapScript(): string {
  const configured = CONFIG.blog.scheme
  const systemBranch =
    "s=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';"
  const fixedBranch =
    configured === "system"
      ? systemBranch
      : `s='${configured}';`

  return `(function(){try{var m=document.cookie.match(/(?:^|; )scheme=([^;]*)/);var s=m?decodeURIComponent(m[1]):null;if(s!=='light'&&s!=='dark'){${fixedBranch}}document.documentElement.setAttribute('data-scheme',s);document.documentElement.style.colorScheme=s;}catch(e){}})();`
}
