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
        copiarTextoParaClipboard(texto).then(() => {
            setCopiado({ ...copiado, [tipo]: true });
            setTimeout(() => {
                setCopiado({ ...copiado, [tipo]: false });
            }, 2000);
        });
    };

    const mostrarSenha = acao !== 'unlock' && acao !== 'disabled' && acao !== 'not_found';

    return (
        <div className="container">
            {/* Header / Navegação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary, #0056b3)', marginBottom: '15px', paddingBottom: '10px' }}>
                <h2 style={{ border: 'none', margin: 0 }}>Scripts Neoenergia</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="/processamento-massa" className="btn-nav" style={{ background: '#6c757d', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: '4px', fontSize: '0.9em' }}>
                        ⚡ Processamento em Massa
                    </a>
                    <a href="/access-control" className="btn-nav" style={{ textDecoration: 'none', padding: '8px 15px', borderRadius: '4px', fontSize: '0.9em' }}>
                        Access Control →
                    </a>
                </div>
            </div>

            {/* Radio Buttons (Ações) */}
            <div className="type-selector" style={{ marginBottom: '20px' }}>
                <span className="type-label" style={{ fontWeight: 'bold', marginRight: '15px' }}>Tipo de Solicitação:</span>
                <div className="radio-group" style={{ display: 'inline-flex', gap: '15px' }}>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="reset" checked={acao === 'reset'} onChange={() => toggleCampos('reset')} style={{ marginRight: '5px' }} />
                        Reset
                    </label>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="unlock" checked={acao === 'unlock'} onChange={() => toggleCampos('unlock')} style={{ marginRight: '5px' }} />
                        Desbloqueio
                    </label>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="disabled" checked={acao === 'disabled'} onChange={() => toggleCampos('disabled')} style={{ marginRight: '5px' }} />
                        Desabilitado
                    </label>
                    <label className="radio-option">
                        <input type="radio" name="acao" value="not_found" checked={acao === 'not_found'} onChange={() => toggleCampos('not_found')} style={{ marginRight: '5px' }} />
                        Não Encontrado
                    </label>
                </div>
            </div>

            {/* Formulário (Inputs) */}
            <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div className="field">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Registro ITNOW:</label>
                    <input type="text" value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="Ex: INC123456" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                
                <div className="field">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Sistema:</label>
                    <select value={sistema} onChange={(e) => setSistema(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                        <option value="GSE (COELBA) - PRD">GSE (COELBA) - PRD</option>
                        <option value="GSE (COSERN) - PRD">GSE (COSERN) - PRD</option>
                        <option value="GSE (PERNAMBUCO) - PRD">GSE (PERNAMBUCO) - PRD</option>
                        <option value="UE WEB (CS) - PRD">UE WEB (CS) - PRD</option>
                    </select>
                </div>

                <div className="field">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>

                <div className="field">
                    <label style={{ display: 'block', marginBottom: '5px' }}>Login:</label>
                    <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="E976850" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>

                {mostrarSenha && (
                    <div className="field" id="campoSenha" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Nova Senha:</label>
                        <input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Colar senha inteira no padrão do GSE" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                )}
            </div>

            {/* Botões */}
            <div className="buttons" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button className="btn-clear" onClick={limparCampos} style={{ padding: '10px 20px', cursor: 'pointer', background: '#e0e0e0', border: '1px solid #ccc' }}>Limpar</button>
                <button className="btn-generate" onClick={gerarScripts} style={{ padding: '10px 20px', cursor: 'pointer', background: '#0056b3', color: 'white', border: 'none' }}>Gerar Scripts</button>
            </div>

            {/* Outputs (Textareas) */}
            <div className="output-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                
                <div className="output-box" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="output-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1em' }}>E-mail</h3>
                        <button 
                            className="btn-copy" 
                            onClick={() => copiarTexto(outEmail, 'email')}
                            style={{ padding: '5px 10px', cursor: 'pointer', background: copiado.email ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                            {copiado.email ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea value={outEmail} readOnly style={{ flex: 1, minHeight: '150px', padding: '10px', resize: 'vertical' }}></textarea>
                </div>

                <div className="output-box" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="output-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1em' }}>Chamado</h3>
                        <button 
                            className="btn-copy" 
                            onClick={() => copiarTexto(outChamado, 'chamado')}
                            style={{ padding: '5px 10px', cursor: 'pointer', background: copiado.chamado ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                            {copiado.chamado ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea value={outChamado} readOnly style={{ flex: 1, minHeight: '150px', padding: '10px', resize: 'vertical' }}></textarea>
                </div>

                <div className="output-box" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="output-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1em' }}>Nota (15 min)</h3>
                        <button 
                            className="btn-copy" 
                            onClick={() => copiarTexto(outNota, 'nota')}
                            style={{ padding: '5px 10px', cursor: 'pointer', background: copiado.nota ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                            {copiado.nota ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <textarea value={outNota} readOnly style={{ flex: 1, minHeight: '150px', padding: '10px', resize: 'vertical' }}></textarea>
                </div>

            </div>
        </div>
    );
}