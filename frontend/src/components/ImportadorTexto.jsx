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
      <h2 className="text-xl font-bold mb-4 text-emerald-400">📥 Importar do WhatsApp</h2>
      <p className="text-slate-400 text-sm mb-4">Cole aqui o texto copiado do grupo de chamados.</p>
      
      <textarea
        className="w-full h-40 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
        placeholder="INC123456 - Loja: Centro - Ocorrência: Falha no SAP..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleImport}
          disabled={!text.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/20"
        >
          Processar Chamados
        </button>
      </div>
    </div>
  );
};

export default ImportadorTexto;
