import React, { useState } from 'react';
import { parseWhatsAppText } from '../services/parser';
import { classifyChamado } from '../services/classifier';

const ImportadorTexto = ({ onImported }) => {
  const [text, setText] = useState('');
  const [solicitante, setSolicitante] = useState('');

  const handleImport = () => {
    if (!text.trim()) return;
    
    const parsedData = parseWhatsAppText(text);
    const enrichedData = parsedData.map(item => {
      const classification = classifyChamado(item.ocorrencia || item.texto_bruto);
      return {
        ...item,
        ...classification,
        solicitante: solicitante.trim(), 
        status: 'ABERTO',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    onImported(enrichedData);
    setText('');
    setSolicitante('');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-neo-green flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V10" />
        </svg>
        Importar do WhatsApp
      </h2>
      
      {/* Campo para Solicitante */}
      <div className="mb-4">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Solicitante (Opcional)</label>
          <input 
            type="text" 
            value={solicitante} 
            onChange={(e) => setSolicitante(e.target.value)} 
            placeholder="Ex: @João Silva" 
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-600 focus:border-neo-green outline-none transition-all text-sm mb-2" 
          />
      </div>

      <p className="text-slate-400 text-xs mb-2">Cole aqui o texto copiado do grupo de chamados.</p>
      <textarea
        className="w-full h-40 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-600 focus:border-neo-green focus:ring-1 focus:ring-neo-green outline-none transition-all resize-none text-sm"
        placeholder="INC123456 - Loja: Centro - Ocorrência: Falha no SAP..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleImport}
          disabled={!text.trim()}
          className="bg-neo-green hover:opacity-90 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-neo-green/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          Processar Chamados
        </button>
      </div>
    </div>
  );
};

export default ImportadorTexto;