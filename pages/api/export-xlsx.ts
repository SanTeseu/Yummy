import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../lib/supabaseServer'
import XLSX from 'xlsx'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const date = String(req.query.date || new Date().toISOString().slice(0,10))
  const supabase = supabaseServer
  const { data: employees } = await supabase.from('employees').select('*').order('name')
  const { data: attendance } = await supabase.from('attendance').select('*').eq('date', date)

  const rows = employees.map(e => ({
    id: e.id, name: e.name, role: e.role,
    present: !!attendance.find((a:any)=>a.employee_id===e.id)
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'attendance-'+date)
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  res.setHeader('Content-disposition', 'attachment; filename=refeicoes-'+date+'.xlsx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.send(buf)
}
