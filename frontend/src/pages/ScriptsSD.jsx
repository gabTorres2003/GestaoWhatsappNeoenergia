import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ScriptsSD = () => {
  // Estados dos inputs
  const [acao, setAcao] = useState('reset');
  const [registro, setRegistro] = useState('');
  const [sistema, setSistema] = useState('GSE (COELBA) - PRD');
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  // Estados dos outputs
  const [outEmail, setOutEmail] = useState('');
  const [outChamado, setOutChamado] = useState('');
  const [outNota, setOutNota] = useState('');
  
  // Estado para feedback de cópia
  const [copiedType, setCopiedType] = useState(null);

  const limparCampos = () => {
    setRegistro('');
    setNome('');
    setLogin('');
    setSenha('');
    setOutEmail('');
    setOutChamado('');
    setOutNota('');
  };

  const gerarScripts = () => {
    let acaoTexto = "";
    switch(acao) {
      case 'reset': acaoTexto = 'resetado com nova senha'; break;
      case 'unlock': acaoTexto = 'desbloqueado'; break;
      case 'disabled': acaoTexto = 'desabilitado conforme regra de negócio'; break;
      case 'not_found': acaoTexto = 'não encontrado na base de dados'; break;
      default: acaoTexto = '';
    }

    const regTxt = registro || '[INC]';
    const nomeTxt = nome || '[Nome]';
    const loginTxt = login || '[Login]';

    // 1. Gerar E-mail
    let email = `Olá, ${nomeTxt}\n\n`;
    if (acao === 'not_found') {
      email += `Conforme verificação no chamado ${regTxt}, informamos que o login ${loginTxt} não foi encontrado no sistema ${sistema}.\nPor favor, valide as informações e abra um novo chamado se necessário.`;
    } else {
      email += `Conforme solicitado no chamado ${regTxt}, informamos que seu acesso ao sistema ${sistema} foi ${acaoTexto}.\n\nLogin: ${loginTxt}`;
      if (acao === 'reset' && senha) {
        email += `\nSenha temporária: ${senha}`;
      }
    }
    email += `\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contato pelos Canais de Atendimento.\n\nCordialmente,\nService Desk Neoenergia.`;
    setOutEmail(email);

    // 2. Gerar Chamado
    let chamado = `Atendimento realizado.\nSistema: ${sistema}\nUsuário: ${nomeTxt}\nLogin: ${loginTxt}\nAção: Acesso ${acaoTexto}.`;
    setOutChamado(chamado);

    // 3. Gerar Nota (15 min)
    let nota = `Em atendimento. Realizando verificação e procedimentos de ${acao} para o login ${loginTxt} no sistema ${sistema}. Retornamos em breve com a atualização.`;
    setOutNota(nota);
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
              ? 'bg-neo-blue text-white border-neo-blue' 
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
        <div className="flex items-center justify-between border-b border-neo-blue pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-neo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
            Scripts de Acesso
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
                { id: 'reset', label: 'Reset' },
                { id: 'unlock', label: 'Desbloqueio' },
                { id: 'disabled', label: 'Desabilitado' },
                { id: 'not_found', label: 'Não Encontrado' }
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${acao === opt.id ? 'bg-neo-blue/10 border-neo-blue text-neo-blue font-bold' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  <input type="radio" name="acao" value={opt.id} checked={acao === opt.id} onChange={(e) => setAcao(e.target.value)} className="hidden" />
                  <div className={`w-3 h-3 rounded-full border ${acao === opt.id ? 'bg-neo-blue border-neo-blue' : 'border-slate-500'}`}></div>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Registro ITNOW</label>
              <input type="text" value={registro} onChange={e => setRegistro(e.target.value)} placeholder="Ex: INC123456" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-blue outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Sistema</label>
              <select value={sistema} onChange={e => setSistema(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-blue outline-none transition-all text-sm appearance-none">
                <option value="GSE (COELBA) - PRD">GSE (COELBA) - PRD</option>
                <option value="GSE (COSERN) - PRD">GSE (COSERN) - PRD</option>
                <option value="GSE (PERNAMBUCO) - PRD">GSE (PERNAMBUCO) - PRD</option>
                <option value="UE WEB (CS) - PRD">UE WEB (CS) - PRD</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Nome Completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João da Silva" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-blue outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Login</label>
              <input type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Ex: E976850" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-blue outline-none transition-all text-sm" />
            </div>
            
            {/* Campo de Senha condicional (só aparece no Reset) */}
            {acao === 'reset' && (
              <div className="md:col-span-2">
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Nova Senha</label>
                <input type="text" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Colar senha inteira no padrão do GSE" className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-neo-blue outline-none transition-all text-sm" />
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-2">
            <button onClick={limparCampos} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all border border-slate-600 active:scale-95">
              Limpar Tudo
            </button>
            <button onClick={gerarScripts} className="flex-[2] bg-neo-blue hover:bg-neo-blue-hover text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-neo-blue/20 active:scale-95">
              Gerar Scripts
            </button>
          </div>
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OutputBox title="E-mail" content={outEmail} type="email" />
          <OutputBox title="Chamado" content={outChamado} type="chamado" />
          <OutputBox title="Nota (15 min)" content={outNota} type="nota" />
        </div>

      </div>
    </div>
  );
};

export default ScriptsSD;