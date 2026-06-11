export type ServiceCategory = 'coupe' | 'couleur' | 'soin' | 'barbe' | 'coiffage' | 'autre'

export interface Service {
  id: number
  salonId: number
  name: string
  description: string | null
  durationMinutes: number
  price: number | null
  priceMin: number | null
  priceMax: number | null
  priceOnQuote: boolean
  color: string
  category: ServiceCategory | null
  isActive: boolean
  position: number
}

export interface CreateServiceInput {
  name: string
  description?: string | null
  durationMinutes: number
  price?: number
  priceMin?: number
  priceMax?: number
  priceOnQuote?: boolean
  color?: string
  category?: ServiceCategory | string | null
}

export function formatServicePrice(service: Pick<Service, 'price' | 'priceMin' | 'priceMax' | 'priceOnQuote'>): string {
  if (service.priceOnQuote) return 'Sur devis'
  if (service.price !== null) return `${service.price}€`
  if (service.priceMin !== null && service.priceMax !== null) return `${service.priceMin}€ – ${service.priceMax}€`
  return 'Prix non renseigné'
}
