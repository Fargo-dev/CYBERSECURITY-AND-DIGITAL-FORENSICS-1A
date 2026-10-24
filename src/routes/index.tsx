import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileType2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SiteHeader } from '@/components/site-header'
import { addStudent, studentInput } from '@/lib/students.functions'

export const Route = createFileRoute('/')({
  component: Home,
})

type FormIn = z.input<typeof studentInput>
type FormOut = z.output<typeof studentInput>

function Home() {
  const [saved, setSaved] = useState<string | null>(null)
  const form = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(studentInput),
    defaultValues: { name: '', indexNumber: '', phone: '' },
  })

  const submit = form.handleSubmit(async (values) => {
    form.clearErrors('root')
    try {
      const result = await addStudent({ data: values })
      if (!result.ok) {
        form.setError('indexNumber', { message: result.error })
        return
      }
      setSaved(values.name)
      form.reset()
    } catch {
      form.setError('root', {
        message: 'Your details couldn’t be saved. Please try again.',
      })
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="grid-bg bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-content gap-10 items-center px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
            <div>
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                {'// Class register'}
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
                BSc. Cybersecurity and Digital Forensics{' '}
                <span className="text-accent">1A</span>
              </h1>
              <p className="mt-5 max-w-reading text-lg text-primary-foreground/75">
                Add yourself to the official class list. Enter your name, index
                number and phone number once — the course rep can download the
                complete list as an Excel, PDF or Word file.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
                {[
                  { icon: FileSpreadsheet, label: 'Excel .xlsx' },
                  { icon: FileText, label: 'PDF' },
                  { icon: FileType2, label: 'Word .docx' },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
                  >
                    <Icon className="size-3.5 text-accent" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full max-w-lg justify-self-center rounded-xl border bg-card p-6 text-card-foreground shadow-2xl shadow-black/30 sm:p-8 lg:justify-self-end">
              {saved ? (
                <div className="py-6 text-center" role="status">
                  <CheckCircle2
                    className="mx-auto size-12 text-ring"
                    aria-hidden
                  />
                  <h2 className="mt-4 font-display text-2xl font-semibold">
                    You’re on the list
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Thanks, {saved}. Your details have been saved to the 1A
                    class register.
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                    <Button onClick={() => setSaved(null)}>
                      Register another student
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/class-list">View class list</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold">
                    Student details
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All fields are required. Each index number can be registered
                    once.
                  </p>
                  <Form {...form}>
                    <form onSubmit={submit} noValidate className="mt-6">
                      <fieldset
                        disabled={form.formState.isSubmitting}
                        className="space-y-5"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full name</FormLabel>
                              <FormControl>
                                <Input
                                  autoComplete="name"
                                  placeholder="e.g. Ama Serwaa Mensah"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="indexNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Index number</FormLabel>
                              <FormControl>
                                <Input
                                  autoComplete="off"
                                  placeholder="e.g. CSDF/24/0001"
                                  className="h-11 font-mono uppercase placeholder:normal-case"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  inputMode="tel"
                                  autoComplete="tel"
                                  placeholder="e.g. 024 123 4567"
                                  className="h-11 font-mono"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Include the country code if outside the country.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {form.formState.errors.root && (
                          <p role="alert" className="text-sm text-destructive">
                            {form.formState.errors.root.message}
                          </p>
                        )}
                        <Button type="submit" size="lg" className="h-11 w-full">
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2
                                className="animate-spin motion-reduce:animate-none"
                                aria-hidden
                              />
                              Saving…
                            </>
                          ) : (
                            'Add me to the class list'
                          )}
                        </Button>
                      </fieldset>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
