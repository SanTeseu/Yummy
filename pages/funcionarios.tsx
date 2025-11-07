import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import axios from 'axios'

export default function Employees(){
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [role, setRole] = useState('operario')

  useEffect(()=>{ fetchList() },[])

  async function fetchList(){ const { data } = await supabase.from('employees').select('*').order('name'); setList(data || []) }

  async function add(){
    // server-side insert via API to use service role (better permissions)
    await axios.post('/api/employees', { name, role })
    setName(''); setRole('operario'); fetchList()
  }

  async function remove(id:string){
    await axios.delete('/api/employees?id='+id)
    fetchList()
  }

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Funcionários</h1>
        <Link href="/"><a className="p-2 bg-orange-500 text-white rounded">Voltar</a></Link>
      </header>

      <section className="mt-6 bg-white rounded shadow p-4">
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="p-2 border rounded flex-1"/>
          <select value={role} onChange={e=>setRole(e.target.value)} className="p-2 border rounded"><option value="operario">Operário</option><option value="administrativo">Administração</option></select>
          <button onClick={add} className="p-2 bg-green-600 text-white rounded">Adicionar</button>
        </div>

        <table className="w-full mt-4">
          <thead className="text-left text-sm text-gray-500"><tr><th>Nome</th><th>Setor</th><th>Ações</th></tr></thead>
          <tbody>{list.map(emp=>(<tr key={emp.id} className="border-t"><td className="py-2">{emp.name}</td><td>{emp.role}</td><td><button onClick={()=>remove(emp.id)} className="text-red-600">Remover</button></td></tr>))}</tbody>
        </table>

        <div className="mt-4">
          <label className="p-2 bg-blue-600 text-white rounded cursor-pointer">Importar Excel (sheet: employees)<input type="file" accept=".xlsx,.xls" className="hidden" onChange={async (e:any)=>{ const f = e.target.files?.[0]; if(!f) return; const fd = new FormData(); fd.append('file', f); await fetch('/api/import-xlsx',{ method: 'POST', body: fd }); fetchList(); }}/></label>
        </div>
      </section>
    </div>
  )
}
