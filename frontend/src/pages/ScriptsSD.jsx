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

    const toggleCampos = (novaAcao) => {
        setAcao(novaAcao);
    };

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
        <div className="sd-container">
            {/* ESTILOS EMBUTIDOS DIRETAMENTE NO JSX */}
            <style>{`
                .sd-container {
                    padding: 20px;
                    color: #e2e8f0; /* Cor de texto clara para fundo escuro */
                    font-family: system-ui, -apple-system, sans-serif;
                    box-sizing: border-box;
                }
                .sd-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #1e293b;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }
                .sd-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                .btn-nav {
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 0.9em;
                    transition: all 0.2s;
                    color: #e2e8f0;
                }
                .btn-nav.mass {
                    background: #475569;
                }
                .btn-nav.mass:hover { background: #334155; }
                .btn-nav.access:hover { color: #60a5fa; }
                
                .type-selector {
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .radio-group {
                    display: flex;
                    gap: 20px;
                }
                .radio-option {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    font-size: 0.95em;
                }

                .input-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 25px;
                }
                .field label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 0.9em;
                    color: #cbd5e1;
                }
                .field input, .field select {
                    width: 100%;
                    padding: 10px 12px;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 4px;
                    color: #f8fafc;
                    font-size: 0.95em;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .field input:focus, .field select:focus {
                    border-color: #3b82f6;
                }
                .field.span-2 {
                    grid-column: span 2;
                }

                .action-buttons {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 30px;
                }
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-clear {
                    background-color: #f1f5f9;
                    color: #0f172a;
                }
                .btn-clear:hover { background-color: #e2e8f0; }
                .btn-generate {
                    background-color: #2563eb;
                    color: white;
                }
                .btn-generate:hover { background-color: #1d4ed8; }

                .output-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                }
                .output-box {
                    display: flex;
                    flex-direction: column;
                }
                .output-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .output-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    color: #f8fafc;
                }
                .btn-copy {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85em;
                    color: white;
                    transition: background-color 0.2s;
                }
                .output-box textarea {
                    width: 100%;
                    min-height: 250px;
                    padding: 12px;
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 4px;
                    color: #f8fafc;
                    resize: vertical;
                    font-family: inherit;
                    line-height: 1.5;
                    outline: none;
                }
                .output-box textarea:focus {
                    border-color: #3b82f6;
                }
            `}</style>

            {/* Cabeçalho */}
            <div className="sd-header">
                <h2>Scripts Neoenergia</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="/processamento-massa" className="btn-nav mass">⚡ Processamento em Massa</a>
                    <a href="/access-control" className="btn-nav access">Access Control →</a>
                </div>
            </div>

            {/* Radio Buttons */}
            <div className="type-selector">
                <span style={{ fontWeight: '600' }}>Tipo de Solicitação:</span>
                <div className="radio-group">
                    <label className="radio-option">
                        <input type="radio" name="acao" value="reset" checked={acao === 'reset'} onChange={() => toggleCampos('reset')} /> Reset
                    </label>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="unlock" checked={acao === 'unlock'} onChange={() => toggleCampos('unlock')} /> Desbloqueio
                    </label>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="disabled" checked={acao === 'disabled'} onChange={() => toggleCampos('disabled')} /> Desabilitado
                    </label>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="not_found" checked={acao === 'not_found'} onChange={() => toggleCampos('not_found')} /> Não Encontrado
                    </label>
                </div>
            </div>

            {/* Formulário */}
            <div className="input-grid">
                <div className="field">
                    <label>Registro ITNOW:</label>
                    <input type="text" value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="Ex: INC123456" />
                </div>
                
                <div className="field">
                    <label>Sistema:</label>
                    <select value={sistema} onChange={(e) => setSistema(e.target.value)}>
                        <option value="GSE (COELBA) - PRD">GSE (COELBA) - PRD</option>
                        <option value="GSE (COSERN) - PRD">GSE (COSERN) - PRD</option>
                        <option value="GSE (PERNAMBUCO) - PRD">GSE (PERNAMBUCO) - PRD</option>
                        <option value="UE WEB (CS) - PRD">UE WEB (CS) - PRD</option>
                    </select>
                </div>

                <div className="field">
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
                </div>

                <div className="field">
                    <label>Login:</label>
                    <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="E976850" />
                </div>

                {mostrarSenha && (
                    <div className="field span-2">
                        <label>Nova Senha:</label>
                        <input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Colar senha inteira no padrão do GSE" />
                    </div>
                )}
            </div>

            {/* Botões de Ação */}
            <div className="action-buttons">
                <button className="btn btn-clear" onClick={limparCampos}>Limpar</button>
                <button className="btn btn-generate" onClick={gerarScripts}>Gerar Scripts</button>
            </div>

            {/* Áreas de Texto (Saídas) */}
            <div className="output-grid">
                <div className="output-box">
                    <div className="output-header">
                        <h3>E-mail</h3>
                        <button 
                            className="btn-copy" 
                            style={{ backgroundColor: copiado.email ? '#16a34a' : '#2563eb' }}
                            onClick={() => copiarTexto(outEmail, 'email')}
                        >
                            {copiado.email ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea value={outEmail} readOnly placeholder="O script de e-mail aparecerá aqui..."></textarea>
                </div>

                <div className="output-box">
                    <div className="output-header">
                        <h3>Chamado</h3>
                        <button 
                            className="btn-copy" 
                            style={{ backgroundColor: copiado.chamado ? '#16a34a' : '#2563eb' }}
                            onClick={() => copiarTexto(outChamado, 'chamado')}
                        >
                            {copiado.chamado ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea value={outChamado} readOnly placeholder="O script do chamado aparecerá aqui..."></textarea>
                </div>

                <div className="output-box">
                    <div className="output-header">
                        <h3>Nota (15 min)</h3>
                        <button 
                            className="btn-copy" 
                            style={{ backgroundColor: copiado.nota ? '#16a34a' : '#2563eb' }}
                            onClick={() => copiarTexto(outNota, 'nota')}
                        >
                            {copiado.nota ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea value={outNota} readOnly placeholder="A nota do chamado aparecerá aqui..."></textarea>
                </div>
            </div>
        </div>
    );
}