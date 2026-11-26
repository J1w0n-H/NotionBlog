import { useEffect, useRef } from "react"

/**
 * Layers that currently want Escape, oldest first. One keydown listener serves
 * all of them and only the top (most recently enabled) layer is closed, so a
 * popover inside a side panel closes alone instead of taking the panel with it.
 */
type EscapeLayer = { current: () => void }
const layers: EscapeLayer[] = []

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" || event.defaultPrevented) return
  // Escape while an IME (e.g. Korean) is composing cancels the composition only.
  if (event.isComposing) return
  const top = layers[layers.length - 1]
  if (!top) return
  event.preventDefault()
  top.current()
}

function pushLayer(layer: EscapeLayer) {
  if (layers.length === 0) window.addEventListener("keydown", onKeyDown)
  layers.push(layer)
}

function removeLayer(layer: EscapeLayer) {
  const i = layers.lastIndexOf(layer)
  if (i !== -1) layers.splice(i, 1)
  if (layers.length === 0) window.removeEventListener("keydown", onKeyDown)
}

/**
 * Calls `onEscape` when Escape is pressed while `enabled` is true and no layer
 * enabled after this one is still open. The latest callback is always used,
 * so callers don't need to memoize it.
 */
export function useEscapeKey(onEscape: () => void, enabled = true): void {
  const layerRef = useRef<EscapeLayer>({ current: onEscape })
  layerRef.current.current = onEscape

  useEffect(() => {
    if (!enabled) return
    const layer = layerRef.current
    pushLayer(layer)
    return () => removeLayer(layer)
  }, [enabled])
}
