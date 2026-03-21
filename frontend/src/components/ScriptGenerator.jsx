import React, { useState } from 'react';
import { generateScript } from '../services/templates';

const ScriptGenerator = ({ chamados }) => {
  const [nome, setNome] = useState('');
  const [selectedIncs, setSelectedIncs] = useState([]);

  const toggleInc = (inc) => {
    setSelectedIncs(prev => 
      prev.includes(inc) ? prev.filter(i => i !== inc) : [...prev, inc]
    );
  };

  const copyToClipboard = (tipo) => {
    if (selectedIncs.length === 0) return alert('Selecione ao menos um INC');
    const script = generateScript(tipo, selectedIncs, nome || 'Equipe');
    navigator.clipboard.writeText(script);
    alert('Script copiado!');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-emerald-400">🤖 Gerador de Scripts</h2>
      
      <div className="mb-4">
        <label className="text-slate-400 text-xs font-bold uppercase block mb-2">Seu Nome / Equipe</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Ivan Motta"
          className="w-full bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-600 focus:border-emerald-500 outline-none transition-all"
        />
      </div>

      <div className="mb-4">
        <label className="text-slate-400 text-xs font-bold uppercase block mb-2">Selecionar INCs</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded-xl border border-slate-700">
          {chamados.map(c => (
            <button
              key={c.id}
              onClick={() => toggleInc(c.inc)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedIncs.includes(c.inc) 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-slate-800 text-slate-400 border-slate-600'
              } border`}
            >
              {c.inc}
            </button>
          ))}
          {chamados.length === 0 && <span className="text-slate-600 italic text-xs">Nenhum chamado disponível</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => copyToClipboard('PRIMEIRO_CONTATO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
        >
          Primeiro Contato
        </button>
        <button
          onClick={() => copyToClipboard('SOLICITACAO_PREVISAO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
        >
          Solicitar Previsão
        </button>
        <button
          onClick={() => copyToClipboard('NORMALIZADO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
        >
          Normalizado
        </button>
        <button
          onClick={() => copyToClipboard('FINALIZADO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-slate-600"
        >
          Finalizado
        </button>
      </div>
    </div>
  );
};

export default ScriptGenerator;
