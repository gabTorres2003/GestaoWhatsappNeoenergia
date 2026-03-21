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
      <h2 className="text-xl font-bold mb-4 text-neo-verde flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Gerador de Scripts
      </h2>
      
      <div className="mb-4">
        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">Seu Nome / Equipe</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Ivan Motta"
          className="w-full bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-600 focus:border-neo-verde outline-none transition-all text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">Selecionar INCs</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded-xl border border-slate-700 scrollbar-thin scrollbar-thumb-slate-700">
          {chamados.map(c => (
            <button
              key={c.id}
              onClick={() => toggleInc(c.inc)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedIncs.includes(c.inc) 
                  ? 'bg-neo-verde text-white border-neo-verde shadow-md shadow-neo-verde/20' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {c.inc}
            </button>
          ))}
          {chamados.length === 0 && <span className="text-slate-600 italic text-[10px] p-2">Nenhum chamado disponível para script</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => copyToClipboard('PRIMEIRO_CONTATO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
        >
          1º Contato
        </button>
        <button
          onClick={() => copyToClipboard('SOLICITACAO_PREVISAO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
        >
          Pedir Previsão
        </button>
        <button
          onClick={() => copyToClipboard('NORMALIZADO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
        >
          Normalizado
        </button>
        <button
          onClick={() => copyToClipboard('FINALIZADO')}
          className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
        >
          Finalizado
        </button>
      </div>
    </div>
  );
};

export default ScriptGenerator;
