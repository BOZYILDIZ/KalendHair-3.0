'use client'
import { useState } from 'react'
import { cancelByTokenAction } from '@/features/appointments/cancel-action'

interface CancelButtonProps {
  token: string
}

export default function CancelButton({ token }: CancelButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleCancel() {
    setState('loading')
    const result = await cancelByTokenAction(token)
    if (result.success) {
      setState('success')
    } else {
      setErrorMessage(result.error)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
        <p className="text-green-800 font-semibold text-lg">Rendez-vous annulé</p>
        <p className="text-green-700 mt-1 text-sm">Votre annulation a bien été prise en compte.</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-800 font-semibold">Une erreur est survenue</p>
        <p className="text-red-700 mt-1 text-sm">{errorMessage}</p>
      </div>
    )
  }

  return (
    <button
      onClick={handleCancel}
      disabled={state === 'loading'}
      className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-opacity disabled:opacity-60"
      style={{ backgroundColor: '#C17A4A' }}
    >
      {state === 'loading' ? 'Annulation en cours…' : 'Confirmer l\'annulation'}
    </button>
  )
}
