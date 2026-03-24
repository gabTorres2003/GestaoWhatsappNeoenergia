// src/pages/ScriptsSD.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gerarTemplatesSD, processarSenha, copiarTextoParaClipboard } from '../services/mesaWeb/scriptsSDLogic';

// Importando as logos
import logoNeo from '../assets/logo_neo.png';
import logoMinsait from '../assets/logo_minsait.png';

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

    const toggleCampos = (novaAcao) => setAcao(novaAcao);

    const gerarScripts = () => {
        const dados = {
            acao, registro: registro.trim(), sistema, nome: nome.trim(),
            matricula: matricula.trim(), senha: processarSenha(senha) 
        };
        const { email, chamado } = gerarTemplatesSD(dados);
        setOutEmail(email);
        setOutChamado(chamado);

        const saudacao = nome.trim() ? `Olá, ${nome.trim()}` : `Olá,`;
        setOutNota(`${saudacao}\n\nSeu chamado se encontra na fila de atendimento para atuação.\n\nCordialmente,\nService Desk Neoenergia.`);
    };

    const limparCampos = () => {
        setRegistro(''); setNome(''); setMatricula(''); setSenha('');
        setSistema('GSE (COELBA) - PRD'); setOutEmail(''); setOutChamado(''); setOutNota('');
    };

    const copiarTexto = (texto, tipo) => {
        if (!texto) return;
        copiarTextoParaClipboard(texto).then(() => {
            setCopiado({ ...copiado, [tipo]: true });
            setTimeout(() => setCopiado({ ...copiado, [tipo]: false }), 2000);
        });
    };

    const mostrarSenha = acao !== 'unlock' && acao !== 'disabled' && acao !== 'not_found';

    return (
        <div className="neo-container">
            <style>{`
                :root {
                    --bg-page: #0b1120; --bg-card: #151e2d; --bg-input: #0b1120;
                    --border-color: #2b3648; --border-focus: #4b5e7a;
                    --text-main: #f8fafc; --text-muted: #8b9bb4;
                    --brand-orange: #f95700; --brand-orange-hover: #e04e00;
                    --btn-gray: #334155; --btn-gray-hover: #475569;
                    --success-green: #10b981;
                }
                .neo-container { padding: 30px; color: var(--text-main); font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; max-width: 1400px; margin: 0 auto; }
                
                /* Header atualizado */
                .neo-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 20px; margin-bottom: 30px; }
                .nav-buttons { display: flex; gap: 12px; }
                .btn-nav { text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85em; font-weight: 500; transition: background 0.2s; color: var(--text-main); border: 1px solid var(--border-color); background-color: transparent; }
                .btn-nav:hover { background-color: var(--bg-card); }

                .neo-card { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 25px; margin-bottom: 25px; }
                .form-section { margin-bottom: 25px; }
                .neo-label { display: block; text-transform: uppercase; font-size: 0.7rem; font-weight: 600; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 0.5px; }

                .radio-pill-group { display: flex; flex-wrap: wrap; gap: 12px; }
                .radio-pill { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border: 1px solid var(--border-color); border-radius: 30px; cursor: pointer; font-size: 0.9em; transition: all 0.2s; background-color: transparent; }
                .radio-pill:hover { border-color: var(--border-focus); }
                .radio-pill.active { border-color: var(--text-main); }
                .radio-pill input { display: none; }
                .radio-circle { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid var(--text-muted); display: flex; align-items: center; justify-content: center; }
                .radio-pill.active .radio-circle { border-color: var(--text-main); }
                .radio-pill.active .radio-circle::after { content: ""; width: 6px; height: 6px; background-color: var(--text-main); border-radius: 50%; }

                .neo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .neo-input { width: 100%; background-color: var(--bg-input); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px 15px; color: var(--text-main); font-size: 0.95em; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                .neo-input:focus { border-color: var(--border-focus); }
                .span-2 { grid-column: span 2; }

                .action-row { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-top: 30px; }
                .btn-neo { padding: 14px 24px; border: none; border-radius: 6px; font-weight: 600; font-size: 1em; cursor: pointer; transition: background-color 0.2s; text-align: center; }
                .btn-clear-neo { background-color: var(--btn-gray); color: var(--text-main); }
                .btn-clear-neo:hover { background-color: var(--btn-gray-hover); }
                .btn-generate-neo { background-color: var(--brand-orange); color: white; }
                .btn-generate-neo:hover { background-color: var(--brand-orange-hover); }

                .output-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
                .output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .output-title { font-size: 0.9em; font-weight: 600; color: var(--text-main); }
                .btn-copy-neo { background-color: var(--btn-gray); color: var(--text-main); border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8em; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
                .btn-copy-neo:hover { background-color: var(--btn-gray-hover); }
                .btn-copy-neo.copied { background-color: var(--success-green); }

                .neo-textarea { width: 100%; min-height: 200px; background-color: transparent; border: none; color: var(--text-muted); font-family: inherit; font-size: 0.9em; line-height: 1.5; resize: vertical; outline: none; }
            `}</style>

            {/* Cabeçalho Unificado */}
            <div className="neo-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={logoMinsait} alt="Logo Minsait" style={{ height: '24px', objectFit: 'contain' }} />
                    <span style={{ color: 'var(--border-color)', fontSize: '1.5rem', fontWeight: '300' }}>|</span>
                    <img src={logoNeo} alt="Logo Neoenergia" style={{ height: '32px', objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Automação Minsait Neoenergia</h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gerador de Scripts SD</span>
                    </div>
                </div>
                <div className="nav-buttons">
                    <Link to="/processamento-massa" className="btn-nav">⚡ Processamento Massa</Link>
                    <Link to="/" className="btn-nav">← Voltar ao HUB</Link>
                </div>
            </div>

            <div className="neo-card">
                <div className="form-section">
                    <span className="neo-label">TIPO DE SOLICITAÇÃO:</span>
                    <div className="radio-pill-group">
                        <label className={`radio-pill ${acao === 'reset' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="reset" checked={acao === 'reset'} onChange={() => toggleCampos('reset')} />
                            <div className="radio-circle"></div> Nova Senha (Reset)
                        </label>
                        <label className={`radio-pill ${acao === 'unlock' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="unlock" checked={acao === 'unlock'} onChange={() => toggleCampos('unlock')} />
                            <div className="radio-circle"></div> Desbloqueio
                        </label>
                        <label className={`radio-pill ${acao === 'disabled' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="disabled" checked={acao === 'disabled'} onChange={() => toggleCampos('disabled')} />
                            <div className="radio-circle"></div> Desabilitado
                        </label>
                        <label className={`radio-pill ${acao === 'not_found' ? 'active' : ''}`}>
                            <input type="radio" name="acao" value="not_found" checked={acao === 'not_found'} onChange={() => toggleCampos('not_found')} />
                            <div className="radio-circle"></div> Não Encontrado
                        </label>
                    </div>
                </div>

                <div className="neo-grid">
                    <div>
                        <label className="neo-label">REGISTRO ITNOW</label>
                        <input type="text" className="neo-input" value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="Ex: INC123456" />
                    </div>
                    
                    <div>
                        <label className="neo-label">SISTEMA</label>
                        <select className="neo-input" style={{ cursor: 'pointer' }} value={sistema} onChange={(e) => setSistema(e.target.value)}>
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

                <div className="action-row">
                    <button className="btn-neo btn-clear-neo" onClick={limparCampos}>Limpar Tudo</button>
                    <button className="btn-neo btn-generate-neo" onClick={gerarScripts}>Gerar Scripts</button>
                </div>
            </div>

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