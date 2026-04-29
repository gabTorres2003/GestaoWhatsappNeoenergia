import React, { useState, useEffect } from 'react';
import { getWhatsAppTemplates } from '../services/templates';

const ScriptGenerator = ({ chamadosSelecionados = [], onMassiveUpdate }) => {
  const [primeiroChamado, setPrimeiroChamado] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  // Estado local para permitir digitação fluida sem travar
  const [nomeLocal, setNomeLocal] = useState('');

  useEffect(() => {
    if (chamadosSelecionados && chamadosSelecionados.length > 0) {
      setPrimeiroChamado(chamadosSelecionados[0]);
      setNomeLocal(chamadosSelecionados[0].cliente_nome || '');
    } else {
      setPrimeiroChamado({});
      setNomeLocal('');
    }
  }, [chamadosSelecionados]);

  const getGrupoDestino = (mesa) => {
    if (!mesa) return null;
    const networking = ["L2-NE-IT NOC", "L2-NE-IT NETWORK", "L2-NE-IT NETWORK SECURITY"];
    if (networking.includes(mesa)) return "ITOM NEO . BOC - Networking";
    if (mesa === "L2-NE-IT BOC") return "ITOM NEO . BOC - NOC";
    if (mesa === "L2-NE-IT SO UNIX") return "ITOM NEO . BOC - Unix";
    if (mesa === "L2-NE-IT SAP BASIS") return "ITOM NEO . BOC - SAP Basics";
    return "Mesa sem grupo mapeado";
  };

  const grupoDestino = getGrupoDestino(primeiroChamado.equipe_final);
  const templates = getWhatsAppTemplates(chamadosSelecionados);

  const handleNomeChange = (e) => {
    const novoNome = e.target.value;
    setNomeLocal(novoNome); // Atualiza o input visualmente na hora
    if (typeof onMassiveUpdate === 'function') {
      onMassiveUpdate({ cliente_nome: novoNome }); // Atualiza os INCs selecionados
    }
  };

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
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          ⚡ Scripts Service Desk
        </h2>
        <span className="bg-neo-green/20 text-neo-green border border-neo-green/30 text-xs px-2 py-1 rounded-md font-bold">
          {chamadosSelecionados.length > 1 
            ? `${chamadosSelecionados.length} selecionados` 
            : (primeiroChamado.inc || 'INC Selecionado')}
        </span>
      </div>

      {primeiroChamado.equipe_final && (
        <div className="bg-neo-green/10 border border-neo-green/30 p-3 rounded-xl transition-all">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Grupo de Envio (Alto Impacto):
          </p>
          <p className="text-neo-green font-black text-sm animate-pulse">
            📢 {grupoDestino}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
            Nome do Cliente (no Script)
          </label>
          <input 
            type="text" 
            value={nomeLocal} 
            onChange={handleNomeChange}
            placeholder="Ex: Joyce" 
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 focus:border-neo-green outline-none transition-all text-sm shadow-inner" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-700/50">
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
              <span className="text-[9px] opacity-70 font-normal lowercase tracking-tight text-left">
                Clique para copiar o texto pronto
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50 text-[10px] text-slate-500 italic leading-relaxed text-center">
        * Mesa e Cliente são preenchidos automaticamente conforme os dados da linha na tabela.
      </div>
    </div>
  );
};

export default ScriptGenerator;