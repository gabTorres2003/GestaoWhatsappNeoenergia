import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AccessControl = () => {
  // Estados dos inputs
  const [acao, setAcao] = useState('novo'); // 'novo' ou 'senha'
  const [ambiente, setAmbiente] = useState('QA');
  const [sapAplicacao, setSapAplicacao] = useState('SAP ECC');
  const [nome, setNome] = useState('');
  const [emailColaborador, setEmailColaborador] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [senhaAc, setSenhaAc] = useState('');
  const [gcoCheck, setGcoCheck] = useState(false);

  // Estados dos outputs
  const [outAssunto, setOutAssunto] = useState('');
  const [outEmail, setOutEmail] = useState('');
  const [outChamado, setOutChamado] = useState('');
  
  // Estado para feedback de cópia
  const [copiedType, setCopiedType] = useState(null);
  const sapOptions = [
    'SAP ECC', 'SAP BW', 'SAP PI/PO', 'SAP GRC', 'SAP Fiori', 'Outro'
  ];

  const limparCampos = () => {
    setNome('');
    setEmailColaborador('');
    setUsuarioId('');
    setSenhaAc('');
    setGcoCheck(false);
    setOutAssunto('');
    setOutEmail('');
    setOutChamado('');
  };

  const gerarScripts = () => {
    const nomeTxt = nome || '[Nome do Colaborador]';
    const emailTxt = emailColaborador || '[E-mail do Colaborador]';
    const idTxt = usuarioId || '[ID do Usuário]';
    const senhaTxt = senhaAc || '[Senha Gerada]';
    
    // 1. Gerar Assunto
    let assunto = '';
    if (acao === 'novo') {
      assunto = `[${ambiente}] Criação de Novo Utilizador - ${nomeTxt}`;
    } else {
      assunto = `[${ambiente}] Reset de Senha - ${nomeTxt}`;
    }
    setOutAssunto(assunto);

    // 2. Gerar E-mail
    let email = `Olá equipa de Access Control,\n\n`;
    if (acao === 'novo') {
      email += `Por favor, solicitamos a criação de acesso para o ambiente ${ambiente} (${sapAplicacao}).\n\n`;
      email += `Nome: ${nomeTxt}\nE-mail: ${emailTxt}\n`;
      if (usuarioId) email += `ID Sugerido/Base: ${idTxt}\n`;
      if (ambiente === 'GCO' && gcoCheck) {
        email += `\n* Nota: O utilizador já possui registo prévio no GCO.\n`;
      }
    } else {
      email += `Por favor, solicitamos o reset de senha para o utilizador abaixo no ambiente ${ambiente} (${sapAplicacao}).\n\n`;
      email += `Nome: ${nomeTxt}\nID do Utilizador: ${idTxt}\nNova Senha (Temporária): ${senhaTxt}\n`;
    }
    email += `\nFicamos a aguardar a confirmação para informar o colaborador.\n\nCordialmente,\nService Desk Neoenergia.`;
    setOutEmail(email);

    // 3. Gerar Chamado
    let chamado = `Solicitação encaminhada para a equipa de Access Control.\n`;
    chamado += `Ação: ${acao === 'novo' ? 'Criação de Acesso' : 'Reset de Senha'}\n`;
    chamado += `Ambiente: ${ambiente}\nAplicação: ${sapAplicacao}\n`;
    chamado += `Colaborador: ${nomeTxt}\n`;
    if (acao === 'senha' || usuarioId) chamado += `ID: ${idTxt}\n`;
    setOutChamado(chamado);
  };

  const copyToClipboard = async (text, type) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const OutputBox = ({ title, content, type }) => (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <button
          onClick={() => copyToClipboard(content, type)}
          className={`text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all border flex items-center gap-1 ${
            copiedType === type 
              ? 'bg-neo-orange text-white border-neo-orange' 
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
          }`}
        >
          {copiedType === type ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <textarea
        readOnly
        value={content}
        className="w-full h-40 p-4 bg-transparent text-slate-300 text-sm outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700"
        placeholder="O script gerado aparecerá aqui..."
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-slate-900 to-[#0f172a] p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header e Navegação */}
        <div className="flex items-center justify-between border-b border-neo-orange pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-neo-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Automação Access Control
          </h2>
          <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-2 px-4 rounded-xl transition-colors border border-slate-600 flex items-center gap-2">
            <span>←</span> Voltar ao HUB
          </Link>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
          
          {/* Seletor de Tipo */}
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-3">Tipo de Solicitação:</span>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'novo', label: 'Novo Utilizador' },
                { id: 'senha', label: 'Nova Senha (Reset)' }
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${acao === opt.id ? 'bg-neo-orange/10 border-neo-orange text-neo-orange font-bold' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  <input type="radio" name="acao" value={opt.id} checked={acao === opt.id} onChange={(e) => setAcao(e.target.value)} className="hidden" />
                  <div className={`w-3 h-3 rounded-full border ${acao === opt.id ? 'bg-neo-orange border-neo-orange' : 'border-slate-500'}`}></div>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Campo Assunto (Em destaque) */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
            <div className="flex-1">
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Assunto do E-mail</label>
              <input type="text" readOnly value={outAssunto} placeholder="O assunto será gerado aqui..." className="w-full bg-transparent text-white font-bold outline-none text-sm" />
            </div>
            <button
              onClick={() => copyToClipboard(outAssunto, 'assunto')}
              className={`text-[11px] font-bold py-2 px-4 rounded-lg transition-all border ${copiedType === 'assunto' ? 'bg-neo-orange text-white border-neo-orange' : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'}`}
            >
              {copiedType === 'assunto' ? 'Copiado!' : 'Copiar Assunto'}
            </button>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Ambiente</label>
              <select value={ambiente} onChange={e => setAmbiente(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-orange outline-none transition-all text-sm appearance-none">
                <option value="QA">Qualidade (QA)</option>
                <option value="DEV">Desenvolvimento (DEV)</option>
                <option value="HANA">SAP (HANA)</option>
                <option value="GCO">GCO/YGCO</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Aplicação SAP</label>
              <select value={sapAplicacao} onChange={e => setSapAplicacao(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-orange outline-none transition-all text-sm appearance-none">
                {sapOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Nome do Colaborador</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Maria Santos" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-orange outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">E-mail do Colaborador</label>
              <input type="text" value={emailColaborador} onChange={e => setEmailColaborador(e.target.value)} placeholder="exemplo@neoenergia.com" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-orange outline-none transition-all text-sm" />
            </div>
            
            <div className={acao === 'novo' ? 'md:col-span-2' : ''}>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">ID do Utilizador</label>
              <input type="text" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} placeholder="Ex: CLB123456" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-orange outline-none transition-all text-sm" />
            </div>

            {/* Campos Condicionais */}
            {acao === 'senha' && (
              <div>
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Senha Gerada</label>
                <input type="text" value={senhaAc} onChange={e => setSenhaAc(e.target.value)} placeholder="Inserir senha temporária" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-orange outline-none transition-all text-sm" />
              </div>
            )}

            {ambiente === 'GCO' && acao === 'novo' && (
              <div className="md:col-span-2 flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                <input 
                  type="checkbox" 
                  id="gcoCheck"
                  checked={gcoCheck} 
                  onChange={e => setGcoCheck(e.target.checked)} 
                  className="w-4 h-4 rounded border-slate-600 text-neo-orange focus:ring-neo-orange bg-slate-800 cursor-pointer" 
                />
                <label htmlFor="gcoCheck" className="text-slate-300 text-sm font-medium cursor-pointer">
                  Utilizador já existente no GCO?
                </label>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-2">
            <button onClick={limparCampos} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all border border-slate-600 active:scale-95">
              Limpar Tudo
            </button>
            <button onClick={gerarScripts} className="flex-[2] bg-neo-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-neo-orange/20 active:scale-95">
              Gerar Scripts
            </button>
          </div>
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OutputBox title="Para o E-mail" content={outEmail} type="email" />
          <OutputBox title="Para o Chamado" content={outChamado} type="chamado" />
        </div>

      </div>
    </div>
  );
};

export default AccessControl;