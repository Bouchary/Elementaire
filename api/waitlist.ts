import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide.' })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY ?? '',
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(process.env.BREVO_LIST_ID ?? '1')],
        updateEnabled: true,
      }),
    })

    if (!response.ok && response.status !== 204) {
      const data = await response.json()
      if (data.code === 'duplicate_parameter') {
        return res.status(200).json({ message: 'Déjà inscrit.' })
      }
      return res.status(500).json({ error: 'Erreur lors de l\'inscription.' })
    }

    return res.status(200).json({ message: 'Inscrit avec succès.' })
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}