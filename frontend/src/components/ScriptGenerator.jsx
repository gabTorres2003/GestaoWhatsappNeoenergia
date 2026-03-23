import React, { useState } from 'react';

const ScriptGenerator = ({ chamados }) => {
  const [equipe, setEquipe] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [selectedIncs, setSelectedIncs] = useState([]);

  const toggleInc = (inc) => {
    setSelectedIncs(prev => 
      prev.includes(inc) ? prev.filter(i => i !== inc) : [...prev, inc]
    );
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const generateText = (tipo) => {
    const incsListados = selectedIncs.join(', ');
    const incsBarra = selectedIncs.join(' / ');
    const isPlural = selectedIncs.length > 1;

    switch (tipo) {
      case 'ITNOW_EQUIPE':
        return `Time, ${equipe || '[NOME DA EQUIPE]'}\n\nPor gentileza, fornecer uma previsão de normalização, para que possamos informar o(a) colaborador(a) solicitante, e priorizar o atendimento.\n\nCordialmente,\nService Desk Neoenergia.`;

      case 'ITNOW_COLABORADOR':
        const incTextItnow = isPlural ? `identificadores n.º ${incsListados}` : `identificador n.º ${selectedIncs[0]}`;
        const saudacaoColab = colaborador ? `Olá, ${colaborador}\n\n` : `Olá,\n\n`;
        
        return `${saudacaoColab}É um prazer poder te ajudar, por isso documentamos todas as informações fornecidas. Destacamos a prioridade e solicitamos um retorno da equipe responsável, para fornecer uma previsão de atendimento para a solução do seu caso.\n\nPara acompanhar o andamento com o status atualizado, basta localizar o ${incTextItnow} no ITNow (https://iberdrola.service-now.com/itnow), diretamente pela aba CONSULTAS. Além disso, caso seja necessário, você pode adicionar mais informações relevantes e novas evidências sobre o erro.\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\n\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`;

      case 'WPP_CURTO':
        return `${getSaudacao()}, ${solicitante || '[Nome do Solicitante]'}!\nSolicitada a prioridade e previsão de atendimento! (${incsListados})\nVoltamos em 15 minutos com mais informações!`;

      case 'WPP_LONGO':
        const palavraChamado = isPlural ? 'Chamados' : 'Chamado';
        const verboEncontrar = isPlural ? 'encontram-se' : 'encontra-se';
        
        return `Prezado(a) ${solicitante || '[Nome do Solicitante]'}\n\n${palavraChamado} (*${incsBarra}*)\n\nComunicamos que o ${palavraChamado.toLowerCase()} ${verboEncontrar} na equipe responsável para a verificação dos ocorridos.\n\nSolicitamos prioridade nos atendimentos e a previsão de normalização.\n\nAssim que tivermos novas atualizações, realizaremos novo contato.`;

      default:
        return '';
    }
  };

  const copyToClipboard = (tipo) => {
    if (selectedIncs.length === 0) return alert('Selecione ao menos um INC para gerar o script.');
    const script = generateText(tipo);
    navigator.clipboard.writeText(script);
    alert('Script copiado para a área de transferência!');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-neo-green flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Gerador de Scripts
      </h2>
      
      {/* Campos de Entrada */}
      <div className="space-y-3 mb-5">
        <div>
          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1 ml-1">Equipe Designada (ITNOW)</label>
          <input
            type="text"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            placeholder="Ex: N3 - Telecom"
            className="w-full bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-600 focus:border-neo-green outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1 ml-1">Nome do Colaborador (Opcional - ITNOW)</label>
          <input
            type="text"
            value={colaborador}
            onChange={(e) => setColaborador(e.target.value)}
            placeholder="Ex: João Silva"
            className="w-full bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-600 focus:border-neo-green outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1 ml-1">Solicitante (WhatsApp)</label>
          <input
            type="text"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            placeholder="Ex: @~Inae Franco"
            className="w-full bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-600 focus:border-neo-green outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Seleção de INCs */}
      <div className="mb-5">
        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">Selecionar INCs</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded-xl border border-slate-700 scrollbar-thin scrollbar-thumb-slate-700">
          {chamados.map(c => (
            <button
              key={c.id}
              onClick={() => toggleInc(c.inc)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedIncs.includes(c.inc) 
                  ? 'bg-neo-green text-white border-neo-green shadow-md shadow-neo-green/20' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {c.inc}
            </button>
          ))}
          {chamados.length === 0 && <span className="text-slate-600 italic text-[10px] p-2">Nenhum chamado disponível</span>}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-4">
        <div>
          <div className="text-xs font-bold text-slate-400 mb-2 border-b border-slate-700 pb-1">Scripts ITNOW</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => copyToClipboard('ITNOW_EQUIPE')}
              className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
            >
              Pedir Previsão (Equipe)
            </button>
            <button
              onClick={() => copyToClipboard('ITNOW_COLABORADOR')}
              className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
            >
              Retorno (Colaborador)
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 mb-2 border-b border-slate-700 pb-1">Scripts WhatsApp</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => copyToClipboard('WPP_CURTO')}
              className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
            >
              Resposta Curta (15m)
            </button>
            <button
              onClick={() => copyToClipboard('WPP_LONGO')}
              className="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-600 active:scale-95"
            >
              Resumo Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;