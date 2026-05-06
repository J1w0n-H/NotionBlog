import { useEffect, useState } from "react"

export type Mood = "default" | "hanji" | "signal" | "ops"

const MOODS: Mood[] = ["default", "hanji", "signal", "ops"]
const STORAGE_KEY = "sentinel-theme"

const useTheme = (): [Mood, (m: Mood) => void] => {
  const [mood, setMoodState] = useState<Mood>("default")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mood | null
    const initial = saved && MOODS.includes(saved) ? saved : "default"
    setMoodState(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  const setMood = (m: Mood) => {
    localStorage.setItem(STORAGE_KEY, m)
    document.documentElement.dataset.theme = m
    setMoodState(m)
  }

  return [mood, setMood]
}

export default useTheme
