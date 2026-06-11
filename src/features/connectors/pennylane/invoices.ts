import type { AppointmentWithDetails } from '@/features/appointments/types'
import { formatServicePrice } from '@/features/services/types'

interface PennylaneInvoiceItem {
  label: string
  quantity: number
  unit_price: number
  vat_rate: string
}

interface PennylaneInvoice {
  date: string
  deadline: string
  currency: string
  customer: { name: string; emails: string[] }
  line_items: PennylaneInvoiceItem[]
  special_mention: string
}

// Construit la payload facture Pennylane depuis un RDV KalendHair
export function buildPennylaneInvoice(appt: AppointmentWithDetails): PennylaneInvoice {
  const clientName = appt.client
    ? `${appt.client.firstName} ${appt.client.lastName}`
    : `${appt.guestFirstName ?? ''} ${appt.guestLastName ?? ''}`.trim()

  const clientEmail = appt.client?.email ?? appt.guestEmail ?? ''
  const price = appt.service.price ?? 0

  return {
    date: appt.appointmentDate,
    deadline: appt.appointmentDate,
    currency: 'EUR',
    customer: {
      name: clientName,
      emails: clientEmail ? [clientEmail] : [],
    },
    line_items: [{
      label: appt.service.name,
      quantity: 1,
      unit_price: price,
      vat_rate: '20.0',
    }],
    special_mention: `RDV KalendHair #${appt.id} — ${appt.employee.firstName}`,
  }
}

// Envoie la facture à l'API Pennylane
export async function createPennylaneInvoice(
  apiToken: string,
  invoice: PennylaneInvoice
): Promise<{ id: string }> {
  const res = await fetch('https://app.pennylane.com/api/external/v1/customer_invoices', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invoice }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Pennylane API error: ${res.status} — ${error}`)
  }

  return res.json() as Promise<{ id: string }>
}
