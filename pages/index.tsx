import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import axios from 'axios'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [employees, setEmployees] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string,boolean>>({})

  useEffect(()=>{
    checkUser()
    fetchData()
  }, [date])

  async function checkUser() {
    const { data } = await supabase.auth.getSession()
    setUser(data?.session?.user || null)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }

  async function fetchData() {
    // fetch employees
    const { data: employeesData } = await supabase.from('employees').select('*').order('name')
    setEmployees(employeesData || [])

    // fetch attendance for date
    const { data: att } = await supabase.from('attendance').select('employee_id,present,meal_type').eq('date', date)
    const map = {} as Record<string, boolean>
    (att || []).forEach((r:any)=>{ map[r.employee_id] = r.present })
    setAttendance(map)
  }

  function toggle(id:string){
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }))
  }

  async function saveAttendance(){
    // call server API to upsert attendance (server will use service role key)
    await axios.post('/api/attendance', { date, items: attendance })
    alert('Presença salva')
    fetchData()
  }

  async function logout(){ await supabase.auth.signOut(); window.location.href = '/login' }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#fff7f0] via-white to-[#fff9f2]">
      <Head><title>Yummy — Registro Diário</title></Head>
      <div className="flex gap-6">
        <aside className="w-64 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold">Y</div>
            <div><div className="font-bold">Yummy</div><div className="text-sm text-gray-500">Controle de Refeições</div></div>
          </div>
          <nav className="mt-6">
            <Link href="/"><a className="block py-2 px-3 rounded bg-orange-50 text-orange-600 font-medium">Registro Diário</a></Link>
            <Link href="/funcionarios"><a className="block py-2 px-3 rounded hover:bg-gray-100 mt-2">Funcionários</a></Link>
            <Link href="/obras"><a className="block py-2 px-3 rounded hover:bg-gray-100 mt-2">Obras</a></Link>
          </nav>
          <div className="mt-6">
            {user ? (
              <div><div className="text-sm">Logado como</div><div className="font-medium">{user.email}</div><button onClick={logout} className="mt-2 p-2 w-full bg-red-500 text-white rounded">Logout</button></div>
            ) : (<Link href="/login"><a className="p-2 w-full block bg-blue-600 text-white rounded text-center">Entrar</a></Link>)}
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between">
            <div><h1 className="text-3xl font-bold">Registro Diário</h1><div className="text-sm text-gray-500">Controle de café da manhã e almoço</div></div>
            <div className="flex gap-3"><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="p-2 border rounded"/></div>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="p-6 rounded shadow-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white flex items-center justify-between">
              <div><h3 className="text-sm">Café da Manhã</h3><p className="text-4xl font-bold">{employees.filter(e=> attendance[e.id]).length}</p><p className="text-sm">pessoas hoje</p></div>
              <div className="opacity-40"><svg width="64" height="64" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="14" height="10" rx="2" stroke="white" strokeWidth="1.2"/><path d="M7 8v4" stroke="white" strokeWidth="1.2"/></svg></div>
            </div>
            <div className="p-6 rounded shadow-lg bg-gradient-to-r from-red-500 to-orange-600 text-white flex items-center justify-between">
              <div><h3 className="text-sm">Almoço</h3><p className="text-4xl font-bold">{employees.filter(e=> e.role==='operario' && attendance[e.id]).length}</p><p className="text-sm">operários hoje</p></div>
              <div className="opacity-40"><svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M7 3v18" stroke="white" strokeWidth="1.2"/><path d="M12 3v18" stroke="white" strokeWidth="1.2"/></svg></div>
            </div>
          </div>

          <section className="mt-6 bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">Lista de Presença - {date}</h2>
            {employees.length===0 ? (<div className="text-center py-8 text-gray-400">Nenhum funcionário cadastrado</div>) : (
              <table className="w-full">
                <thead className="text-left text-sm text-gray-500"><tr><th>Nome</th><th>Setor</th><th>Presente</th></tr></thead>
                <tbody>{employees.map(emp=>(<tr key={emp.id} className="border-t"><td className="py-2">{emp.name}</td><td>{emp.role}</td><td><input type="checkbox" checked={!!attendance[emp.id]} onChange={()=>toggle(emp.id)}/></td></tr>))}</tbody>
              </table>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={saveAttendance} className="p-2 bg-green-600 text-white rounded">Salvar presença</button>
              <a href={`/api/export-xlsx?date=${date}`} className="p-2 bg-amber-600 text-white rounded">Exportar Excel</a>
              <label className="p-2 bg-blue-600 text-white rounded cursor-pointer">Importar Excel<input type="file" id="file-xlsx" accept=".xlsx,.xls" className="hidden" onChange={async (e:any)=>{ const f = e.target.files?.[0]; if(!f) return; const fd = new FormData(); fd.append('file', f); await fetch('/api/import-xlsx', { method: 'POST', body: fd }); fetchData(); }}/></label>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
