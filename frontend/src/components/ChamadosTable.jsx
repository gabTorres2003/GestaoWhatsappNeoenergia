import React, { useState, useMemo } from 'react';

const ChamadosTable = ({ 
  chamados = [], 
  onUpdateStatus, 
  onRemove, 
  selectedIds = [], 
  onToggleSelect = () => {}, 
  onSelectAll = () => {},
  onMassiveUpdate = () => {} 
}) => {
  const [copiedCol, setCopiedCol] = useState(null);
  const [filtroSolicitante, setFiltroSolicitante] = useState('');

  const solicitantesUnicos = useMemo(() => {
    if (!chamados) return [];
    const nomes = chamados.map(c => c.solicitante).filter(Boolean);
    return [...new Set(nomes)].sort(); 
  }, [chamados]);

  const chamadosExibidos = useMemo(() => {
    let filtrados = chamados || [];
    if (filtroSolicitante) {
      filtrados = filtrados.filter(c => c.solicitante === filtroSolicitante);
    }
    return filtrados;
  }, [chamados, filtroSolicitante]);

  const copyColumnData = async (columnKey, columnName) => {
    if (chamadosExibidos.length === 0) return;
    const dataToCopy = chamadosExibidos.map(c => {
      if (columnKey === 'equipe' || columnKey === 'equipe_final') return c.equipe_final || '-';
      return c[columnKey] || '-';
    }).join('\n');

    try {
      await navigator.clipboard.writeText(dataToCopy);
      setCopiedCol(columnName);
      setTimeout(() => setCopiedCol(null), 2000);
    } catch (err) {}
  };

  const handleSelectAllFiltered = (e) => {
    onSelectAll(chamadosExibidos.map(c => c.id), e.target.checked);
  };

  const allSelected = chamadosExibidos.length > 0 && chamadosExibidos.every(c => (selectedIds || []).includes(c.id));

  const HeaderCell = ({ label, columnKey }) => (
    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-slate-400">
      <div className="flex items-center gap-2">
        {label}
        {columnKey && (
          <button 
            onClick={() => copyColumnData(columnKey, label)}
            title={`Copiar coluna ${label} na ordem atual`}
            className="text-slate-500 hover:text-neo-green transition-colors"
          >
            {copiedCol === label ? (
              <svg className="w-4 h-4 text-neo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            )}
          </button>
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
      {(selectedIds || []).length > 0 && (
        <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 flex flex-wrap gap-4 items-center">
          <span className="text-white text-xs font-bold uppercase tracking-widest">{selectedIds.length} Selecionados:</span>
          
          {/* Status Massivo */}
          <select 
            onChange={(e) => {
              if(e.target.value) {
                onMassiveUpdate({ status: e.target.value });
                e.target.value = "";
              }
            }}
            className="bg-slate-900 text-white text-[11px] p-2 rounded border border-slate-700 outline-none focus:border-neo-green cursor-pointer shadow-inner"
          >
            <option value="">Alterar Status...</option>
            <option value="ABERTO">Aberto</option>
            <option value="DESIGNADO">Designado</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          {/* Mesa/Equipe Massivo */}
          <select 
            onChange={(e) => {
              if(e.target.value) {
                onMassiveUpdate({ equipe_final: e.target.value });
                e.target.value = "";
              }
            }}
            className="bg-slate-900 text-white text-[11px] p-2 rounded border border-slate-700 outline-none focus:border-neo-green cursor-pointer shadow-inner"
          >
            <option value="">Alterar Mesa (Equipe)...</option>
            <option value="L2-NE-IT NOC">L2-NE-IT NOC</option>
            <option value="L2-NE-IT NETWORK">L2-NE-IT NETWORK</option>
            <option value="L2-NE-IT NETWORK SECURITY">L2-NE-IT NETWORK SECURITY</option>
            <option value="L2-NE-IT BOC">L2-NE-IT BOC</option>
            <option value="L2-NE-IT SO UNIX">L2-NE-IT SO UNIX</option>
            <option value="L2-NE-IT SAP BASIS">L2-NE-IT SAP BASIS</option>
          </select>

          {/* Solicitante Massivo */}
          <input 
            type="text"
            placeholder="Mudar Solicitante..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim() !== '') {
                let val = e.target.value.trim();
                if (!val.startsWith('@')) val = '@' + val;
                onMassiveUpdate({ solicitante: val });
                e.target.value = '';
              }
            }}
            className="bg-slate-900 text-white text-[11px] p-2 rounded border border-slate-700 outline-none focus:border-neo-green w-40 shadow-inner"
          />
          {/* Campo "Mudar Nome Cliente" removido daqui */}
        </div>
      )}

      {solicitantesUnicos.length > 0 && (
        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Filtrar por Solicitante:</span>
          <select 
            value={filtroSolicitante} 
            onChange={(e) => setFiltroSolicitante(e.target.value)}
            className="bg-slate-800 text-white text-xs p-2 rounded-lg border border-slate-600 outline-none focus:border-neo-green cursor-pointer"
          >
            <option value="">Todos os Solicitantes</option>
            {solicitantesUnicos.map(sol => (
              <option key={sol} value={sol}>{sol}</option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-900 text-slate-400 border-b border-slate-700">
              <th className="px-4 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={handleSelectAllFiltered}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-neo-green focus:ring-neo-green cursor-pointer accent-emerald-500"
                />
              </th>
              <HeaderCell label="INC" columnKey="inc" />
              <HeaderCell label="Solicitante" columnKey="solicitante" />
              <HeaderCell label="Categoria" columnKey="categoria" />
              <HeaderCell label="Mesa" columnKey="equipe_final" />
              <HeaderCell label="Status" columnKey="status" />
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {chamadosExibidos.map((chamado) => (
              <tr key={chamado.id} className={`hover:bg-slate-700/30 transition-colors ${(selectedIds || []).includes(chamado.id) ? 'bg-slate-800/80' : ''}`}>
                <td className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={(selectedIds || []).includes(chamado.id)}
                    onChange={() => onToggleSelect(chamado.id)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-neo-green focus:ring-neo-green cursor-pointer accent-emerald-500"
                  />
                </td>
                <td className="px-6 py-4 font-mono text-slate-200">{chamado.inc}</td>
                <td className="px-6 py-4 text-slate-300 font-semibold">{chamado.solicitante || '-'}</td>
                <td className="px-6 py-4 text-slate-300">{chamado.categoria}</td>
                <td className="px-6 py-4 text-slate-300">{chamado.equipe_final || '-'}</td>
                <td className="px-6 py-4">
                  <select
                    value={chamado.status}
                    onChange={(e) => onUpdateStatus(chamado.id, e.target.value)}
                    className="bg-slate-900/80 text-neo-blue text-xs p-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="DESIGNADO">Designado</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onRemove(chamado.id)} className="text-slate-500 hover:text-rose-400 transition-colors" title="Remover Chamado">
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