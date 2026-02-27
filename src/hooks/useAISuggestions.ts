import { useState } from 'react'

type Status = 'idle' | 'loading' | 'done' | 'error'

export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')

  const generate = async (title: string, context: string) => {
    setStatus('loading')
    setSuggestions([])

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, context }),
      })

      if (!response.ok) throw new Error(`Erreur : ${response.status}`)

      const data = await response.json()
      if (!Array.isArray(data.steps)) throw new Error('Format inattendu')

      setSuggestions(data.steps)
      setStatus('done')
    } catch (err) {
      console.error('AI error:', err)
      setStatus('error')
    }
  }

  return { suggestions, status, generate }
}