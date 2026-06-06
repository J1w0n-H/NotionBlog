import { useEffect, useState } from "react"

export type MotionLevel = "full" | "restrained" | "zero"

const STORAGE_KEY = "jiwon-motion"
const DEFAULT: MotionLevel = "restrained"

const CYCLE: Record<MotionLevel, MotionLevel> = {
  full: "restrained",
  restrained: "zero",
  zero: "full",
}

export function useMotionPreference(): [MotionLevel, () => void] {
  const [level, setLevel] = useState<MotionLevel>(() => {
    if (typeof window === "undefined") return DEFAULT
    const stored = localStorage.getItem(STORAGE_KEY) as MotionLevel | null
    return stored ?? DEFAULT
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", level)
    localStorage.setItem(STORAGE_KEY, level)
  }, [level])

  const cycle = () => setLevel((l) => CYCLE[l])

  return [level, cycle]
}
