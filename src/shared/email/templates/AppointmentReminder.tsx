import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Section,
} from '@react-email/components'
import React from 'react'

interface Props {
  clientName: string
  salonName: string
  serviceName: string
  employeeName: string
  appointmentDate: string
  startTime: string
  cancellationUrl?: string
}

export default function AppointmentReminder({
  clientName,
  salonName,
  serviceName,
  employeeName,
  appointmentDate,
  startTime,
  cancellationUrl,
}: Props) {
  return (
    <Html lang="fr">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Rappel — votre RDV est demain</Heading>

          <Text style={text}>Bonjour {clientName},</Text>
          <Text style={text}>
            Nous vous rappelons votre rendez-vous de demain chez <strong>{salonName}</strong>.
          </Text>

          <Section style={card}>
            <Text style={detail}><strong>Prestation</strong> : {serviceName}</Text>
            <Text style={detail}><strong>Avec</strong> : {employeeName}</Text>
            <Text style={detail}><strong>Date</strong> : {appointmentDate}</Text>
            <Text style={detail}><strong>Heure</strong> : {startTime}</Text>
          </Section>

          <Hr style={hr} />

          {cancellationUrl && (
            <>
              <Text style={mutedText}>
                Vous ne pouvez plus venir ? Annulez dès que possible pour libérer ce créneau.
              </Text>
              <Button href={cancellationUrl} style={button}>
                Annuler ce rendez-vous
              </Button>
              <Hr style={hr} />
            </>
          )}

          <Text style={footer}>
            KalendHair — La réservation simplifiée pour les salons de coiffure.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#FAF8F5', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }
const heading = { color: '#C17A4A', fontSize: '22px', fontWeight: '700', marginBottom: '16px' }
const text = { color: '#333333', fontSize: '15px', lineHeight: '1.6', margin: '8px 0' }
const card = { backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '20px', margin: '20px 0', border: '1px solid #E8E0D8' }
const detail = { color: '#333333', fontSize: '14px', margin: '6px 0' }
const hr = { borderColor: '#E8E0D8', margin: '24px 0' }
const mutedText = { color: '#888888', fontSize: '13px', margin: '8px 0' }
const button = { backgroundColor: '#C17A4A', color: '#FFFFFF', borderRadius: '6px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }
const footer = { color: '#AAAAAA', fontSize: '12px', textAlign: 'center' as const, marginTop: '16px' }
