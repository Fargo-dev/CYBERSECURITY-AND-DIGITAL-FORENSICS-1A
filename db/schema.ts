import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const students = pgTable('students', {
  id: serial().primaryKey(),
  name: text().notNull(),
  indexNumber: text('index_number').notNull().unique(),
  phone: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
