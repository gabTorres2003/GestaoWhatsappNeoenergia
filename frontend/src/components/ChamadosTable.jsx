import React, { useState } from 'react';
import SLAIndicator from './SLAIndicator';

const ChamadosTable = ({ chamados, onUpdateStatus, onRemove }) => {
  const [copiedCol, setCopiedCol] = useState(null);
  const [ordemSla, setOrdemSla] = useState('asc');

  const chamadosOrdenados = [...chamados].sort((a, b) => {
    const tempoA = new Date(a.created_at).getTime();
    const tempoB = new Date(b.created_at).getTime();
    
    if (ordemSla === 'asc') {
        return tempoA - tempoB; 
    } else {
        return tempoB - tempoA; 
    }
  });

  const copyColumnData = async (columnKey, columnName) => {
    if (chamadosOrdenados.length === 0) return;
    
    const dataToCopy = chamadosOrdenados.map(c => {
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

  const alternarOrdemSla = () => {
    setOrdemSla(ordemSla === 'asc' ? 'desc' : 'asc');
  };

  const HeaderCell = ({ label, columnKey }) => (
    <th className="px-6 py-4 font-bold uppercase tracking-wider">
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-700">
              <HeaderCell label="INC" columnKey="inc" />
              
              <th 
                className="px-6 py-4 font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors group"
                onClick={alternarOrdemSla}
                title="Clique para ordenar pelo SLA"
              >
                <div className="flex items-center gap-2">
                  SLA
                  <span className="text-slate-500 group-hover:text-neo-green transition-colors text-lg leading-none">
                    {ordemSla === 'asc' ? '↓' : '↑'}
                  </span>
                </div>
              </th>

              <HeaderCell label="Categoria" columnKey="categoria" />
              <HeaderCell label="Responsável" columnKey="equipe" />
              <HeaderCell label="Loja" columnKey="loja" />
              <HeaderCell label="Status" columnKey="status" />
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-700/50">
            {chamadosOrdenados.map((chamado) => (
              <tr key={chamado.id} className="hover:bg-slate-700/30 transition-colors group text-sm">
                <td className="px-6 py-4">
                  <span className="text-slate-200 font-mono">{chamado.inc}</span>
                </td>
                <td className="px-6 py-4">
                  <SLAIndicator createdAt={chamado.created_at} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-300">{chamado.categoria}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-300">{chamado.equipe_final}</span>
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {chamado.loja}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={chamado.status}
                    onChange={(e) => onUpdateStatus(chamado.id, e.target.value)}
                    className="bg-slate-900/80 text-neo-blue text-xs p-1.5 rounded-lg border border-slate-700 outline-none focus:border-neo-blue font-semibold"
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="DESIGNADO">Designado</option>
                    <option value="EM_ESPERA">Em Espera</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4">
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