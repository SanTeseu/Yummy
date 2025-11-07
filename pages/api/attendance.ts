import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = supabaseServer
  if (req.method === 'GET') {
    const date = String(req.query.date || new Date().toISOString().slice(0,10))
    const { data, error } = await supabase.from('attendance').select('*').eq('date', date)
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }
  if (req.method === 'POST') {
    const { date, items } = req.body // items: { employee_id: boolean }
    // remove existing attendance for this date for provided employee ids
    const empIds = Object.keys(items)
    // delete existing
    await supabase.from('attendance').delete().eq('date', date).in('employee_id', empIds).select()
    // insert new rows for present=true
    const rows = empIds.map(id => ({ date, employee_id: id, meal_type: 'cafe', present: !!items[id] }))
    const { data, error } = await supabase.from('attendance').insert(rows)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, data })
  }
  res.status(405).end()
}
