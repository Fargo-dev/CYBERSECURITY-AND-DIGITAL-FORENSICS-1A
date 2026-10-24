import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { students } from '../../db/schema.js'

export const studentInput = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your full name')
    .max(120, 'Name is too long'),
  indexNumber: z
    .string()
    .trim()
    .min(3, 'Enter your index number')
    .max(40, 'Index number is too long')
    .transform((v) => v.toUpperCase()),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{9,16}$/, 'Enter a valid phone number'),
})

export type StudentInput = z.input<typeof studentInput>

export type StudentRecord = {
  id: number
  name: string
  indexNumber: string
  phone: string
  createdAt: string
}

function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error
  for (let i = 0; i < 4 && current; i++) {
    if ((current as { code?: string }).code === '23505') return true
    current = (current as { cause?: unknown }).cause
  }
  return false
}

export const addStudent = createServerFn({ method: 'POST' })
  .validator(studentInput)
  .handler(async ({ data }) => {
    try {
      const [row] = await db
        .insert(students)
        .values({
          name: data.name.replace(/\s+/g, ' '),
          indexNumber: data.indexNumber,
          phone: data.phone.replace(/[\s-]/g, ''),
        })
        .returning()
      return { ok: true as const, id: row.id }
    } catch (error) {
      if (isUniqueViolation(error)) {
        return {
          ok: false as const,
          error: 'This index number has already been registered.',
        }
      }
      throw new Error('Could not save your details. Please try again.')
    }
  })

export const listStudents = createServerFn({ method: 'GET' }).handler(
  async (): Promise<StudentRecord[]> => {
    const rows = await db.select().from(students).orderBy(asc(students.name))
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      indexNumber: r.indexNumber,
      phone: r.phone,
      createdAt: r.createdAt.toISOString(),
    }))
  },
)
