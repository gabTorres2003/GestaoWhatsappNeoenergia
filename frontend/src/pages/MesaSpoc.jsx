import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { processarTabelaSpoc, copiarTexto } from '../services/mesaSpoc/spocLogic';
import { gerarScriptsSpoc } from '../services/mesaSpoc/spocTemplates';
import logoNeo from '../assets/logo_neo.png';
import logoMinsait from '../assets/logo_minsait.png';

// Subcomponente: Painel de Ações Expansível (Isola os inputs de cada chamado)
const SpocActionPanel = ({ chamado }) => {
    const [telefone, setTelefone] = useState(chamado.telefone || '');
    const [tentativa, setTentativa] = useState('1');
    const [nota, setNota] = useState('');
    const [primario, setPrimario] = useState(chamado.identificador);
    const [copiedLabel, setCopiedLabel] = useState(null);

    // Gera os scripts em tempo real conforme o usuário digita
    const scripts = gerarScriptsSpoc({
        nome: chamado.solicitante,
        telefone,
        tentativa,
        chamadoSecundario: chamado.referenciaExterna,
        notaResolucao: nota,
        chamadoPrimario: primario
    });

    const handleCopiarScript = (texto, label) => {
        copiarTexto(texto).then(() => {
            setCopiedLabel(label);
            setTimeout(() => setCopiedLabel(null), 2000);
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg m-2 mb-4 shadow-inner">
            <h4 className="text-orange-400 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                ⚡ Ações Rápidas - {chamado.identificador}
            </h4>

            {/* Configurações Dinâmicas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Telefone Contatado</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-md p-2 outline-none focus:border-orange-400" 
                           placeholder="Ex: 11999999999" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Qual Tentativa?</label>
                    <select className="w-full bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-md p-2 outline-none focus:border-orange-400" 
                            value={tentativa} onChange={(e) => setTentativa(e.target.value)}>
                        <option value="1">1ª Tentativa</option>
                        <option value="2">2ª Tentativa</option>
                        <option value="3">3ª Tentativa</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">INC Primário (Vinculo)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-md p-2 outline-none focus:border-orange-400" 
                           value={primario} onChange={(e) => setPrimario(e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Nota de Resolução</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-md p-2 outline-none focus:border-orange-400" 
                           placeholder="Resumo do que foi feito..." value={nota} onChange={(e) => setNota(e.target.value)} />
                </div>
            </div>

            {/* Painéis de Cópia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Coluna 1: Cliente */}
                <div>
                    <h5 className="text-slate-300 font-semibold text-sm mb-3 border-l-2 border-emerald-500 pl-2">Para o Cliente (Comentários Adicionais)</h5>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleCopiarScript(scripts.tentativaContato, 'tentativa')} 
                                className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-md border border-slate-700 transition-colors text-left text-sm">
                            <span>📞 Tentativa de Contato ({tentativa}ª)</span>
                            <span className="text-emerald-400 text-xs">{copiedLabel === 'tentativa' ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                        <button onClick={() => handleCopiarScript(scripts.comentarioPendente, 'pendenteCliente')} 
                                className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-md border border-slate-700 transition-colors text-left text-sm">
                            <span>⏳ Orientação: Pendente Fornecedor</span>
                            <span className="text-emerald-400 text-xs">{copiedLabel === 'pendenteCliente' ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                        <button onClick={() => handleCopiarScript(scripts.encerramentoCliente, 'encerraCliente')} 
                                className="flex justify-between items-center bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-100 p-3 rounded-md border border-emerald-800/50 transition-colors text-left text-sm mt-2">
                            <span>✅ Encerramento Validado</span>
                            <span className="text-emerald-400 text-xs">{copiedLabel === 'encerraCliente' ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                    </div>
                </div>

                {/* Coluna 2: Work Notes */}
                <div>
                    <h5 className="text-slate-300 font-semibold text-sm mb-3 border-l-2 border-orange-500 pl-2">Interno (#DESIGN / Work Notes)</h5>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button onClick={() => handleCopiarScript(scripts.vinculoPrimario, 'vPrimario')} 
                                    className="flex-1 flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-md border border-slate-700 transition-colors text-left text-sm">
                                <span>🔗 Vinc. Primário</span>
                                <span className="text-orange-400 text-xs">{copiedLabel === 'vPrimario' ? 'Copiado!' : ''}</span>
                            </button>
                            <button onClick={() => handleCopiarScript(scripts.vinculoSecundario, 'vSecundario')} 
                                    className="flex-1 flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-md border border-slate-700 transition-colors text-left text-sm">
                                <span>🔗 Vinc. Secundário</span>
                                <span className="text-orange-400 text-xs">{copiedLabel === 'vSecundario' ? 'Copiado!' : ''}</span>
                            </button>
                        </div>
                        <button onClick={() => handleCopiarScript(scripts.cobrancaAtualizacao, 'cobranca')} 
                                className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-md border border-slate-700 transition-colors text-left text-sm">
                            <span>⚠️ Cobrar Atualização da Equipe</span>
                            <span className="text-orange-400 text-xs">{copiedLabel === 'cobranca' ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                        <button onClick={() => handleCopiarScript(scripts.motivoPendenteWorkNote, 'motivoPendente')} 
                                className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-md border border-slate-700 transition-colors text-left text-sm">
                            <span>⏸️ Motivo: Pendente Fornecedor</span>
                            <span className="text-orange-400 text-xs">{copiedLabel === 'motivoPendente' ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                        <button onClick={() => handleCopiarScript(scripts.encerramentoWorkNote, 'encerraWork')} 
                                className="flex justify-between items-center bg-orange-900/30 hover:bg-orange-900/50 text-orange-100 p-3 rounded-md border border-orange-800/50 transition-colors text-left text-sm mt-2">
                            <span>📝 Anotação de Encerramento (Nota)</span>
                            <span className="text-orange-400 text-xs">{copiedLabel === 'encerraWork' ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default function MesaSpoc() {
    const [viewImport, setViewImport] = useState(true);
    const [rawData, setRawData] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [chamados, setChamados] = useState([]);
    
    const [copiedId, setCopiedId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    // Filtros
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroRazao, setFiltroRazao] = useState('');

    const handleImportar = () => {
        setErrorMsg('');
        const resultado = processarTabelaSpoc(rawData);

        if (!resultado.success) {
            setErrorMsg(resultado.error);
            return;
        }

        setChamados(resultado.fila);
        setViewImport(false);
    };

    const handleCopiarSimples = (texto, id) => {
        if (!texto) return;
        copiarTexto(texto).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const toggleConcluido = (id) => {
        setChamados(chamados.map(c => 
            c.id === id ? { ...c, concluido: !c.concluido } : c
        ));
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const chamadosFiltrados = chamados.filter(c => {
        const passaFiltroEstado = filtroEstado ? c.estado.toLowerCase().includes(filtroEstado.toLowerCase()) : true;
        const passaFiltroRazao = filtroRazao ? c.razaoEsperar.toLowerCase().includes(filtroRazao.toLowerCase()) : true;
        return passaFiltroEstado && passaFiltroRazao;
    });

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* CABEÇALHO */}
                <div className="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <img src={logoMinsait} alt="Logo Minsait" className="h-6 object-contain" />
                        <span className="text-slate-600 text-2xl font-light">|</span>
                        <img src={logoNeo} alt="Logo Neoenergia" className="h-8 object-contain" />
                        <h2 className="m-0 text-2xl font-semibold text-white ml-2">Mesa SPOC - Monitoria</h2>
                    </div>
                    <div className="flex gap-3">
                        {!viewImport && (
                            <button onClick={() => setViewImport(true)} className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                                + Nova Importação
                            </button>
                        )}
                        <Link to="/" className="px-4 py-2 text-sm font-medium border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                            ← Voltar ao HUB
                        </Link>
                    </div>
                </div>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6 font-medium">
                        {errorMsg}
                    </div>
                )}

                {/* TELA DE IMPORTAÇÃO */}
                {viewImport ? (
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Cole a tabela do ServiceNow (SPOC):
                        </h3>
                        <textarea
                            className="w-full h-64 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-600 focus:border-orange-400 outline-none resize-y text-sm mb-4 font-mono"
                            placeholder="INC4974460    CYNTHIA STEAWART..."
                            value={rawData}
                            onChange={(e) => setRawData(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg" onClick={handleImportar}>
                                Processar e Organizar Fila
                            </button>
                        </div>
                    </div>
                ) : (
                    /* PLANILHA SPOC */
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
                        
                        {/* Filtros */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 pb-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-xl font-bold text-orange-400">Chamados em Monitoramento</h3>
                                <p className="text-slate-400 text-sm mt-1">Exibindo {chamadosFiltrados.length} de {chamados.length} incidentes extraídos.</p>
                            </div>

                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="flex flex-col gap-1 w-full md:w-48">
                                    <label className="text-xs font-semibold text-slate-400 uppercase">Filtrar Estado</label>
                                    <select className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg p-2 outline-none" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                        <option value="">Todos</option>
                                        <option value="Aguardando">Aguardando</option>
                                        <option value="Designado">Designado</option>
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Resolvido">Resolvido</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 w-full md:w-48">
                                    <label className="text-xs font-semibold text-slate-400 uppercase">Razão Esperar</label>
                                    <select className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg p-2 outline-none" value={filtroRazao} onChange={(e) => setFiltroRazao(e.target.value)}>
                                        <option value="">Todas</option>
                                        <option value="colaborador">Resp. Colaborador</option>
                                        <option value="fornecedor">Resp. Fornecedor</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Dados */}
                        <div className="overflow-x-auto rounded-xl border border-slate-700">
                            <table className="w-full text-left border-collapse text-[13px]">
                                <thead>
                                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-700">
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px] w-12 text-center">OK</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Ações</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Identificador</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Datas</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Solicitante / Local</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Status / Razão</th>
                                        <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Ref. Externa (Filho)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {chamadosFiltrados.map((c) => (
                                        <React.Fragment key={c.id}>
                                            <tr className={`transition-colors ${c.concluido ? 'bg-emerald-900/10 opacity-60' : 'hover:bg-slate-700/30'}`}>
                                                <td className="p-4 text-center">
                                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-900 cursor-pointer"
                                                        checked={c.concluido} onChange={() => toggleConcluido(c.id)} />
                                                </td>
                                                <td className="p-4">
                                                    <button onClick={() => toggleExpand(c.id)} 
                                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${expandedId === c.id ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                                                        {expandedId === c.id ? 'Fechar' : '⚙️ Atuar'}
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-slate-200">{c.identificador}</span>
                                                        <button onClick={() => handleCopiarSimples(c.identificador, c.id)} className="text-slate-500 hover:text-orange-400">
                                                            {copiedId === c.id ? '✓' : '⧉'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="text-slate-200"><span className="text-slate-500 mr-1">C:</span>{c.criadoEm || '--'}</div>
                                                    <div className="text-slate-200"><span className="text-slate-500 mr-1">A:</span>{c.atualizadoEm || '--'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-slate-200 truncate max-w-[180px]" title={c.solicitante}>{c.solicitante || '--'}</div>
                                                    <div className="text-xs text-orange-300 truncate max-w-[180px]" title={c.localizacao}>📍 {c.localizacao || 'Local não idenf.'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-slate-700 text-slate-200 mb-1">{c.estado || 'Desconhecido'}</div>
                                                    <div className="text-xs text-slate-400">{c.razaoEsperar || '--'}</div>
                                                </td>
                                                <td className="p-4">
                                                    {c.referenciaExterna ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{c.referenciaExterna}</span>
                                                            <button onClick={() => handleCopiarSimples(c.referenciaExterna, `ref-${c.id}`)} className="text-slate-500 hover:text-emerald-400">
                                                                {copiedId === `ref-${c.id}` ? '✓' : '⧉'}
                                                            </button>
                                                        </div>
                                                    ) : <span className="text-slate-500 italic">Sem filho</span>}
                                                </td>
                                            </tr>

                                            {/* Painel Expansível de Ações */}
                                            {expandedId === c.id && (
                                                <tr>
                                                    <td colSpan="7" className="p-0 border-b-2 border-orange-500">
                                                        <SpocActionPanel chamado={c} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}