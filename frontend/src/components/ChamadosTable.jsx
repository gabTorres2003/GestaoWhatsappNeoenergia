import React, { useState, useMemo } from 'react';
import SLAIndicator from './SLAIndicator';

const ChamadosTable = ({ 
  chamados, 
  onUpdateStatus, 
  onRemove, 
  selectedIds, 
  onToggleSelect, 
  onSelectAll,
  onMassiveUpdate 
}) => {
  const [copiedCol, setCopiedCol] = useState(null);
  const [ordemSla, setOrdemSla] = useState('asc'); 
  const [filtroSolicitante, setFiltroSolicitante] = useState('');

  const solicitantesUnicos = useMemo(() => {
    const nomes = chamados.map(c => c.solicitante).filter(Boolean);
    return [...new Set(nomes)].sort(); 
  }, [chamados]);

  const obterTempoSla = (chamado) => {
    if (chamado.horario) {
      try {
        const [horas, minutos] = chamado.horario.split(':').map(Number);
        const dataReferencia = new Date();
        dataReferencia.setHours(horas, minutos, 0, 0);
        return dataReferencia.getTime();
      } catch (e) {
        console.warn("Erro ao ler horário, usando data de criação.");
      }
    }
    return new Date(chamado.created_at).getTime();
  };

  const chamadosExibidos = useMemo(() => {
    let filtrados = chamados;
    if (filtroSolicitante) {
      filtrados = filtrados.filter(c => c.solicitante === filtroSolicitante);
    }
    return filtrados.sort((a, b) => {
      const tempoA = obterTempoSla(a);
      const tempoB = obterTempoSla(b);
      return ordemSla === 'asc' ? tempoA - tempoB : tempoB - tempoA; 
    });
  }, [chamados, filtroSolicitante, ordemSla]);

  const copyColumnData = async (columnKey, columnName) => {
    if (chamadosExibidos.length === 0) return;
    const dataToCopy = chamadosExibidos.map(c => {
      if (columnKey === 'equipe') return c.equipe_final;
      return c[columnKey];
    }).join('\n');

    try {
      await navigator.clipboard.writeText(dataToCopy);
      setCopiedCol(columnName);
      setTimeout(() => setCopiedCol(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const alternarOrdemSla = () => setOrdemSla(ordemSla === 'asc' ? 'desc' : 'asc');

  const handleSelectAllFiltered = (e) => {
    onSelectAll(chamadosExibidos.map(c => c.id), e.target.checked);
  };

  const allSelected = chamadosExibidos.length > 0 && chamadosExibidos.every(c => selectedIds.includes(c.id));

  const HeaderCell = ({ label, columnKey }) => (
    <th className="px-6 py-4 font-bold uppercase tracking-wider">
      <div className="flex items-center gap-2">
        {label}
        {columnKey && (
          <button 
            onClick={() => copyColumnData(columnKey, label)}
            className="text-slate-500 hover:text-neo-green transition-colors"
          >
            {copiedCol === label ? "✓" : "📋"}
          </button>
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
      
      {/* Barra de Ações em Massa */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 flex flex-wrap gap-4 items-center">
          <span className="text-white text-xs font-bold uppercase">{selectedIds.length} Selecionados:</span>
          
          <select 
            onChange={(e) => e.target.value && onMassiveUpdate({ status: e.target.value })}
            className="bg-slate-900 text-white text-xs p-2 rounded border border-slate-700 outline-none focus:border-neo-green"
          >
            <option value="">Alterar Status...</option>
            <option value="ABERTO">Aberto</option>
            <option value="DESIGNADO">Designado</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <input 
            type="text"
            placeholder="Mudar Solicitante..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                onMassiveUpdate({ solicitante: e.target.value });
                e.target.value = '';
              }
            }}
            className="bg-slate-900 text-white text-xs p-2 rounded border border-slate-700 outline-none focus:border-neo-green w-40"
          />
          <span className="text-slate-500 text-[10px] italic">Pressione Enter para aplicar o nome</span>
        </div>
      )}

      {solicitantesUnicos.length > 0 && (
        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Filtrar por Solicitante:</span>
          <select 
            value={filtroSolicitante} 
            onChange={(e) => setFiltroSolicitante(e.target.value)}
            className="bg-slate-800 text-white text-sm p-2 rounded-lg border border-slate-600 outline-none focus:border-neo-green cursor-pointer"
          >
            <option value="">Todos os Solicitantes</option>
            {solicitantesUnicos.map(sol => (
              <option key={sol} value={sol}>{sol}</option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-700">
              <th className="px-4 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={handleSelectAllFiltered}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-emerald-500"
                />
              </th>
              <HeaderCell label="INC" columnKey="inc" />
              <th className="px-6 py-4 font-bold uppercase tracking-wider cursor-pointer" onClick={alternarOrdemSla}>
                SLA {ordemSla === 'asc' ? '↓' : '↑'}
              </th>
              <HeaderCell label="Solicitante" columnKey="solicitante" />
              <HeaderCell label="Categoria" columnKey="categoria" />
              <HeaderCell label="Responsável" columnKey="equipe" />
              <HeaderCell label="Status" columnKey="status" />
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {chamadosExibidos.map((chamado) => (
              <tr key={chamado.id} className={`hover:bg-slate-700/30 transition-colors text-sm ${selectedIds.includes(chamado.id) ? 'bg-slate-800/80' : ''}`}>
                <td className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(chamado.id)}
                    onChange={() => onToggleSelect(chamado.id)}
                    className="w-4 h-4 rounded border-slate-600 accent-emerald-500"
                  />
                </td>
                <td className="px-6 py-4 font-mono text-slate-200">{chamado.inc}</td>
                <td className="px-6 py-4">
                  <SLAIndicator createdAt={chamado.created_at} status={chamado.status} />
                </td>
                <td className="px-6 py-4 text-slate-300 font-semibold">{chamado.solicitante || '-'}</td>
                <td className="px-6 py-4 text-slate-300">{chamado.categoria}</td>
                <td className="px-6 py-4 text-slate-300">{chamado.equipe_final}</td>
                <td className="px-6 py-4">
                  <select
                    value={chamado.status}
                    onChange={(e) => onUpdateStatus(chamado.id, e.target.value)}
                    className="bg-slate-900/80 text-neo-blue text-xs p-1.5 rounded-lg border border-slate-700 outline-none"
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="DESIGNADO">Designado</option>
                    <option value="RESOLVIDO">Resolvido</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onRemove(chamado.id)} className="text-slate-500 hover:text-rose-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChamadosTable;