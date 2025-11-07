import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = supabaseServer
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('employees').select('*').order('name')
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }
  if (req.method === 'POST') {
    const { name, role } = req.body
    const { data, error } = await supabase.from('employees').insert([{ name, role }])
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, data })
  }
  if (req.method === 'DELETE') {
    const id = req.query.id as string
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }
  res.status(405).end()
}
