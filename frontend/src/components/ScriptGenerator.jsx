import React, { useState, useEffect } from 'react'

const ScriptGenerator = ({ 
  chamadosDisponiveis, 
  chamadosSelecionados,
  onMassiveUpdate
}) => {
  const [equipe, setEquipe] = useState('')
  const [colaborador, setColaborador] = useState('')
  const [solicitante, setSolicitante] = useState('')
  const [copiedType, setCopiedType] = useState(null)

  useEffect(() => {
    if (chamadosSelecionados && chamadosSelecionados.length > 0) {
      const primeiroChamado = chamadosSelecionados[0]
      if (primeiroChamado.colaborador) setColaborador(primeiroChamado.colaborador)
      if (primeiroChamado.solicitante) setSolicitante(primeiroChamado.solicitante)
      if (primeiroChamado.equipe_final && !equipe) setEquipe(primeiroChamado.equipe_final)
    }
  }, [chamadosSelecionados])

  const selectedIncs = chamadosSelecionados ? chamadosSelecionados.map((c) => c.inc) : []

  const handleSolicitanteChange = (e) => {
    let val = e.target.value
    if (val.length > 0 && !val.startsWith('@')) val = '@' + val
    setSolicitante(val)
  }

  const getSaudacao = () => {
    const hora = new Date().getHours()
    if (hora >= 5 && hora < 12) return 'Bom dia'
    if (hora >= 12 && hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const generateText = (tipo) => {
    const incsListados = selectedIncs.join(', ')
    const incsBarra = selectedIncs.join(' / ')
    const isPlural = selectedIncs.length > 1

    switch (tipo) {
      case 'ITNOW_EQUIPE':
        return `Time, ${equipe || '[NOME DA EQUIPE]'}\n\nPor gentileza, fornecer uma previsão de normalização, para que possamos informar o(a) colaborador(a) solicitante, e priorizar o atendimento.\n\nCordialmente,\nService Desk Neoenergia.`
      case 'ITNOW_COLABORADOR':
        const incText = isPlural ? `identificadores n.º ${incsListados}` : `identificador n.º ${selectedIncs[0]}`
        return `${colaborador ? `Olá, ${colaborador}` : `Olá,`}\n\nÉ um prazer poder te ajudar... [texto omitido para brevidade] ... acompanhamento do(s) ${incText}.`
      case 'WPP_LONGO':
        return `${getSaudacao()}, ${solicitante || '[Nome do Solicitante] !'}\n\n*${isPlural ? 'Chamados' : 'Chamado'}* (*${incsBarra}*)\n\nComunicamos que o atendimento encontra-se com a equipe responsável...`
      default: return ''
    }
  }

  const copyToClipboard = async (tipo) => {
    if (selectedIncs.length === 0) {
      alert('Selecione ao menos um INC na tabela para gerar o script.')
      return
    }

    // Lógica adicional: Se pedir previsão, atualiza o grupo responsável na tabela
    if (tipo === 'ITNOW_EQUIPE' && equipe) {
      onMassiveUpdate({ equipe_final: equipe });
    }

    const script = generateText(tipo)
    try {
      await navigator.clipboard.writeText(script)
      setCopiedType(tipo)
      setTimeout(() => setCopiedType(null), 2000)
    } catch (err) {
      console.error('Falha ao copiar:', err)
    }
  }

  const ButtonCopy = ({ tipo, label }) => {
    const isCopied = copiedType === tipo
    return (
      <button
        onClick={() => copyToClipboard(tipo)}
        className={`text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all border flex items-center justify-center gap-1 active:scale-95 ${
          isCopied ? 'bg-neo-green text-white border-neo-green' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
        }`}
      >
        {isCopied ? "✓ Copiado!" : label}
      </button>
    )
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Gerador de Scripts</h2>
        {selectedIncs.length > 0 && (
          <span className="bg-neo-green/20 text-neo-green border border-neo-green/30 text-xs px-2 py-1 rounded-md font-bold">
            {selectedIncs.length} selecionado(s)
          </span>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Equipe Designada</label>
          <input
            type="text"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            placeholder="Ex: N3 - Telecom"
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none text-sm focus:border-neo-green"
          />
        </div>
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Colaborador Final</label>
          <input
            type="text"
            value={colaborador}
            onChange={(e) => setColaborador(e.target.value)}
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Solicitante (WhatsApp)</label>
          <input
            type="text"
            value={solicitante}
            onChange={handleSolicitanteChange}
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-2">
          <ButtonCopy tipo="ITNOW_EQUIPE" label="Pedir Previsão (Equipe)" />
          <ButtonCopy tipo="ITNOW_COLABORADOR" label="Retorno (Colaborador)" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ButtonCopy tipo="WPP_LONGO" label="Resumo Status" />
        </div>
      </div>
    </div>
  )
}

export default ScriptGenerator