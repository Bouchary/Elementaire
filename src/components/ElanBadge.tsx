import type { Context } from '../types'

type Props = {
  context: Context
}

const config = {
  perso: { label: 'Perso', color: 'bg-violet-500/15 text-violet-300' },
  pro: { label: 'Pro', color: 'bg-sky-500/15 text-sky-300' },
  urgent: { label: 'Urgent', color: 'bg-rose-500/15 text-rose-300' },
}

export default function ElanBadge({ context }: Props) {
  const { label, color } = config[context]
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  )
}