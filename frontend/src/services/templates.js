export const getWhatsAppTemplates = (chamados = []) => {
  const saudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const listaChamados = chamados.length > 0 ? chamados : [{}];
  const primeiro = listaChamados[0];
  const incsFormatados = listaChamados.map(c => c.inc || "INCXXXXX").join(' / ');
  const isPlural = listaChamados.length > 1;
  const solicitante = primeiro.solicitante || "Solicitante";
  const cliente = primeiro.cliente_nome || "Cliente";
  const mesa = primeiro.equipe_final || "[Mesa Responsável]";
  const local = primeiro.localizacao || "xxxx";
  const data = primeiro.data || "xx/xx";
  const horaChamado = primeiro.horario || "xx:xx";
  const descricao = primeiro.descricao || "[Descrição]";

  const solicitanteFormatado = solicitante.startsWith('@') ? solicitante : `@${solicitante.trim()}`;

  return [
    {
      id: 'alto_impacto',
      label: '🚨 Grupo Alto Impacto',
      color: 'bg-red-600 hover:bg-red-700',
      icon: '🚨',
      script: `URGENTE - GRUPO ALTO IMPACTO\nCHAMADO TIPO:\nLOJA: ${local}\nDATA: ${data}\nHORA: ${horaChamado}\nCHAMADO(S): ${incsFormatados}\nDescrição: ${descricao}\nCANAL DE ABERTURA: Itnow (site)`
    },
    {
      id: 'comunicado_verificacao',
      label: '📣 Aviso de Verificação',
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: '📣',
      script: `${saudacao()} ${solicitanteFormatado} !\n\n${isPlural ? 'Chamados' : 'Chamado'} (*${incsFormatados}*)\n\nComunicamos que o(s) chamado(s) ${isPlural ? 'encontram-se' : 'encontra-se'} com a equipe responsável para a verificação.\n\nSolicitamos prioridade no atendimento e a previsão de normalização.\n\nAcompanhe seu incidente através do portal:\nhttps://iberdrola.service-now.com/itnow via aba Consultas, localizar o incidente desejado, para acompanhamento e inclusão de informações/evidências.\nou através da nossa URA: (71) 3370-6000.\n\nCordialmente,\nService Desk Neoenergia.`
    },
    {
      id: 'solicitar_previsao',
      label: '⏳ Solicitar Previsão (Mesa)',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: '⏳',
      script: `Time ${mesa},\n\nPor gentileza, fornecer uma previsão de normalização, para que possamos informar o(a) colaborador(a) solicitante, e priorizar o atendimento.\n\nCordialmente,\nService Desk Neoenergia.`
    },
    {
      id: 'feedback_cliente',
      label: '👤 Feedback Cliente',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      icon: '👤',
      script: `Olá ${cliente},\n\nÉ um prazer poder te ajudar, por isso documentamos todas as informações fornecidas. Destacamos a prioridade e solicitamos um retorno da equipe responsável, para fornecer uma previsão de atendimento para a solução do seu caso.\n\nPara acompanhar o andamento com o status atualizado, basta localizar o identificador n.º ${incsFormatados} no ITNow (https://iberdrola.service-now.com/itnow), diretamente pela aba CONSULTAS. Além disso, caso seja necessário, você pode adicionar mais informações relevantes e novas evidências sobre o erro.\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\n\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`
    }
  ];
};