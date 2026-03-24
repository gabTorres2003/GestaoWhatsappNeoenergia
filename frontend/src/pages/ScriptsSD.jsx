import React, { useState } from 'react';
import { gerarTemplatesSD, processarSenha, copiarTextoParaClipboard } from '../services/mesaWeb/scriptsSDLogic';

export default function ScriptsSD() {
    const [acao, setAcao] = useState('reset'); 
    const [registro, setRegistro] = useState('');
    const [sistema, setSistema] = useState('GSE (COELBA) - PRD');
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');

    const [outEmail, setOutEmail] = useState('');
    const [outChamado, setOutChamado] = useState('');
    const [outNota, setOutNota] = useState('');

    const [copiado, setCopiado] = useState({ email: false, chamado: false, nota: false });

    const gerarScripts = () => {
        const dados = {
            acao,
            registro: registro.trim(),
            sistema,
            nome: nome.trim(),
            matricula: matricula.trim(),
            senha: processarSenha(senha) 
        };

        const { email, chamado } = gerarTemplatesSD(dados);
        
        setOutEmail(email);
        setOutChamado(chamado);

        const saudacao = nome.trim() ? `Olá, ${nome.trim()}` : `Olá,`;
        const notaTexto = `${saudacao}\n\nSeu chamado se encontra na fila de atendimento para atuação.\n\nCordialmente,\nService Desk Neoenergia.`;
        setOutNota(notaTexto);
    };

    const limparCampos = () => {
        setRegistro('');
        setNome('');
        setMatricula('');
        setSenha('');
        setSistema('GSE (COELBA) - PRD'); 
        setOutEmail('');
        setOutChamado('');
        setOutNota('');
    };

    const copiarTexto = (texto, tipo) => {
        if (!texto) return;
        copiarTextoParaClipboard(texto).then(() => {
            setCopiado({ ...copiado, [tipo]: true });
            setTimeout(() => {
                setCopiado({ ...copiado, [tipo]: false });
            }, 2000);
        });
    };

    const mostrarSenha = acao !== 'unlock' && acao !== 'disabled' && acao !== 'not_found';

    return (
        <div className="neo-container">
            <style>{`
                /* Variáveis de cores baseadas no layout Access Control */
                :root {
                    --bg-page: #0b1120;
                    --bg-card: #151e2d;
                    --bg-input: #0b1120;
                    --border-color: #2b3648;
                    --border-focus: #4b5e7a;
                    --text-main: #f8fafc;
                    --text-muted: #8b9bb4;
                    --brand-orange: #f95700;
                    --brand-orange-hover: #e04e00;
                    --btn-gray: #334155;
                    --btn-gray-hover: #475569;
                    --success-green: #10b981;
                }

                .neo-container {
                    padding: 30px;
                    color: var(--text-main);
                    font-family: system-ui, -apple-system, sans-serif;
                    box-sizing: border-box;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                /* Header */
                .neo-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .neo-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .nav-buttons {
                    display: flex;
                    gap: 12px;
                }
                .btn-nav {
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 0.85em;
                    font-weight: 500;
                    transition: background 0.2s;
                    color: var(--text-main);
                    border: 1px solid var(--border-color);
                    background-color: transparent;
                }
                .btn-nav:hover {
                    background-color: var(--bg-card);
                }

                /* Cards */
                .neo-card {
                    background-color: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    padding: 25px;
                    margin-bottom: 25px;
                }

                /* Formulário */
                .form-section {
                    margin-bottom: 25px;
                }
                .neo-label {
                    display: block;
                    text-transform: uppercase;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin-bottom: 10px;
                    letter-spacing: 0.5px;
                }

                /* Radio Buttons estilo Pílula */
                .radio-pill-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .radio-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    border: 1px solid var(--border-color);
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 0.9em;
                    transition: all 0.2s;
                    background-color: transparent;
                }
                .radio-pill:hover {
                    border-color: var(--border-focus);
                }
                .radio-pill.active {
                    border-color: var(--text-main);
                }
                .radio-pill input {
                    display: none;
                }
                .radio-circle {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 1.5px solid var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .radio-pill.active .radio-circle {
                    border-color: var(--text-main);
                }
                .radio-pill.active .radio-circle::after {
                    content: "";
                    width: 6px;
                    height: 6px;
                    background-color: var(--text-main);
                    border-radius: 50%;
                }

                /* Inputs */
                .neo-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .neo-input {
                    width: 100%;
                    background-color: var(--bg-input);
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    padding: 12px 15px;
                    color: var(--text-main);
                    font-size: 0.95em;
                    outline: none;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .neo-input:focus {
                    border-color: var(--border-focus);
                }
                .span-2 {
                    grid-column: span 2;
                }

                /* Botões de Ação */
                .action-row {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 20px;
                    margin-top: 30px;
                }
                .btn-neo {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 1em;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    text-align: center;
                }
                .btn-clear-neo {
                    background-color: var(--btn-gray);
                    color: var(--text-main);
                }
                .btn-clear-neo:hover { background-color: var(--btn-gray-hover); }
                
                .btn-generate-neo {
                    background-color: var(--brand-orange);
                    color: white;
                }
                .btn-generate-neo:hover { background-color: var(--brand-orange-hover); }

                /* Outputs */
                .output-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                }
                .output-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .output-title {
                    font-size: 0.9em;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .btn-copy-neo {
                    background-color: var(--btn-gray);
                    color: var(--text-main);
                    border: none;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-copy-neo:hover { background-color: var(--btn-gray-hover); }
                .btn-copy-neo.copied { background-color: var(--success-green); }

                .neo-textarea {
                    width: 100%;
                    min-height: 200px;
                    background-color: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-family: inherit;
                    font-size: 0.9em;
                    line-height: 1.5;
                    resize: vertical;
                    outline: none;
                }
            `}</style>

            {/* Cabeçalho */}
            <div className="neo-header">
                <h2>Scripts Neoenergia</h2>
                <div className="nav-buttons">
                    <a href="/processamento-massa" className="btn-nav">⚡ Processamento em Massa</a>
                    <a href="/home" className="btn-nav">← Voltar ao HUB</a>
                </div>
            </div>

            {/* Card Principal de Formulário */}
            <div className="neo-card">
                
                {/* Tipo de Solicitação (Rádios) */}
                <div className="form-section">
                    <span className="neo-label">TIPO DE SOLICITAÇÃO:</span>
                    <div className="radio-pill-group">
                        <label className={`radio-pill ${acao === 'reset' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="reset" checked={acao === 'reset'} onChange={(e) => setAcao(e.target.value)} />
                            <div className="radio-circle"></div> Nova Senha (Reset)
                        </label>
                        <label className={`radio-pill ${acao === 'unlock' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="unlock" checked={acao === 'unlock'} onChange={(e) => setAcao(e.target.value)} />
                            <div className="radio-circle"></div> Desbloqueio
                        </label>
                        <label className={`radio-pill ${acao === 'disabled' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="disabled" checked={acao === 'disabled'} onChange={(e) => setAcao(e.target.value)} />
                            <div className="radio-circle"></div> Desabilitado
                        </label>
                        <label className={`radio-pill ${acao === 'not_found' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="not_found" checked={acao === 'not_found'} onChange={(e) => setAcao(e.target.value)} />
                            <div className="radio-circle"></div> Não Encontrado
                        </label>
                    </div>
                </div>

                {/* Inputs de Texto */}
                <div className="neo-grid">
                    <div>
                        <label className="neo-label">REGISTRO ITNOW</label>
                        <input type="text" className="neo-input" value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="Ex: INC123456" />
                    </div>
                    
                    <div>
                        <label className="neo-label">SISTEMA</label>
                        <select className="neo-input" value={sistema} onChange={(e) => setSistema(e.target.value)}>
                            <option value="GSE (COELBA) - PRD">GSE (COELBA) - PRD</option>
                            <option value="GSE (COSERN) - PRD">GSE (COSERN) - PRD</option>
                            <option value="GSE (PERNAMBUCO) - PRD">GSE (PERNAMBUCO) - PRD</option>
                            <option value="UE WEB (CS) - PRD">UE WEB (CS) - PRD</option>
                        </select>
                    </div>

                    <div>
                        <label className="neo-label">NOME DO COLABORADOR</label>
                        <input type="text" className="neo-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Santos" />
                    </div>

                    <div>
                        <label className="neo-label">ID DO UTILIZADOR (LOGIN)</label>
                        <input type="text" className="neo-input" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ex: E976850" />
                    </div>

                    {mostrarSenha && (
                        <div className="span-2">
                            <label className="neo-label">NOVA SENHA</label>
                            <input type="text" className="neo-input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Colar senha inteira no padrão do GSE..." />
                        </div>
                    )}
                </div>

                {/* Botões de Ação */}
                <div className="action-row">
                    <button className="btn-neo btn-clear-neo" onClick={limparCampos}>Limpar Tudo</button>
                    <button className="btn-neo btn-generate-neo" onClick={gerarScripts}>Gerar Scripts</button>
                </div>

            </div>

            {/* Cards de Output */}
            <div className="output-grid">
                
                <div className="neo-card" style={{ marginBottom: 0 }}>
                    <div className="output-header">
                        <span className="output-title">Para o E-mail</span>
                        <button className={`btn-copy-neo ${copiado.email ? 'copied' : ''}`} onClick={() => copiarTexto(outEmail, 'email')}>
                            {copiado.email ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea className="neo-textarea" value={outEmail} readOnly placeholder="O script de e-mail aparecerá aqui..."></textarea>
                </div>

                <div className="neo-card" style={{ marginBottom: 0 }}>
                    <div className="output-header">
                        <span className="output-title">Para o Chamado</span>
                        <button className={`btn-copy-neo ${copiado.chamado ? 'copied' : ''}`} onClick={() => copiarTexto(outChamado, 'chamado')}>
                            {copiado.chamado ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea className="neo-textarea" value={outChamado} readOnly placeholder="O script do chamado aparecerá aqui..."></textarea>
                </div>

                <div className="neo-card" style={{ marginBottom: 0 }}>
                    <div className="output-header">
                        <span className="output-title">Nota (15 min)</span>
                        <button className={`btn-copy-neo ${copiado.nota ? 'copied' : ''}`} onClick={() => copiarTexto(outNota, 'nota')}>
                            {copiado.nota ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea className="neo-textarea" value={outNota} readOnly placeholder="A nota do chamado aparecerá aqui..."></textarea>
                </div>

            </div>
        </div>
    );
}