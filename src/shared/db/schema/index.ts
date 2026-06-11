import {
  pgTable, serial, varchar, text, boolean, integer,
  timestamp, date, time, real, pgEnum, jsonb, uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])
export const employeeRoleEnum = pgEnum('employee_role', ['coiffeur', 'manager', 'owner', 'stagiaire', 'apprenti'])
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
export const recipientTypeEnum = pgEnum('recipient_type', ['salon', 'client', 'employee'])
export const notificationTypeEnum = pgEnum('notification_type', ['appointment_confirmation', 'appointment_reminder', 'appointment_cancelled', 'new_review', 'new_appointment'])
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'pro', 'business'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'past_due', 'canceled', 'trialing'])
export const connectorSyncStatusEnum = pgEnum('connector_sync_status', ['success', 'error', 'pending'])
export const connectorLogEventEnum = pgEnum('connector_log_event', ['webhook_received', 'job_started', 'job_success', 'job_failed', 'auth_refreshed'])

// ─── users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  openId: varchar('open_id', { length: 64 }).notNull().unique(),
  name: text('name'),
  email: varchar('email', { length: 320 }),
  loginMethod: varchar('login_method', { length: 64 }),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastSignedIn: timestamp('last_signed_in').defaultNow().notNull(),
})

// ─── pro_accounts ─────────────────────────────────────────────────────────────

export const proAccounts = pgTable('pro_accounts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  mustChangePassword: boolean('must_change_password').default(true).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  resetToken: varchar('reset_token', { length: 128 }),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastSignedIn: timestamp('last_signed_in'),
})

// ─── client_accounts ──────────────────────────────────────────────────────────

export const clientAccounts = pgTable('client_accounts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true).notNull(),
  resetToken: varchar('reset_token', { length: 128 }),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastSignedIn: timestamp('last_signed_in'),
})

// ─── salons ───────────────────────────────────────────────────────────────────

export const salons = pgTable('salons', {
  id: serial('id').primaryKey(),
  proAccountId: integer('pro_account_id').notNull().references(() => proAccounts.id),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 200 }).unique(),
  description: text('description'),
  phone: varchar('phone', { length: 20 }),
  address: varchar('address', { length: 200 }),
  postalCode: varchar('postal_code', { length: 10 }),
  city: varchar('city', { length: 100 }),
  citySlug: varchar('city_slug', { length: 100 }),
  departmentCode: varchar('department_code', { length: 3 }),
  region: varchar('region', { length: 100 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  email: varchar('email', { length: 320 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  coverUrl: varchar('cover_url', { length: 500 }),
  averageRating: real('average_rating'),
  reviewCount: integer('review_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  featuredRank: integer('featured_rank'),
  emailWelcomeText: text('email_welcome_text'),
  emailInstructions: text('email_instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── salon_photos ─────────────────────────────────────────────────────────────

export const salonPhotos = pgTable('salon_photos', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  photoUrl: varchar('photo_url', { length: 500 }).notNull(),
  description: varchar('description', { length: 255 }),
  position: integer('position').default(0).notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── employees ────────────────────────────────────────────────────────────────

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 320 }),
  phone: varchar('phone', { length: 20 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  role: employeeRoleEnum('role').default('coiffeur').notNull(),
  color: varchar('color', { length: 7 }).default('#C17A4A').notNull(),
  bio: text('bio'),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── services ─────────────────────────────────────────────────────────────────

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes').notNull(),
  price: real('price'),
  priceMin: real('price_min'),
  priceMax: real('price_max'),
  priceOnQuote: boolean('price_on_quote').default(false).notNull(),
  color: varchar('color', { length: 7 }).default('#5B8A52').notNull(),
  category: varchar('category', { length: 50 }),
  isActive: boolean('is_active').default(true).notNull(),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── employee_services ────────────────────────────────────────────────────────

export const employeeServices = pgTable('employee_services', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull().references(() => employees.id, { onDelete: 'cascade' }),
  serviceId: integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
})

// ─── salon_schedules ──────────────────────────────────────────────────────────

export const salonSchedules = pgTable('salon_schedules', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0=Lundi, 6=Dimanche
  isOpen: boolean('is_open').default(true).notNull(),
  openTime: time('open_time'),
  closeTime: time('close_time'),
  breakStartTime: time('break_start_time'),
  breakEndTime: time('break_end_time'),
})

// ─── employee_schedules ───────────────────────────────────────────────────────

export const employeeSchedules = pgTable('employee_schedules', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull().references(() => employees.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(),
  isWorking: boolean('is_working').default(true).notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  breakStartTime: time('break_start_time'),
  breakEndTime: time('break_end_time'),
})

// ─── closed_days ──────────────────────────────────────────────────────────────

export const closedDays = pgTable('closed_days', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  employeeId: integer('employee_id').references(() => employees.id, { onDelete: 'cascade' }), // NULL = tout le salon
  date: date('date').notNull(),
  reason: varchar('reason', { length: 200 }),
  source: varchar('source', { length: 50 }).default('manual'), // 'manual' | 'silae' | 'factorial'
  externalId: varchar('external_id', { length: 100 }), // ID dans le système source (idempotence)
})

// ─── salon_clients ────────────────────────────────────────────────────────────

export const salonClients = pgTable('salon_clients', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  clientAccountId: integer('client_account_id').notNull().references(() => clientAccounts.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('salon_client_unique').on(t.salonId, t.clientAccountId)])

// ─── appointments ─────────────────────────────────────────────────────────────

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id),
  clientAccountId: integer('client_account_id').references(() => clientAccounts.id),
  employeeId: integer('employee_id').notNull().references(() => employees.id),
  serviceId: integer('service_id').notNull().references(() => services.id),
  appointmentDate: date('appointment_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  guestFirstName: varchar('guest_first_name', { length: 100 }),
  guestLastName: varchar('guest_last_name', { length: 100 }),
  guestEmail: varchar('guest_email', { length: 320 }),
  guestPhone: varchar('guest_phone', { length: 20 }),
  notes: text('notes'),
  status: appointmentStatusEnum('status').default('confirmed').notNull(),
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),
  reminderSent: boolean('reminder_sent').default(false).notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 100 }),
  amountPaid: real('amount_paid'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id),
  clientAccountId: integer('client_account_id').notNull().references(() => clientAccounts.id),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  ownerReply: text('owner_reply'),
  isApproved: boolean('is_approved').default(false).notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('one_review_per_client_per_salon').on(t.salonId, t.clientAccountId)])

