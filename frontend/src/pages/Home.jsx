import React, { useState, useEffect, useMemo } from 'react'
import ImportadorTexto from '../components/ImportadorTexto'
import ChamadosTable from '../components/ChamadosTable'
import ScriptGenerator from '../components/ScriptGenerator'
import MassiveAlert from '../components/MassiveAlert'
import { detectMassiveIncidents } from '../services/incidentDetector'

const Home = () => {
  const [chamados, setChamados] = useState(() => {
    const saved = localStorage.getItem('chamados_neoenergia')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('chamados_neoenergia', JSON.stringify(chamados))
  }, [chamados])

  const handleImported = (newChamados) => {
    // Evita duplicados por INC
    const existingIncs = new Set(chamados.map((c) => c.inc))
    const filteredNew = newChamados.filter((c) => !existingIncs.has(c.inc))

    if (filteredNew.length === 0 && newChamados.length > 0) {
      alert('Todos os INCs informados já estão na lista!')
      return
    }

    setChamados((prev) => [...filteredNew, ...prev])
  }

  const updateStatus = (id, status) => {
    setChamados((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, updated_at: new Date().toISOString() }
          : c,
      ),
    )
  }

  const removeChamado = (id) => {
    if (window.confirm('Deseja remover este chamado?')) {
      setChamados((prev) => prev.filter((c) => c.id !== id))
    }
  }

  // Estatísticas e Incidentes Massivos recalculados sempre que os chamados mudarem
  const { stats, massives } = useMemo(() => {
    const now = new Date()

    const stats = {
      total: chamados.length,
      abertos: chamados.filter((c) => c.status === 'ABERTO').length,
      resolvidos: chamados.filter((c) => c.status === 'RESOLVIDO').length,
      criticos: chamados.filter((c) => {
        const diff =
          new Date(c.created_at).getTime() + 15 * 60000 - now.getTime()
        return diff < 0 && c.status !== 'RESOLVIDO'
      }).length,
    }

    const massives = detectMassiveIncidents(chamados, 3, 30) // 3 ou mais em 30 min

    return { stats, massives }
  }, [chamados])

  return (
    <div className="min-h-screen p-6 md:p-12 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight m-0">
            Gestão de Chamados <span className="text-neo-verde">Massivos</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            <span className="text-indra-azul font-bold">Indra</span> |{' '}
            <span className="text-minsait-bordo font-bold">Minsait</span> —
            Service Desk Neoenergia
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[110px] shadow-lg">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Total
            </span>
            <span className="text-2xl font-black text-white">
              {stats.total}
            </span>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[110px] shadow-lg">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Abertos
            </span>
            <span className="text-2xl font-black text-neo-verde">
              {stats.abertos}
            </span>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[110px] shadow-lg">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Atrasados
            </span>
            <span className="text-2xl font-black text-rose-500">
              {stats.criticos}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Importação e Ferramentas */}
        <div className="lg:col-span-4 space-y-8">
          {massives.length > 0 && <MassiveAlert massives={massives} />}
          <ImportadorTexto onImported={handleImported} />
          <ScriptGenerator
            chamados={chamados.filter((c) => c.status !== 'RESOLVIDO')}
          />
        </div>

        {/* Coluna Direita: Tabela de Operação */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              📋 Fila de Atendimento
            </h2>
            <button
              onClick={() => {
                if (confirm('Limpar todos os chamados?')) setChamados([])
              }}
              className="text-xs text-slate-500 hover:text-rose-400 font-bold uppercase tracking-widest transition-colors"
            >
              Limpar Tudo
            </button>
          </div>

          {chamados.length > 0 ? (
            <ChamadosTable
              chamados={chamados}
              onUpdateStatus={updateStatus}
              onRemove={removeChamado}
            />
          ) : (
            <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-3xl p-20 text-center">
              <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-slate-400 font-bold">
                Nenhum chamado na fila
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Cole o texto do WhatsApp ao lado para começar.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs font-medium">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Neoenergia (Verde)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Indra (Azul)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Minsait (Bordô)</span>
          </div>
        </div>
        <div>Versão MVP 1.0 • Sem dependência de API externa</div>
      </footer>
    </div>
  )
}

export default Home
