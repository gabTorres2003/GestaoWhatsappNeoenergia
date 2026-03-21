import React from 'react';
import SLAIndicator from './SLAIndicator';

const ChamadosTable = ({ chamados, onUpdateStatus, onRemove }) => {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-700">
              <th className="px-6 py-4">INC</th>
              <th className="px-6 py-4">SLA</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Equipe Designada</th>
              <th className="px-6 py-4">Loja</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {chamados.map((chamado) => (
              <tr key={chamado.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-emerald-400 font-mono font-bold">{chamado.inc}</span>
                </td>
                <td className="px-6 py-4">
                  <SLAIndicator createdAt={chamado.created_at} />
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-600">
                    {chamado.categoria}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-200 text-sm font-medium">{chamado.equipe_final}</span>
                    <span className="text-slate-500 text-[10px] italic">Designado: {chamado.equipe_primeira}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {chamado.loja}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={chamado.status}
                    onChange={(e) => onUpdateStatus(chamado.id, e.target.value)}
                    className="bg-slate-900 text-slate-200 text-xs p-2 rounded-lg border border-slate-600 outline-none"
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="DESIGNADO">Designado</option>
                    <option value="EM_ESPERA">Em Espera</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onRemove(chamado.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
