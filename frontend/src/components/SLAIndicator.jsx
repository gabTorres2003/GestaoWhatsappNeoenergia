import React from 'react';
import SLAIndicator from './SLAIndicator';

const ChamadosTable = ({ chamados, onUpdateStatus, onDelete }) => {
  if (chamados.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Nenhum chamado importado ainda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID / Incidente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário / Local
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {chamados.map((chamado) => (
            <tr key={chamado.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div>{chamado.id}</div>
                <div className="text-xs text-gray-500">{chamado.data}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{chamado.usuario}</div>
                <div className="text-xs text-gray-400">{chamado.localizacao}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {chamado.descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={chamado.status}
                  onChange={(e) => onUpdateStatus(chamado.id, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-offset-1 cursor-pointer
                    ${chamado.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      chamado.status === 'Em Atendimento' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Atendimento">Em Atendimento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onDelete(chamado.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChamadosTable;