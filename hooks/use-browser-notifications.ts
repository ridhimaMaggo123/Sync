import { useCallback, useRef } from "react"

export type BrowserNotification = {
  title: string
  message: string
  triggerDate: string // YYYY-MM-DD or ISO
}

function toDelayMs(triggerDate: string) {
  // If only date provided, schedule at 09:00 local time
  const date = triggerDate.length <= 10 ? new Date(`${triggerDate}T09:00:00`) : new Date(triggerDate)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.max(0, diff)
}

export function useBrowserNotifications() {
  const timeouts = useRef<number[]>([])

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return { supported: false, granted: false }
    const permission = await Notification.requestPermission()
    return { supported: true, granted: permission === "granted" }
  }, [])

  const clearScheduled = useCallback(() => {
    timeouts.current.forEach(id => window.clearTimeout(id))
    timeouts.current = []
  }, [])

  const schedule = useCallback((items: BrowserNotification[]) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return 0
    clearScheduled()
    let count = 0
    items.forEach((n) => {
      const delay = toDelayMs(n.triggerDate)
      // Don't schedule past notifications
      if (delay >= 0) {
        const id = window.setTimeout(() => {
          try {
            new Notification(n.title || "Sync Reminder", { body: n.message })
          } catch {}
        }, delay)
        timeouts.current.push(id)
        count++
      }
    })
    return count
  }, [clearScheduled])

  return { requestPermission, schedule, clearScheduled }
}
