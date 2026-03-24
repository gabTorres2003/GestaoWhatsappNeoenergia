import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { processarTabelaServiceNow } from '../services/mesaWeb/processamentoMassaLogic';
import { gerarTemplatesSD, processarSenha, copiarTextoParaClipboard } from '../services/mesaWeb/scriptsSDLogic';
import logoNeo from '../assets/logo_neo.png';
import logoMinsait from '../assets/logo_minsait.png';

export default function ProcessamentoMassa() {
    // Estados Gerais
    const [viewImport, setViewImport] = useState(true);
    const [rawData, setRawData] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    // Estados da Fila
    const [fila, setFila] = useState([]);
    const [indexAtual, setIndexAtual] = useState(0);

    // Estados de Saída (Textos Gerados)
    const [outEmail, setOutEmail] = useState('');
    const [outChamado, setOutChamado] = useState('');
    const [outNota, setOutNota] = useState('');
    const [copiado, setCopiado] = useState({ email: false, chamado: false, nota: false });

    const itemAtual = fila[indexAtual];

    // Lógica de Importação
    const handleImportar = () => {
        setErrorMsg('');
        const resultado = processarTabelaServiceNow(rawData);
        
        if (!resultado.success) {
            setErrorMsg(resultado.error);
            return;
        }

        setFila(resultado.fila);
        setIndexAtual(0);
        setViewImport(false);
    };

    // Auto-gerador de Scripts: Roda sempre que o itemAtual ou seus campos mudam
    useEffect(() => {
        if (!itemAtual) return;

        // Gera a Nota
        const saudacao = itemAtual.nome ? `Olá, ${itemAtual.nome}` : 'Olá,';
        setOutNota(`${saudacao}\n\nSeu chamado se encontra na fila de atendimento para atuação.\n\nCordialmente,\nService Desk Neoenergia.`);

        // Se não for prioritário, não gera Email/Chamado
        if (!itemAtual.isPriority) {
            setOutEmail('');
            setOutChamado('');
            return;
        }

        // Gera Email e Chamado usando a mesma lógica do ScriptsSD
        const dadosSD = {
            acao: itemAtual.acao,
            registro: itemAtual.registro,
            sistema: itemAtual.sistema,
            nome: itemAtual.nome,
            matricula: itemAtual.matricula,
            senha: processarSenha(itemAtual.senha)
        };

        const { email, chamado } = gerarTemplatesSD(dadosSD);
        setOutEmail(email);
        setOutChamado(chamado);

    }, [itemAtual]);

    // Atualiza dados do item atual no estado da fila (Imutabilidade React)
    const atualizarItemAtual = (campo, valor) => {
        const novaFila = [...fila];
        novaFila[indexAtual] = { ...novaFila[indexAtual], [campo]: valor };
        setFila(novaFila);
    };

    // Navegação
    const navegar = (direcao) => {
        const novoIndex = indexAtual + direcao;
        if (novoIndex >= 0 && novoIndex < fila.length) setIndexAtual(novoIndex);
    };

    const navegarSeletivo = (direcao) => {
        let i = indexAtual + direcao;
        while (i >= 0 && i < fila.length) {
            if (fila[i].isPriority) {
                setIndexAtual(i);
                return;
            }
            i += direcao;
        }
        alert('Fim da fila de chamados técnicos (GSE/UE).');
    };

    const lidarComCopia = (texto, tipo) => {
        if (!texto) return;
        copiarTextoParaClipboard(texto).then(() => {
            setCopiado({ ...copiado, [tipo]: true });
            setTimeout(() => setCopiado({ ...copiado, [tipo]: false }), 2000);
        });
    };

    return (
        <div className="neo-container">
            <style>{`
                /* MESMA BASE DO ACCESS CONTROL */
                :root {
                    --bg-page: #0b1120; --bg-card: #151e2d; --bg-input: #0b1120;
                    --border-color: #2b3648; --border-focus: #4b5e7a;
                    --text-main: #f8fafc; --text-muted: #8b9bb4;
                    --brand-orange: #f95700; --brand-orange-hover: #e04e00;
                    --btn-gray: #334155; --btn-gray-hover: #475569;
                    --success-green: #10b981;
                }
                .neo-container { padding: 30px; color: var(--text-main); font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; max-width: 1400px; margin: 0 auto; }
                .neo-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 20px; margin-bottom: 30px; }
                
                /* Estilo genérico para o título no cabeçalho unificado */
                .neo-header-generic-title { margin: 0 0 0 10px; font-size: 1.5rem; font-weight: 600; }
                
                .btn-nav { text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85em; font-weight: 500; transition: background 0.2s; color: var(--text-main); border: 1px solid var(--border-color); background-color: transparent; }
                .btn-nav:hover { background-color: var(--bg-card); }
                .neo-card { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 25px; margin-bottom: 25px; }
                .neo-label { display: block; text-transform: uppercase; font-size: 0.7rem; font-weight: 600; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 0.5px; }
                .neo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .neo-input { width: 100%; background-color: var(--bg-input); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px 15px; color: var(--text-main); font-size: 0.95em; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                .neo-input:focus { border-color: var(--border-focus); }
                .neo-input:read-only { background-color: var(--bg-card); color: var(--text-muted); border-color: transparent; }
                .span-2 { grid-column: span 2; }
                
                /* ESTILOS ESPECÍFICOS PROCESSAMENTO MASSA */
                .error-box { background-color: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #fca5a5; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; }
                .import-area { width: 100%; min-height: 200px; background-color: var(--bg-input); border: 2px dashed var(--border-focus); border-radius: 8px; padding: 15px; color: var(--text-main); outline: none; margin-bottom: 20px; resize: vertical; }
                
                .nav-queue-container { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; background: var(--bg-input); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); }
                .nav-row { display: flex; justify-content: space-between; align-items: center; }
                .btn-queue { background-color: var(--btn-gray); color: var(--text-main); border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-queue:hover { background-color: var(--btn-gray-hover); }
                .btn-queue-priority { background-color: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); flex: 1; text-align: center; }
                .btn-queue-priority:hover { background-color: rgba(59, 130, 246, 0.2); }
                
                .counter-area { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .counter-text { font-size: 1.2em; font-weight: bold; color: var(--brand-orange); }
                .btn-concluir { background-color: transparent; border: 1px solid var(--border-focus); color: var(--text-muted); padding: 6px 16px; border-radius: 20px; font-size: 0.8em; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .btn-concluir.tratado { background-color: rgba(16, 185, 129, 0.1); border-color: var(--success-green); color: var(--success-green); }

                /* Tags de Sistema */
                .tag-sys { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; letter-spacing: 0.5px; }
                .tag-gse { background-color: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
                .tag-ue { background-color: rgba(249, 115, 22, 0.15); color: #fdba74; border: 1px solid rgba(249, 115, 22, 0.3); }
                .tag-nota { background-color: var(--btn-gray); color: var(--text-muted); }

                /* Outputs */
                .output-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
                .output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .btn-copy-neo { background-color: var(--btn-gray); color: var(--text-main); border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8em; cursor: pointer; }
                .btn-copy-neo.copied { background-color: var(--success-green); }
                .neo-textarea { width: 100%; min-height: 150px; background-color: transparent; border: none; color: var(--text-muted); resize: vertical; outline: none; font-size: 0.9em; }

                /* Radio Buttons (Reaproveitados) */
                .radio-pill-group { display: flex; gap: 12px; }
                .radio-pill { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 30px; cursor: pointer; font-size: 0.85em; }
                .radio-pill.active { border-color: var(--text-main); }
                .radio-pill input { display: none; }
                .radio-circle { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--text-muted); display: flex; align-items: center; justify-content: center; }
                .radio-pill.active .radio-circle::after { content: ""; width: 6px; height: 6px; background-color: var(--text-main); border-radius: 50%; }
            `}</style>

            {/* Cabeçalho Unificado com Logos e Novo Título */}
            <div className="neo-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={logoMinsait} alt="Logo Minsait" style={{ height: '24px', objectFit: 'contain' }} />
                    <span style={{ color: 'var(--border-color)', fontSize: '1.5rem', fontWeight: '300' }}>|</span>
                    <img src={logoNeo} alt="Logo Neoenergia" style={{ height: '32px', objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 className="neo-header-generic-title" style={{ margin: 0 }}>Processamento Massivo - Mesa Web</h2>
                    </div>
                </div>
                <div className="nav-buttons">
                    <Link to="/scripts-sd" className="btn-nav">Scripts Unitários</Link>
                    <Link to="/" className="btn-nav">← Voltar ao HUB</Link>
                </div>
            </div>

            {errorMsg && <div className="error-box">{errorMsg}</div>}

            {/* TELA DE IMPORTAÇÃO */}
            {viewImport ? (
                <div className="neo-card">
                    <span className="neo-label">COLE A TABELA DO SERVICENOW AQUI:</span>
                    <textarea 
                        className="import-area" 
                        value={rawData} 
                        onChange={(e) => setRawData(e.target.value)}
                        placeholder="Certifique-se de copiar incluindo a linha de cabeçalho..."
                    />
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            className="btn-queue" 
                            style={{ backgroundColor: 'var(--brand-orange)', color: 'white', flex: 1 }}
                            onClick={handleImportar}
                        >
                            Iniciar Automação
                        </button>
                    </div>
                </div>
            ) : (
                /* TELA DA FILA DE CHAMADOS */
                <>
                    {/* Barra de Navegação */}
                    <div className="nav-queue-container">
                        <div className="nav-row">
                            <button className="btn-queue" onClick={() => navegar(-1)} disabled={indexAtual === 0}>← Anterior</button>
                            
                            <div className="counter-area">
                                <span className="counter-text">Chamado {indexAtual + 1} de {fila.length}</span>
                                <button 
                                    className={`btn-concluir ${itemAtual.concluido ? 'tratado' : ''}`}
                                    onClick={() => atualizarItemAtual('concluido', !itemAtual.concluido)}
                                >
                                    {itemAtual.concluido ? '✅ Tratado (Desmarcar)' : 'Marcar como Tratado ✓'}
                                </button>
                            </div>
                            
                            <button className="btn-queue" onClick={() => navegar(1)} disabled={indexAtual === fila.length - 1}>Próximo →</button>
                        </div>
                        <div className="nav-row" style={{ gap: '15px' }}>
                            <button className="btn-queue btn-queue-priority" onClick={() => navegarSeletivo(-1)}>← Anterior GSE/UE</button>
                            <button className="btn-queue btn-queue-priority" onClick={() => navegarSeletivo(1)}>Próximo GSE/UE →</button>
                        </div>
                    </div>

                    {/* Card do Chamado Atual */}
                    {itemAtual && (
                        <div className="neo-card" style={{ borderColor: itemAtual.isPriority ? '#3b82f6' : 'var(--border-color)' }}>
                            
                            {itemAtual.isPriority && (
                                <div style={{ marginBottom: '20px' }}>
                                    <span className="neo-label">TIPO:</span>
                                    <div className="radio-pill-group">
                                        <label className={`radio-pill ${itemAtual.acao === 'unlock' ? 'active' : ''}`}>
                                            <input type="radio" checked={itemAtual.acao === 'unlock'} onChange={() => atualizarItemAtual('acao', 'unlock')} />
                                            <div className="radio-circle"></div> Desbloqueio
                                        </label>
                                        <label className={`radio-pill ${itemAtual.acao === 'reset' ? 'active' : ''}`}>
                                            <input type="radio" checked={itemAtual.acao === 'reset'} onChange={() => atualizarItemAtual('acao', 'reset')} />
                                            <div className="radio-circle"></div> Reset
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="neo-grid">
                                <div>
                                    <label className="neo-label">INCIDENTE</label>
                                    <input type="text" className="neo-input" value={itemAtual.registro} readOnly />
                                </div>
                                
                                <div>
                                    <label className="neo-label">SISTEMA IDENTIFICADO</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="text" className="neo-input" style={{ flex: 1 }} value={itemAtual.sistema} readOnly />
                                        <span className={`tag-sys ${itemAtual.sistema.includes('GSE') ? 'tag-gse' : itemAtual.sistema.includes('UE WEB') ? 'tag-ue' : 'tag-nota'}`}>
                                            {itemAtual.sistema.includes('GSE') ? 'GSE' : itemAtual.sistema.includes('UE WEB') ? 'UE' : 'NOTA'}
                                        </span>
                                    </div>
                                </div>

                                <div className="span-2">
                                    <label className="neo-label">COLABORADOR</label>
                                    <input type="text" className="neo-input" value={itemAtual.nome} onChange={(e) => atualizarItemAtual('nome', e.target.value)} />
                                </div>

                                <div>
                                    <label className="neo-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        LOGIN
                                        <span style={{ color: '#f59e0b', textTransform: 'none' }}>⚠️ Verifique padrão GSE</span>
                                    </label>
                                    <input type="text" className="neo-input" value={itemAtual.matricula} onChange={(e) => atualizarItemAtual('matricula', e.target.value)} />
                                </div>

                                <div>
                                    <label className="neo-label">CRIADO EM</label>
                                    <input type="text" className="neo-input" value={itemAtual.dataExibicao} readOnly />
                                </div>

                                {itemAtual.isPriority && itemAtual.acao !== 'unlock' && (
                                    <div className="span-2">
                                        <label className="neo-label">SENHA GERADA</label>
                                        <input 
                                            type="text" 
                                            className="neo-input" 
                                            placeholder="Cole a senha inteira aqui..."
                                            value={itemAtual.senha} 
                                            onChange={(e) => atualizarItemAtual('senha', e.target.value)} 
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ marginTop: '25px', textAlign: 'right' }}>
                                <button className="btn-queue" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => setViewImport(true)}>
                                    Importar Nova Lista
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Outputs */}
                    <div className="output-grid">
                        <div className="neo-card" style={{ marginBottom: 0, opacity: itemAtual?.isPriority ? 1 : 0.3 }}>
                            <div className="output-header">
                                <span className="neo-label" style={{ margin: 0 }}>E-MAIL</span>
                                <button className={`btn-copy-neo ${copiado.email ? 'copied' : ''}`} onClick={() => lidarComCopia(outEmail, 'email')} disabled={!itemAtual?.isPriority}>
                                    {copiado.email ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <textarea className="neo-textarea" value={outEmail} readOnly placeholder="Disponível apenas para chamados técnicos..."></textarea>
                        </div>

                        <div className="neo-card" style={{ marginBottom: 0, opacity: itemAtual?.isPriority ? 1 : 0.3 }}>
                            <div className="output-header">
                                <span className="neo-label" style={{ margin: 0 }}>CHAMADO</span>
                                <button className={`btn-copy-neo ${copiado.chamado ? 'copied' : ''}`} onClick={() => lidarComCopia(outChamado, 'chamado')} disabled={!itemAtual?.isPriority}>
                                    {copiado.chamado ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <textarea className="neo-textarea" value={outChamado} readOnly placeholder="Disponível apenas para chamados técnicos..."></textarea>
                        </div>

                        <div className="neo-card" style={{ marginBottom: 0 }}>
                            <div className="output-header">
                                <span className="neo-label" style={{ margin: 0 }}>NOTA (15 MIN)</span>
                                <button className={`btn-copy-neo ${copiado.nota ? 'copied' : ''}`} onClick={() => lidarComCopia(outNota, 'nota')}>
                                    {copiado.nota ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <textarea className="neo-textarea" value={outNota} readOnly></textarea>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}