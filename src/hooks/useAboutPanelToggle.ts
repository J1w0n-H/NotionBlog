import { useAboutPanelMotion } from "src/contexts/AboutPanelMotionContext"

/** Toggle About panel from header profile or mobile bookmark. */
export function useAboutPanelToggle() {
  const motion = useAboutPanelMotion()
  if (!motion) {
    throw new Error("useAboutPanelToggle requires AboutPanelMotionProvider")
  }
  return motion
}
