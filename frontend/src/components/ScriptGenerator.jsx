import React, { useState, useEffect } from 'react';
import { getWhatsAppTemplates } from '../services/templates';

const ScriptGenerator = ({ chamadosSelecionados = [] }) => {
  const [primeiroChamado, setPrimeiroChamado] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (chamadosSelecionados && chamadosSelecionados.length > 0) {
      setPrimeiroChamado(chamadosSelecionados[0]);
    }
  }, [chamadosSelecionados]);

  const templates = getWhatsAppTemplates(primeiroChamado);

  const copyToClipboard = async (script, id) => {
    try {
      await navigator.clipboard.writeText(script);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  if (chamadosSelecionados.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-center">
        <p className="text-slate-400 text-sm italic">
          Selecione ao menos um chamado na tabela para liberar os scripts de atendimento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          ⚡ Scripts Service Desk
        </h2>
        <span className="bg-neo-green/20 text-neo-green border border-neo-green/30 text-xs px-2 py-1 rounded-md font-bold">
          {primeiroChamado.inc || 'INC Selecionado'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => copyToClipboard(t.script, t.id)}
            className={`text-[11px] font-bold py-3 px-4 rounded-xl transition-all border flex flex-col items-start gap-1 cursor-pointer active:scale-95 ${
              copiedId === t.id 
                ? 'bg-neo-green text-white border-neo-green shadow-lg shadow-neo-green/20' 
                : `${t.color} text-white border-transparent shadow-md`
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{t.icon}</span>
              <span>{copiedId === t.id ? 'COPIADO COM SUCESSO!' : t.label}</span>
            </div>
            {copiedId !== t.id && (
              <span className="text-[9px] opacity-70 font-normal lowercase tracking-tight">
                Clique para copiar o texto pronto
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50 text-[10px] text-slate-500 italic leading-relaxed">
        * Os scripts utilizam os dados do INC selecionado na tabela. Caso o script peça "Mesa", preencha manualmente após colar.
      </div>
    </div>
  );
};

export default ScriptGenerator;