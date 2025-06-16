import { trackEvent as aptabaseTrackEvent } from '@aptabase/web'

/**
 * Track custom events with Aptabase
 * @param eventName - Name of the event to track
 * @param properties - Optional properties to attach to the event
 */
export function trackEvent(eventName: string, properties?: Record<string, string | number>) {
  try {
    aptabaseTrackEvent(eventName, properties)
  } catch (error) {
    // Silently fail in development or if analytics is blocked
    console.debug('Analytics tracking failed:', error)
  }
}

/**
 * Track page views
 * @param pageName - Optional custom page name
 */
export function trackPageView(pageName?: string) {
  trackEvent('page_view', {
    page: pageName || window.location.pathname,
    title: document.title,
    url: window.location.href
  })
}

/**
 * Track search events
 * @param query - Search query
 * @param results - Number of results (optional)
 */
export function trackSearch(query: string, results?: number) {
  trackEvent('search', {
    query,
    ...(results !== undefined && { results })
  })
}

/**
 * Track navigation events
 * @param from - Previous page
 * @param to - Current page
 */
export function trackNavigation(from: string, to: string) {
  trackEvent('navigation', {
    from,
    to
  })
}
