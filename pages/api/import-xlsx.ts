import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import XLSX from 'xlsx'
import { supabaseServer } from '../../lib/supabaseServer'

export const config = { api: { bodyParser: false } }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: String(err) })
    const file = files.file as any
    const content = fs.readFileSync(file.filepath)
    const workbook = XLSX.read(content, { type: 'buffer' })
    const supabase = supabaseServer

    if (workbook.SheetNames.includes('employees')) {
      const data = XLSX.utils.sheet_to_json(workbook.Sheets['employees']) as any[]
      const rows = data.map(r => ({ name: r.name || r.nome, role: r.role || r.setor || 'operario' }))
      await supabase.from('employees').insert(rows)
    }

    if (workbook.SheetNames.includes('projects')) {
      const data = XLSX.utils.sheet_to_json(workbook.Sheets['projects']) as any[]
      const rows = data.map(r => ({ name: r.name || r.nome, location: r.location || r.local }))
      await supabase.from('projects').insert(rows)
    }

    res.json({ ok: true })
  })
}
