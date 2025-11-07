import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { supabase } from '../lib/supabaseClient'

export default function Projects(){
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  useEffect(()=>{ fetchList() },[])

  async function fetchList(){ const { data } = await supabase.from('projects').select('*').order('name'); setList(data || []) }

  async function add(){
    await axios.post('/api/projects', { name, location })
    setName(''); setLocation(''); fetchList()
  }

  async function remove(id:string){
    await axios.delete('/api/projects?id='+id)
    fetchList()
  }

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Obras</h1>
        <Link href="/"><a className="p-2 bg-orange-500 text-white rounded">Voltar</a></Link>
      </header>

      <section className="mt-6 bg-white rounded shadow p-4">
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome da obra" className="p-2 border rounded"/>
          <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Local" className="p-2 border rounded"/>
          <button onClick={add} className="p-2 bg-green-600 text-white rounded">Adicionar</button>
        </div>

        <table className="w-full mt-4">
          <thead className="text-left text-sm text-gray-500"><tr><th>Nome</th><th>Local</th><th>Ações</th></tr></thead>
          <tbody>{list.map(p=>(<tr key={p.id} className="border-t"><td className="py-2">{p.name}</td><td>{p.location}</td><td><button onClick={()=>remove(p.id)} className="text-red-600">Remover</button></td></tr>))}</tbody>
        </table>
      </section>
    </div>
  )
}
