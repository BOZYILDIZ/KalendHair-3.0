const steps = [
  {
    number: '01',
    title: 'Créez votre salon',
    description: 'Inscription en 2 minutes. Renseignez le nom de votre salon, vos coordonnées et c\'est parti.',
  },
  {
    number: '02',
    title: 'Configurez vos services',
    description: 'Définissez vos prestations : durées, prix, employés assignés. Flexible et rapide à paramétrer.',
  },
  {
    number: '03',
    title: 'Vos clients réservent',
    description: 'Partagez votre page publique. Vos clients réservent en ligne 24h/24, 7j/7, sans friction.',
  },
]

export function HowItWorks() {
  return (
    <section id="salons" style={{ padding: '5rem 2rem', background: 'var(--color-bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-playfair), serif', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Lancez-vous en 3 étapes
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', maxWidth: '420px', margin: '0 auto' }}>
            De l'inscription à vos premiers RDV en ligne, comptez moins d'une heure.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {steps.map(({ number, title, description }) => (
            <div key={number} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 700,
                flexShrink: 0,
              }}>
                {number}
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
