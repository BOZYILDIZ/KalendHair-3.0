const features = [
  {
    icon: '📅',
    title: 'Calendrier intelligent',
    description: 'Visualisez et gérez tous vos RDV en un coup d\'œil. Vue jour, semaine ou équipe, drag & drop, disponibilités en temps réel.',
  },
  {
    icon: '👥',
    title: 'Gestion d\'équipe',
    description: 'Plannings individuels, services par employé, gestion des congés et absences. Chaque collaborateur a son propre espace.',
  },
  {
    icon: '📧',
    title: 'Rappels automatiques',
    description: 'Emails de confirmation envoyés à la réservation et rappels automatiques J-1 pour réduire les no-shows.',
  },
]

export function Features() {
  return (
    <section id="fonctionnalites" style={{ padding: '5rem 2rem', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-playfair), serif', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Tout ce dont votre salon a besoin
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', maxWidth: '480px', margin: '0 auto' }}>
            Une plateforme pensée pour les professionnels de la coiffure, pas un outil généraliste.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {features.map(({ icon, title, description }) => (
            <div key={title} className="kh-card" style={{ padding: '2rem', transition: 'box-shadow 0.2s, transform 0.2s' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem', lineHeight: 1 }}>{icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)', marginBottom: '0.625rem' }}>{title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
