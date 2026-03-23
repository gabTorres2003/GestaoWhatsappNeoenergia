import React, { useState } from 'react';

const ScriptGenerator = ({ chamados }) => {
  const [equipe, setEquipe] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [selectedIncs, setSelectedIncs] = useState([]);
  const [copiedType, setCopiedType] = useState(null);

  const isAllSelected = selectedIncs.length > 0 && selectedIncs.length === chamados.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIncs([]);
    } else {
      setSelectedIncs(chamados.map(c => c.inc));
    }
  };

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
        const saudacaoColab = colaborador ? `Olá, ${colaborador}` : `Olá,`;
        
        return `${saudacaoColab}\n\nÉ um prazer poder te ajudar, por isso documentamos todas as informações fornecidas. Destacamos a prioridade e solicitamos um retorno da equipe responsável, para fornecer uma previsão de atendimento para a solução do seu caso.\n\nPara acompanhar o andamento com o status atualizado, basta localizar o ${incTextItnow} no ITNow (https://iberdrola.service-now.com/itnow), diretamente pela aba CONSULTAS. Além disso, caso seja necessário, você pode adicionar mais informações relevantes e novas evidências sobre o erro.\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\n\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`;

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

  const copyToClipboard = async (tipo) => {
    if (selectedIncs.length === 0) {
      alert('Selecione ao menos um INC para gerar o script.');
      return;
    }
    const script = generateText(tipo);
    try {
      await navigator.clipboard.writeText(script);
      setCopiedType(tipo);
      setTimeout(() => setCopiedType(null), 2000); 
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const ButtonCopy = ({ tipo, label }) => {
    const isCopied = copiedType === tipo;
    return (
      <button
        onClick={() => copyToClipboard(tipo)}
        className={`text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border flex items-center justify-center gap-1 active:scale-95 ${
          isCopied 
            ? 'bg-neo-green text-white border-neo-green shadow-lg shadow-neo-green/20' 
            : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
        }`}
      >
        {isCopied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Copiado!
          </>
        ) : label}
      </button>
    );
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        Gerador de Scripts
      </h2>
      
      {/* Seleção de INCs com "Selecionar Todos" */}
      <div className="mb-5 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Selecionar INCs</label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={isAllSelected} 
              onChange={toggleAll}
              className="w-4 h-4 rounded border-slate-600 text-neo-green focus:ring-neo-green focus:ring-offset-slate-900 bg-slate-800"
            />
            Selecionar Todos
          </label>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 py-1">
          {chamados.map(c => (
            <button
              key={c.id}
              onClick={() => toggleInc(c.inc)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedIncs.includes(c.inc) 
                  ? 'bg-neo-green text-white border-neo-green' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {c.inc}
            </button>
          ))}
          {chamados.length === 0 && <span className="text-slate-600 italic text-[10px]">Nenhum chamado disponível</span>}
        </div>
      </div>

      {/* Campos de Entrada */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Equipe Designada</label>
          <input type="text" value={equipe} onChange={(e) => setEquipe(e.target.value)} placeholder="Ex: N3 - Telecom" className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 focus:border-neo-green outline-none transition-all text-sm" />
        </div>
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Colaborador</label>
          <input type="text" value={colaborador} onChange={(e) => setColaborador(e.target.value)} placeholder="Ex: João Silva" className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 focus:border-neo-green outline-none transition-all text-sm" />
        </div>
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Solicitante</label>
          <input type="text" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} placeholder="Ex: @~Inae Franco" className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 focus:border-neo-green outline-none transition-all text-sm" />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <ButtonCopy tipo="ITNOW_EQUIPE" label="Pedir Previsão (Equipe)" />
          <ButtonCopy tipo="ITNOW_COLABORADOR" label="Retorno (Colaborador)" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ButtonCopy tipo="WPP_CURTO" label="Resposta Curta (15m)" />
          <ButtonCopy tipo="WPP_LONGO" label="Resumo Status" />
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;