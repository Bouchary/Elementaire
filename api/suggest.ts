import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, context } = req.body

  if (!title || !context) return res.status(400).json({ error: 'Paramètres manquants' })

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `Tu aides des personnes avec des difficultés de concentration (TDAH, dysfonction exécutive) à démarrer leurs tâches.
Décompose la tâche donnée en 3 à 5 micro-étapes très concrètes, chacune réalisable en 2 à 5 minutes maximum.
Chaque étape doit commencer par un verbe d'action précis.
Sois concis, bienveillant, non-condescendant.
Réponds UNIQUEMENT avec un tableau JSON de strings. Exemple : ["Ouvrir le document", "Écrire le titre", "Rédiger la première phrase"]
Aucun texte avant ou après le tableau JSON.`,
          },
          {
            role: 'user',
            content: `Tâche : "${title}" (contexte : ${context})`,
          },
        ],
      }),
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `Erreur OpenAI : ${response.status}` })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? '[]'
    const parsed = JSON.parse(content)

    if (!Array.isArray(parsed)) return res.status(500).json({ error: 'Format inattendu' })

    return res.status(200).json({ steps: parsed })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}