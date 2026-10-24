import type { StudentRecord } from './students.functions'

export const CLASS_NAME = 'BSc. Cybersecurity and Digital Forensics 1A'

const HEADERS = ['No.', 'Student Name', 'Index Number', 'Phone Number']

function toRows(students: StudentRecord[]) {
  return students.map((s, i) => [String(i + 1), s.name, s.indexNumber, s.phone])
}

function fileBase() {
  return `BSc-Cybersecurity-Digital-Forensics-1A-${new Date().toISOString().slice(0, 10)}`
}

function generatedOn() {
  return new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportExcel(students: StudentRecord[]) {
  const XLSX = await import('xlsx')
  const sheet = XLSX.utils.aoa_to_sheet([
    [CLASS_NAME],
    [`Class list — generated ${generatedOn()}`],
    [],
    HEADERS,
    ...toRows(students),
  ])
  sheet['!cols'] = [{ wch: 6 }, { wch: 36 }, { wch: 20 }, { wch: 18 }]
  sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }]
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, 'Class 1A')
  const data = XLSX.write(book, { bookType: 'xlsx', type: 'array' })
  download(
    new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    `${fileBase()}.xlsx`,
  )
}

export async function exportPdf(students: StudentRecord[]) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(CLASS_NAME, 40, 50)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(
    `Class list · ${students.length} students · generated ${generatedOn()}`,
    40,
    68,
  )
  autoTable(doc, {
    startY: 86,
    head: [HEADERS],
    body: toRows(students),
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [15, 52, 46], textColor: 255 },
    alternateRowStyles: { fillColor: [241, 246, 244] },
    columnStyles: { 0: { cellWidth: 40 } },
  })
  doc.save(`${fileBase()}.pdf`)
}

export async function exportWord(students: StudentRecord[]) {
  const {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    WidthType,
    HeadingLevel,
    ShadingType,
  } = await import('docx')

  const cell = (text: string, header = false) =>
    new TableCell({
      shading: header
        ? { type: ShadingType.CLEAR, color: 'auto', fill: '0F342E' }
        : undefined,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: header,
              color: header ? 'FFFFFF' : undefined,
            }),
          ],
        }),
      ],
    })

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: HEADERS.map((h) => cell(h, true)),
      }),
      ...toRows(students).map(
        (row) => new TableRow({ children: row.map((v) => cell(v)) }),
      ),
    ],
  })

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: CLASS_NAME, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Class list · ${students.length} students · generated ${generatedOn()}`,
                color: '666666',
              }),
            ],
            spacing: { after: 240 },
          }),
          table,
        ],
      },
    ],
  })

  download(await Packer.toBlob(doc), `${fileBase()}.docx`)
}
