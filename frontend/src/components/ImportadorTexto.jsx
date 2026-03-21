import React, { useState } from 'react';
import { parseWhatsAppText } from '../services/parser';
import { classifyChamado } from '../services/classifier';

const ImportadorTexto = ({ onImported }) => {
  const [text, setText] = useState('');

  const handleImport = () => {
    if (!text.trim()) return;
    
    const parsedData = parseWhatsAppText(text);
    const enrichedData = parsedData.map(item => {
      const classification = classifyChamado(item.ocorrencia || item.texto_bruto);
      return {
        ...item,
        ...classification,
        status: 'ABERTO',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    onImported(enrichedData);
    setText('');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-neo-verde flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V10" />
        </svg>
        Importar do WhatsApp
      </h2>
      <p className="text-slate-400 text-xs mb-4">Cole aqui o texto copiado do grupo de chamados.</p>
      
      <textarea
        className="w-full h-40 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-600 focus:border-neo-verde focus:ring-1 focus:ring-neo-verde outline-none transition-all resize-none text-sm"
        placeholder="INC123456 - Loja: Centro - Ocorrência: Falha no SAP..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleImport}
          disabled={!text.trim()}
          className="bg-neo-verde hover:opacity-90 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-neo-verde/20 active:scale-95"
        >
          Processar Chamados
        </button>
      </div>
    </div>
  );
};

export default ImportadorTexto;
