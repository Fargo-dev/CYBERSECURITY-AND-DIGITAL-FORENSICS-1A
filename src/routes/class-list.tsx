import { useMemo, useState } from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  FileSpreadsheet,
  FileText,
  FileType2,
  Loader2,
  RefreshCw,
  Search,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SiteHeader } from '@/components/site-header'
import { listStudents } from '@/lib/students.functions'
import type { StudentRecord } from '@/lib/students.functions'
import { exportExcel, exportPdf, exportWord } from '@/lib/exports'

export const Route = createFileRoute('/class-list')({
  head: () => ({
    meta: [
      { title: 'Class list · BSc. Cybersecurity and Digital Forensics 1A' },
    ],
  }),
  loader: () => listStudents(),
  component: ClassList,
})

type Format = 'excel' | 'pdf' | 'word'

const EXPORTERS: Record<
  Format,
  {
    label: string
    icon: typeof FileText
    run: (s: StudentRecord[]) => Promise<void>
  }
> = {
  excel: { label: 'Excel', icon: FileSpreadsheet, run: exportExcel },
  pdf: { label: 'PDF', icon: FileText, run: exportPdf },
  word: { label: 'Word', icon: FileType2, run: exportWord },
}

function ClassList() {
  const students = Route.useLoaderData()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<Format | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.indexNumber.toLowerCase().includes(q) ||
        s.phone.includes(q),
    )
  }, [students, query])

  async function handleExport(format: Format) {
    setBusy(format)
    try {
      await EXPORTERS[format].run(students)
      toast.success(`${EXPORTERS[format].label} file downloaded`)
    } catch {
      toast.error('The file couldn’t be created. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function refresh() {
    setRefreshing(true)
    try {
      await router.invalidate()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              BSc. Cybersecurity and Digital Forensics 1A
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Class list
            </h1>
            <p className="mt-2 text-muted-foreground">
              <span className="font-mono font-medium text-foreground">
                {students.length}
              </span>{' '}
              {students.length === 1 ? 'student has' : 'students have'}{' '}
              registered. Download the full list below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EXPORTERS) as Format[]).map((format) => {
              const { label, icon: Icon } = EXPORTERS[format]
              return (
                <Button
                  key={format}
                  variant={format === 'excel' ? 'default' : 'outline'}
                  disabled={busy !== null || students.length === 0}
                  onClick={() => handleExport(format)}
                >
                  {busy === format ? (
                    <Loader2
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden
                    />
                  ) : (
                    <Icon aria-hidden />
                  )}
                  Download {label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-card">
          <div className="flex items-center gap-2 border-b p-3">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, index or phone"
                aria-label="Search students"
                className="pl-9"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={refresh}
              disabled={refreshing}
              aria-label="Refresh list"
            >
              <RefreshCw
                className={
                  refreshing ? 'animate-spin motion-reduce:animate-none' : ''
                }
                aria-hidden
              />
            </Button>
          </div>

          {students.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="font-display text-lg font-semibold">
                No students yet
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Share the registration page with the class to start the list.
              </p>
              <Button asChild className="mt-5">
                <Link to="/">
                  <UserPlus aria-hidden /> Register a student
                </Link>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              No students match “{query}”.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14 pl-4">No.</TableHead>
                  <TableHead>Student name</TableHead>
                  <TableHead>Index number</TableHead>
                  <TableHead>Phone number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="pl-4 font-mono text-muted-foreground">
                      {students.indexOf(s) + 1}
                    </TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="font-mono">{s.indexNumber}</TableCell>
                    <TableCell className="font-mono">{s.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  )
}
