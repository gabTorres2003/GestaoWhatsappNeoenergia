export const getWhatsAppTemplates = (chamado = {}) => {
  const saudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const inc = chamado.inc || "INCXXXXX";
  const solicitante = chamado.solicitante || "Solicitante";
  const cliente = chamado.cliente_nome || "Cliente";
  const mesa = chamado.equipe_final || "[Mesa Responsável]";
  const local = chamado.localizacao || "xxxx";
  const data = chamado.data || "xx/xx";
  const horaChamado = chamado.horario || "xx:xx";
  const descricao = chamado.descricao || "[Descrição]";
  const solicitanteLimpo = solicitante.replace('@', '').trim();

  return [
    {
      id: 'alto_impacto',
      label: '🚨 Grupo Alto Impacto',
      color: 'bg-red-600 hover:bg-red-700',
      icon: '🚨',
      script: `URGENTE - GRUPO ALTO IMPACTO\nCHAMADO TIPO:\nLOJA: ${local}\nDATA: ${data}\nHORA: ${horaChamado}\nCHAMADO: ${inc}\nDescrição do chamado: ${descricao}\nCANAL DE ABERTURA: Itnow (site)`
    },
    {
      id: 'comunicado_verificacao',
      label: '📣 Aviso de Verificação',
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: '📣',
      script: `${saudacao()} @${solicitanteLimpo} !\n\nChamado (*${inc}*)\n\nComunicamos que o chamado encontra-se com a equipe responsável para a verificação.\n\nSolicitamos prioridade no atendimento e a previsão de normalização.\n\nAcompanhe seu incidente através do portal:\nhttps://iberdrola.service-now.com/itnow via aba Consultas, localizar o incidente desejado, para acompanhamento e inclusão de informações/evidências.\nou através da nossa URA: (71) 3370-6000.\n\nCordialmente,\nService Desk Neoenergia.`
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
      script: `Olá ${cliente},\n\nÉ um prazer poder te ajudar, por isso documentamos todas as informações fornecidas. Destacamos a prioridade e solicitamos um retorno da equipe responsável, para fornecer uma previsão de atendimento para a solução do seu caso.\n\nPara acompanhar o andamento com o status atualizado, basta localizar o identificador n.º ${inc} no ITNow (https://iberdrola.service-now.com/itnow), diretamente pela aba CONSULTAS. Além disso, caso seja necessário, você pode adicionar mais informações relevantes e novas evidências sobre o erro.\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\n\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`
    },
    {
      id: 'falha_recorrente',
      label: '🔄 Falha Recorrente',
      color: 'bg-slate-600 hover:bg-slate-700',
      icon: '🔄',
      script: `Time ${mesa},\n\nColaborador(a) informou que a falha voltou a ocorrer.\nPor gentileza, fornecer uma previsão de normalização, para que possamos informar o(a) colaborador(a) solicitante.\n\nCordialmente,\nService Desk Neoenergia.`
    }
  ];
};