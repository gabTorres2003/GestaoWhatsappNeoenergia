import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProcessamentoMassa = () => {
  // Estados Gerais
  const [isImporting, setIsImporting] = useState(true);
  const [rawData, setRawData] = useState('');
  const [fila, setFila] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Estados do Chamado Atual
  const [acao, setAcao] = useState('unlock'); // 'unlock' ou 'reset'
  const [senha, setSenha] = useState('');
  
  // Estados dos Outputs
  const [outEmail, setOutEmail] = useState('');
  const [outChamado, setOutChamado] = useState('');
  const [outNota, setOutNota] = useState('');
  const [copiedType, setCopiedType] = useState(null);

  // Analisador (Parser) da Tabela do ServiceNow
  const processarTexto = () => {
    if (!rawData.trim()) {
      alert('Por favor, cola a tabela do ServiceNow antes de iniciar.');
      return;
    }

    const linhas = rawData.split('\n');
    const novaFila = [];

    linhas.forEach((linha) => {
      // Ignorar linhas vazias
      if (!linha.trim()) return;
      const colunas = linha.split('\t').map(c => c.trim());
      const incIndex = colunas.findIndex(c => c.startsWith('INC'));
      
      if (incIndex !== -1) {
        novaFila.push({
          id: Math.random().toString(36).substring(7),
          inc: colunas[incIndex] || '',
          sistema: colunas.length > incIndex + 1 ? colunas[incIndex + 1] : 'Sistema Desconhecido',
          nome: colunas.length > incIndex + 2 ? colunas[incIndex + 2] : '',
          login: colunas.length > incIndex + 3 ? colunas[incIndex + 3] : '',
          data: colunas.length > incIndex + 4 ? colunas[incIndex + 4] : '',
          tratado: false
        });
      }
    });

    if (novaFila.length === 0) {
      alert('Não foram encontrados números de INC válidos no texto colado. Verifica o formato.');
      return;
    }

    setFila(novaFila);
    setCurrentIndex(0);
    setIsImporting(false);
  };

  const chamadoAtual = fila[currentIndex] || {};

  // Atualiza os dados do chamado na fila quando o utilizador edita os campos manualmente
  const updateChamadoAtual = (campo, valor) => {
    const novaFila = [...fila];
    novaFila[currentIndex] = { ...novaFila[currentIndex], [campo]: valor };
    setFila(novaFila);
  };

  const toggleTratado = () => {
    updateChamadoAtual('tratado', !chamadoAtual.tratado);
  };

  // Navegação
  const navegar = (direcao) => {
    let novoIndice = currentIndex + direcao;
    if (novoIndice >= 0 && novoIndice < fila.length) {
      setCurrentIndex(novoIndice);
    }
  };

  // Lógica de Geração de Scripts (Semelhante ao ScriptsSD)
  const gerarScripts = () => {
    if (fila.length === 0) return;

    const sys = chamadoAtual.sistema || '[Sistema]';
    const nom = chamadoAtual.nome || '[Nome]';
    const log = chamadoAtual.login || '[Login]';
    const inc = chamadoAtual.inc || '[INC]';

    const acaoTexto = acao === 'reset' ? 'resetado com nova senha' : 'desbloqueado';

    // 1. E-mail
    let email = `Olá, ${nom}\n\n`;
    email += `Conforme solicitado no chamado ${inc}, informamos que o seu acesso ao sistema ${sys} foi ${acaoTexto}.\n\nLogin: ${log}`;
    if (acao === 'reset' && senha) {
      email += `\nSenha temporária: ${senha}`;
    }
    email += `\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contacto pelos Canais de Atendimento.\n\nCordialmente,\nService Desk Neoenergia.`;
    setOutEmail(email);

    // 2. Chamado
    let chamadoTxt = `Atendimento realizado.\nSistema: ${sys}\nUtilizador: ${nom}\nLogin: ${log}\nAção: Acesso ${acaoTexto}.`;
    setOutChamado(chamadoTxt);

    // 3. Nota
    let notaTxt = `Em atendimento. A realizar verificação e procedimentos de ${acao === 'unlock' ? 'desbloqueio' : 'reset'} para o login ${log} no sistema ${sys}. Retornamos em breve com a atualização.`;
    setOutNota(notaTxt);
  };

  // Gera os scripts automaticamente sempre que muda de chamado ou de parâmetros
  useEffect(() => {
    gerarScripts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, fila, acao, senha]);

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
        <button onClick={() => copyToClipboard(content, type)} className={`text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all border flex items-center gap-1 ${copiedType === type ? 'bg-purple-500 text-white border-purple-500' : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'}`}>
          {copiedType === type ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <textarea readOnly value={content} className="w-full h-32 p-4 bg-transparent text-slate-300 text-sm outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700" placeholder="A aguardar geração..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-slate-900 to-[#0f172a] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header e Navegação */}
        <div className="flex items-center justify-between border-b border-purple-500 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            Processamento em Massa
          </h2>
          <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-2 px-4 rounded-xl transition-colors border border-slate-600 flex items-center gap-2">
            <span>←</span> Voltar ao HUB
          </Link>
        </div>

        {isImporting ? (
          /* ECRÃ DE IMPORTAÇÃO */
          <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-xl space-y-4 max-w-3xl mx-auto mt-10 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Importar Fila do ServiceNow</h3>
            <p className="text-slate-400 text-sm">Copia as linhas da tabela no ServiceNow (incluindo o INC) e cola na área abaixo.</p>
            
            <textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Cola aqui a tabela..."
              className="w-full h-48 bg-slate-900 text-slate-300 p-4 rounded-xl border-2 border-dashed border-slate-600 focus:border-purple-500 outline-none resize-none font-mono text-sm scrollbar-thin scrollbar-thumb-slate-700"
            />
            
            <button onClick={processarTexto} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95 text-lg">
              Iniciar Automação
            </button>
          </div>
        ) : (
          /* ECRÃ DE FILA / PROCESSAMENTO */
          <div className="space-y-6">
            
            {/* Barra de Navegação da Fila */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
              <button onClick={() => navegar(-1)} disabled={currentIndex === 0} className="px-6 py-2 bg-slate-700 disabled:opacity-50 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
                ← Anterior
              </button>
              
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-purple-400">
                    {currentIndex + 1} <span className="text-slate-500 text-sm font-medium">de {fila.length}</span>
                  </span>
                  {chamadoAtual.tratado && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Tratado
                    </span>
                  )}
                </div>
                <button onClick={toggleTratado} className="text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-1 rounded-lg transition-colors">
                  {chamadoAtual.tratado ? 'Desmarcar Tratado' : 'Marcar como Tratado ✓'}
                </button>
              </div>

              <button onClick={() => navegar(1)} disabled={currentIndex === fila.length - 1} className="px-6 py-2 bg-slate-700 disabled:opacity-50 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
                Próximo →
              </button>
            </div>

            {/* Cartão de Detalhes do Chamado */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-xl ${chamadoAtual.tratado ? 'bg-slate-800/50 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
              
              {/* Tipo de Ação */}
              <div className="mb-6 pb-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Ação:</span>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="acao" value="unlock" checked={acao === 'unlock'} onChange={() => setAcao('unlock')} className="w-4 h-4 text-purple-500 bg-slate-900 border-slate-600 focus:ring-purple-500" />
                    <span className={`text-sm font-bold ${acao === 'unlock' ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'}`}>Desbloqueio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="acao" value="reset" checked={acao === 'reset'} onChange={() => setAcao('reset')} className="w-4 h-4 text-purple-500 bg-slate-900 border-slate-600 focus:ring-purple-500" />
                    <span className={`text-sm font-bold ${acao === 'reset' ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'}`}>Reset</span>
                  </label>
                </div>
                <button onClick={() => setIsImporting(true)} className="text-xs text-slate-500 hover:text-purple-400 font-bold transition-colors">
                  ↻ Carregar Nova Lista
                </button>
              </div>

              {/* Grelha de Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">INC</label>
                  <input type="text" readOnly value={chamadoAtual.inc || ''} className="w-full bg-slate-900/50 text-slate-300 font-mono font-bold p-3 rounded-xl border border-slate-700 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Aplicação</label>
                  <input type="text" value={chamadoAtual.sistema || ''} onChange={(e) => updateChamadoAtual('sistema', e.target.value)} className="w-full bg-slate-900 text-white font-bold p-3 rounded-xl border border-slate-700 focus:border-purple-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Data / Criado em</label>
                  <input type="text" value={chamadoAtual.data || ''} onChange={(e) => updateChamadoAtual('data', e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-purple-500 outline-none transition-all text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Colaborador</label>
                  <input type="text" value={chamadoAtual.nome || ''} onChange={(e) => updateChamadoAtual('nome', e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-purple-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="text-orange-500/80 text-[10px] font-bold uppercase tracking-wider flex justify-between mb-1">
                    <span>Login</span>
                    <span className="text-[9px]">(Verificar padrão ex: ELK)</span>
                  </label>
                  <input type="text" value={chamadoAtual.login || ''} onChange={(e) => updateChamadoAtual('login', e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded-xl border border-orange-500/50 focus:border-orange-500 outline-none transition-all text-sm font-mono" />
                </div>
                
                {acao === 'reset' && (
                  <div className="md:col-span-3">
                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Senha Gerada</label>
                    <input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Cola a senha padrão ou digita a nova senha aqui..." className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-purple-500 outline-none transition-all text-sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <OutputBox title="E-mail" content={outEmail} type="email" />
              <OutputBox title="Chamado" content={outChamado} type="chamado" />
              <OutputBox title="Nota (15 min)" content={outNota} type="nota" />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProcessamentoMassa;