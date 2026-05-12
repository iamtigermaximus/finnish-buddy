declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

export const event = (action: string, params: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('event', action, params)
  }
}

export const trackQuizComplete = (topicId: string, score: number, level: string) => {
  event('quiz_complete', {
    topic_id: topicId,
    score: score,
    level: level,
  })
}

export const trackTopicStart = (topicId: string, topicTitle: string) => {
  event('topic_start', {
    topic_id: topicId,
    topic_title: topicTitle,
  })
}

export const trackAIHelpRequest = (grammarRuleId: string) => {
  event('ai_help_request', {
    grammar_rule_id: grammarRuleId,
  })
}
