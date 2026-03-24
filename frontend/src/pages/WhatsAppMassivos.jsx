// src/pages/WhatsAppMassivos.jsx
import React, { useState, useMemo } from 'react';
import ImportadorTexto from '../components/ImportadorTexto';
import ChamadosTable from '../components/ChamadosTable';
import ScriptGenerator from '../components/ScriptGenerator';
import MassiveAlert from '../components/MassiveAlert';
import { detectMassiveIncidents } from '../services/incidentDetector';
import { Link } from 'react-router-dom';

// Importando as logos
import logoNeo from '../assets/logo_neo.png';
import logoMinsait from '../assets/logo_minsait.png';

const WhatsAppMassivos = () => {
  const [chamados, setChamados] = useState([]);
  const getMessageDate = (timeString) => {
    if (!timeString) return new Date().toISOString();
    if (timeString.includes('T') || timeString.includes('-')) {
      return new Date(timeString).toISOString();
    }
  
    try {
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':');
      
      if (hours && minutes) {
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        const now = new Date();
        now.setHours(hours, parseInt(minutes, 10), 0, 0);
        return now.toISOString();
      }
    } catch (e) {
      console.warn("Formato de hora desconhecido, usando hora atual.");
    }
    
    return new Date().toISOString();
  };

  const handleImported = (newChamados) => {
    setChamados((prev) => {
      const existingIncs = new Set(prev.map((c) => c.inc));
      
      const filteredNew = newChamados
        .filter((c) => !existingIncs.has(c.inc))
        .map((c) => ({
          ...c,
          // Cria um ID único local
          id: c.id || crypto.randomUUID(), 
          // Usa o horário da mensagem (c.horario) para definir o início do SLA
          created_at: getMessageDate(c.horario || c.created_at),
          status: 'ABERTO'
        }));

      if (filteredNew.length === 0 && newChamados.length > 0) {
        alert('Todos os INCs informados já estão na lista!');
        return prev;
      }

      // Adiciona os novos no topo da lista
      return [...filteredNew, ...prev];
    });
  };

  const updateStatus = (id, status) => {
    setChamados((prev) => 
      prev.map((c) => (c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c))
    );
  };

  const removeChamado = (id) => {
    if (window.confirm('Deseja remover este chamado da tela?')) {
      setChamados((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const removeAllChamados = () => {
    if (window.confirm('Deseja limpar todos os chamados da tela? (Isso não pode ser desfeito)')) {
      setChamados([]);
    }
  };

  // Estatísticas e Incidentes Massivos (Recalculados localmente)
  const { stats, massives } = useMemo(() => {
    const now = new Date();

    const stats = {
      total: chamados.length,
      abertos: chamados.filter((c) => c.status === 'ABERTO').length,
      resolvidos: chamados.filter((c) => c.status === 'RESOLVIDO').length,
      criticos: chamados.filter((c) => {
        const diff = new Date(c.created_at).getTime() + 15 * 60000 - now.getTime();
        return diff < 0 && c.status !== 'ABERTO' && c.status !== 'RESOLVIDO';
      }).length,
    };

    stats.criticos = chamados.filter((c) => {
        const diff = new Date(c.created_at).getTime() + 15 * 60000 - now.getTime();
        return diff < 0 && c.status !== 'RESOLVIDO';
    }).length;

    const massives = detectMassiveIncidents(chamados, 3, 30); // 3 ou mais em 30 min

    return { stats, massives };
  }, [chamados]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-slate-900 to-[#0f172a] p-6 md:p-12 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header com Logos Organizas e Novo Título */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 w-max"
              >
                <span>←</span> Voltar ao HUB
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
                <img src={logoMinsait} alt="Minsait" className="h-6 object-contain" />
                <span className="text-slate-700 text-2xl font-light">|</span>
                <img src={logoNeo} alt="Neoenergia" className="h-8 object-contain" />
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight m-0">
              Gestão WhatsApp <span className="text-neo-green">Neoenergia</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Gestão de Chamados Massivos (WhatsApp)
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[110px] shadow-lg">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Total</span>
              <span className="text-2xl font-black text-white">{stats.total}</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[110px] shadow-lg">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Abertos</span>
              <span className="text-2xl font-black text-neo-green">{stats.abertos}</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[110px] shadow-lg">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Atrasados</span>
              <span className="text-2xl font-black text-rose-500">{stats.criticos}</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Importação e Ferramentas */}
          <div className="lg:col-span-4 space-y-8">
            {massives.length > 0 && <MassiveAlert massives={massives} />}
            <ImportadorTexto onImported={handleImported} />
            <ScriptGenerator chamados={chamados.filter((c) => c.status !== 'RESOLVIDO')} />
          </div>

          {/* Coluna Direita: Tabela de Operação */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                📋 Fila de Atendimento Local
              </h2>
              <button
                onClick={removeAllChamados}
                className="text-xs text-slate-500 hover:text-rose-400 font-bold uppercase tracking-widest transition-colors"
              >
                Limpar Fila
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
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-slate-400 font-bold">Nenhum chamado na fila</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Cole o texto do WhatsApp ao lado para começar.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="pt-12 pb-6 text-center flex flex-col items-center justify-center gap-1">
          <p className="text-slate-400 text-sm font-medium tracking-wide">Cordialmente,</p>
          <p className="text-slate-300 text-sm font-bold tracking-wide">
            Service Desk Neoenergia <span className="text-slate-600 font-normal">| Offline Mode</span>
          </p>
        </footer>
        
      </div>
    </div>
  );
};

export default WhatsAppMassivos;