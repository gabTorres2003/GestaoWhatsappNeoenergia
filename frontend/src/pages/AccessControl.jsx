// src/pages/AccessControl.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SAPS_DATABASE, gerarTemplatesAC, copiarTextoParaClipboard } from '../services/mesaWeb/accessControlLogic';

// Importando as logos
import logoNeo from '../assets/logo_neo.png';
import logoMinsait from '../assets/logo_minsait.png';

export default function AccessControl() {
    const [acao, setAcao] = useState('novo');
    const [ambiente, setAmbiente] = useState('QA');
    const [aplicacao, setAplicacao] = useState('');
    const [nome, setNome] = useState('');
    const [emailColaborador, setEmailColaborador] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [senha, setSenha] = useState('');
    const [gcoExistente, setGcoExistente] = useState(false);

    const [outAssunto, setOutAssunto] = useState('Controle de Acessos - Novo Usuário');
    const [outEmail, setOutEmail] = useState('');
    const [outChamado, setOutChamado] = useState('');
    const [copiado, setCopiado] = useState({ assunto: false, email: false, chamado: false });

    useEffect(() => {
        setOutAssunto(acao === 'novo' ? 'Controle de Acessos - Novo Usuário' : 'Controle de Acessos - Nova Senha');
    }, [acao]);

    useEffect(() => {
        const apps = SAPS_DATABASE[ambiente] || [];
        if (apps.length > 0) {
            setAplicacao(apps[0]);
        } else {
            setAplicacao('');
        }
    }, [ambiente]);

    const gerarScripts = () => {
        const dados = {
            acao, ambiente, aplicacao,
            nome: nome.trim().toUpperCase(),
            email_colaborador: emailColaborador.trim().toLowerCase(),
            usuario_id: usuarioId.trim().toUpperCase(),
            senha: senha.trim(),
            gcoExistente
        };
        const templates = gerarTemplatesAC(dados);
        setOutEmail(templates.email);
        setOutChamado(templates.chamado);
    };

    const limparCampos = () => {
        setAcao('novo'); setAmbiente('QA'); setNome('');
        setEmailColaborador(''); setUsuarioId(''); setSenha('');
        setGcoExistente(false); setOutEmail(''); setOutChamado('');
    };

    const lidarComCopia = (texto, tipo) => {
        if (!texto) return;
        copiarTextoParaClipboard(texto).then(() => {
            setCopiado({ ...copiado, [tipo]: true });
            setTimeout(() => setCopiado({ ...copiado, [tipo]: false }), 2000);
        });
    };

    const isGco = ambiente === 'GCO' || (aplicacao && aplicacao.toUpperCase().includes('GCO'));
    const mostrarCampoId = acao !== 'senha';
    const mostrarCampoSenha = acao !== 'novo';
    const mostrarOpcaoGco = isGco && acao === 'novo';

    const appsDisponiveis = SAPS_DATABASE[ambiente] || [];

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
                .neo-input:read-only { background-color: var(--bg-card); border-color: transparent; color: var(--text-muted); }
                
                .neo-select {
                    appearance: none; -webkit-appearance: none; -moz-appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b9bb4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat; background-position: right 15px center; background-size: 16px; padding-right: 40px; cursor: pointer;
                }
                .neo-select:hover { border-color: var(--border-focus); }
                .neo-select option { background-color: var(--bg-page); color: var(--text-main); }

                .span-2 { grid-column: span 2; }
                .subject-box { display: flex; gap: 10px; margin-bottom: 25px; background: var(--bg-input); padding: 5px; border-radius: 8px; border: 1px solid var(--border-color); }
                .subject-box input { border: none; background: transparent; flex: 1; padding: 10px 15px; color: var(--text-main); font-weight: 600; outline: none; }
                
                .checkbox-container { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
                .checkbox-container input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--brand-orange); cursor: pointer; }
                .checkbox-container label { font-size: 0.9em; color: var(--text-main); cursor: pointer; }

                .action-row { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-top: 30px; }
                .btn-neo { padding: 14px 24px; border: none; border-radius: 6px; font-weight: 600; font-size: 1em; cursor: pointer; transition: background-color 0.2s; text-align: center; }
                .btn-clear-neo { background-color: var(--btn-gray); color: var(--text-main); }
                .btn-clear-neo:hover { background-color: var(--btn-gray-hover); }
                .btn-generate-neo { background-color: var(--brand-orange); color: white; }
                .btn-generate-neo:hover { background-color: var(--brand-orange-hover); }

                .output-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
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
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>🛡️ Access Control Scripts</h2>
                    </div>
                </div>
                <div className="nav-buttons">
                    <Link to="/" className="btn-nav">← Voltar ao HUB</Link>
                </div>
            </div>

            <div className="neo-card">
                
                <div className="form-section">
                    <span className="neo-label">TIPO DE SOLICITAÇÃO:</span>
                    <div className="radio-pill-group">
                        <label className={`radio-pill ${acao === 'novo' ? 'active' : ''}`}>
                            <input type="radio" value="novo" checked={acao === 'novo'} onChange={(e) => setAcao(e.target.value)} />
                            <div className="radio-circle"></div> Novo Utilizador
                        </label>
                        <label className={`radio-pill ${acao === 'senha' ? 'active' : ''}`}>
                            <input type="radio" value="senha" checked={acao === 'senha'} onChange={(e) => setAcao(e.target.value)} />
                            <div className="radio-circle"></div> Nova Senha (Reset)
                        </label>
                    </div>
                </div>

                <span className="neo-label">ASSUNTO DO E-MAIL</span>
                <div className="subject-box">
                    <input type="text" value={outAssunto} readOnly />
                    <button className={`btn-copy-neo ${copiado.assunto ? 'copied' : ''}`} onClick={() => lidarComCopia(outAssunto, 'assunto')}>
                        {copiado.assunto ? 'Copiado!' : 'Copiar Assunto'}
                    </button>
                </div>

                <div className="neo-grid">
                    <div>
                        <label className="neo-label">AMBIENTE</label>
                        <select className="neo-input neo-select" value={ambiente} onChange={(e) => setAmbiente(e.target.value)}>
                            <option value="QA">Qualidade (QA)</option>
                            <option value="DEV">Desenvolvimento (DEV)</option>
                            <option value="HANA">SAP (HANA)</option>
                            <option value="GCO">GCO/YGCO</option>
                            <option value="SGD">SGD</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="neo-label">APLICAÇÃO SAP</label>
                        <select className="neo-input neo-select" value={aplicacao} onChange={(e) => setAplicacao(e.target.value)}>
                            {appsDisponiveis.map(app => (
                                <option key={app} value={app}>{app}</option>
                            ))}
                            {appsDisponiveis.length === 0 && <option value="">Nenhuma aplicação encontrada</option>}
                        </select>
                    </div>

                    <div>
                        <label className="neo-label">NOME DO COLABORADOR</label>
                        <input type="text" className="neo-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Santos" />
                    </div>

                    <div>
                        <label className="neo-label">E-MAIL DO COLABORADOR</label>
                        <input type="email" className="neo-input" value={emailColaborador} onChange={(e) => setEmailColaborador(e.target.value)} placeholder="exemplo@neoenergia.com" />
                    </div>

                    {mostrarCampoId && (
                        <div className="span-2">
                            <label className="neo-label">ID DO UTILIZADOR</label>
                            <input type="text" className="neo-input" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} placeholder="Ex: CLB123456" />
                        </div>
                    )}

                    {mostrarCampoSenha && (
                        <div className="span-2">
                            <label className="neo-label">SENHA GERADA</label>
                            <input type="text" className="neo-input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite a senha..." />
                        </div>
                    )}

                    {mostrarOpcaoGco && (
                        <div className="span-2 checkbox-container">
                            <input type="checkbox" id="gco_check" checked={gcoExistente} onChange={(e) => setGcoExistente(e.target.checked)} />
                            <label htmlFor="gco_check">Usuário já existente no GCO?</label>
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
                        <button className={`btn-copy-neo ${copiado.email ? 'copied' : ''}`} onClick={() => lidarComCopia(outEmail, 'email')}>
                            {copiado.email ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea className="neo-textarea" value={outEmail} readOnly placeholder="O script gerado aparecerá aqui..."></textarea>
                </div>

                <div className="neo-card" style={{ marginBottom: 0 }}>
                    <div className="output-header">
                        <span className="output-title">Para o Chamado</span>
                        <button className={`btn-copy-neo ${copiado.chamado ? 'copied' : ''}`} onClick={() => lidarComCopia(outChamado, 'chamado')}>
                            {copiado.chamado ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea className="neo-textarea" value={outChamado} readOnly placeholder="O script gerado aparecerá aqui..."></textarea>
                </div>
            </div>
        </div>
    );
}