// ─── notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  recipientType: recipientTypeEnum('recipient_type').notNull(),
  recipientId: integer('recipient_id').notNull(),
  salonId: integer('salon_id').references(() => salons.id),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  sentToEmail: varchar('sent_to_email', { length: 320 }),
  isRead: boolean('is_read').default(false).notNull(),
  emailSent: boolean('email_sent').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── french_cities ────────────────────────────────────────────────────────────

export const frenchCities = pgTable('french_cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  inseeCode: varchar('insee_code', { length: 10 }),
  departmentCode: varchar('department_code', { length: 3 }).notNull(),
  regionCode: varchar('region_code', { length: 3 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  population: integer('population'),
})

// ─── subscriptions ────────────────────────────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 100 }).unique(),
  plan: subscriptionPlanEnum('plan').default('free').notNull(),
  status: subscriptionStatusEnum('status').default('active').notNull(),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('one_subscription_per_salon').on(t.salonId)])

// ─── cancellation_tokens ──────────────────────────────────────────────────────

export const cancellationTokens = pgTable('cancellation_tokens', {
  id: serial('id').primaryKey(),
  appointmentId: integer('appointment_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
})

// ─── connector_configs ────────────────────────────────────────────────────────

export const connectorConfigs = pgTable('connector_configs', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  connectorSlug: varchar('connector_slug', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  credentials: jsonb('credentials'), // Chiffré AES-256 avant stockage
  settings: jsonb('settings'),
  lastSyncAt: timestamp('last_sync_at'),
  lastSyncStatus: connectorSyncStatusEnum('last_sync_status'),
  lastSyncError: text('last_sync_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('one_connector_per_salon').on(t.salonId, t.connectorSlug)])

// ─── connector_logs ───────────────────────────────────────────────────────────

export const connectorLogs = pgTable('connector_logs', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  connectorSlug: varchar('connector_slug', { length: 50 }).notNull(),
  eventType: connectorLogEventEnum('event_type').notNull(),
  payload: jsonb('payload'),
  status: varchar('status', { length: 20 }).notNull(), // 'success' | 'error' | 'skipped'
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── push_subscriptions ───────────────────────────────────────────────────────

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: serial('id').primaryKey(),
  salonId: integer('salon_id').notNull().references(() => salons.id, { onDelete: 'cascade' }),
  employeeId: integer('employee_id').references(() => employees.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const salonsRelations = relations(salons, ({ one, many }) => ({
  proAccount: one(proAccounts, { fields: [salons.proAccountId], references: [proAccounts.id] }),
  employees: many(employees),
  services: many(services),
  photos: many(salonPhotos),
  schedules: many(salonSchedules),
  closedDays: many(closedDays),
  appointments: many(appointments),
  reviews: many(reviews),
  subscription: one(subscriptions),
  connectorConfigs: many(connectorConfigs),
}))

export const employeesRelations = relations(employees, ({ one, many }) => ({
  salon: one(salons, { fields: [employees.salonId], references: [salons.id] }),
  services: many(employeeServices),
  schedules: many(employeeSchedules),
  appointments: many(appointments),
}))

export const servicesRelations = relations(services, ({ one, many }) => ({
  salon: one(salons, { fields: [services.salonId], references: [salons.id] }),
  employees: many(employeeServices),
}))

export const employeeServicesRelations = relations(employeeServices, ({ one }) => ({
  employee: one(employees, { fields: [employeeServices.employeeId], references: [employees.id] }),
  service: one(services, { fields: [employeeServices.serviceId], references: [services.id] }),
}))

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  salon: one(salons, { fields: [appointments.salonId], references: [salons.id] }),
  employee: one(employees, { fields: [appointments.employeeId], references: [employees.id] }),
  service: one(services, { fields: [appointments.serviceId], references: [services.id] }),
  client: one(clientAccounts, { fields: [appointments.clientAccountId], references: [clientAccounts.id] }),
}))
