/**
 * One-line tagline shown under a category group heading in the feed
 * (mono 11px, text-faint). Keep each line short — these read as
 * "what this section is" subtitles, not full descriptions.
 *
 * Lookup is normalized to NFKC + lowercased so Notion casing drift
 * (e.g. "Cryptography & Tls" vs "Cryptography & TLS") still resolves.
 */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "cryptography & tls": "protocol internals · math · footguns",
  "reverse engineering": "binaries · firmware · side channels",
  "ctf writeups": "writeups across pwn · crypto · web · kernel",
  "cloud security": "iam · workload identity · k8s posture",
  "detection & response (observability)":
    "signals · pipelines · post-incident replay",
  "security research (ai security)":
    "model behavior · prompt surface · capability vs intent",
  "systems & rtos": "schedulers · memory · embedded interfaces",
  "research notes": "papers · open questions · field notes",
  "infrastructure engineering":
    "linux · networking · automation at scale",
  projects: "shipped artifacts · code · experiments",
  conferences: "talks · panels · trip reports",
  extracurricular: "clubs · volunteering · campus life",
  "career / talks / community": "career arc · speaking · mentoring",
  activities: "running notes outside of the desk",
  life: "longer-form personal essays",
  "personal life": "longer-form personal essays",
  personal: "short personal posts",
  education: "degree work · coursework · academic projects",
  "work experience": "roles · responsibilities · stack",
}

export function descriptionForCategory(label?: string): string | undefined {
  if (!label) return undefined
  const key = label.trim().normalize("NFKC").toLowerCase()
  return CATEGORY_DESCRIPTIONS[key]
}
