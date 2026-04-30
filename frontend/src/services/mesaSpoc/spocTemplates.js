export function gerarScriptsSpoc({ nome, telefone, tentativa, chamadoSecundario, notaResolucao, chamadoPrimario }) {
    
    // Pega apenas o primeiro nome para uma comunicação mais amigável
    const primeiroNome = nome ? nome.split(' ')[0] : 'Colaborador(a)';
    
    // Tratamentos de fallback para campos vazios
    const telFormatado = telefone || '[NÚMERO DO TELEFONE]';
    const secFormatado = chamadoSecundario || '[INC SECUNDÁRIO]';
    const primFormatado = chamadoPrimario || '[INC PRIMÁRIO]';
    const notaFormatada = notaResolucao || '[INSERIR A NOTA AQUI]';

    return {
        // ==========================================
        // COMUNICAÇÃO COM O CLIENTE (E-MAIL / PORTAL)
        // ==========================================
        encerramentoCliente: `Olá ${primeiroNome},\n\nChamado finalizado conforme validação via contato telefônico.\nColaboradora confirmou que os serviços foram estabilizados.\n\nSinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`,

        tentativaContato: `Olá ${primeiroNome},\n\nNeste momento realizamos a ${tentativa}ª tentativa de contato através do número ${telFormatado}, para validarmos o atendimento, porém não obtivemos êxito.\n\nPara melhor atendê-lo(a), pedimos que confirme o seu número de contato e um melhor horário, para entrarmos em contato e validarmos que o atendimento foi realizado com sucesso. Havendo um número de telefone alternativo, pedimos que nos encaminhe.\n\nÉ importante lembrar que após 3 tentativas de contato sem êxito, a solicitação será encerrada por falta de comunicação. Se o problema persistir, um novo chamado deverá ser aberto com informações atualizadas.\n\nEm caso de dúvidas, estamos à disposição. Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`,

        comentarioPendente: `Olá ${primeiroNome},\n\nColaborador(a) orientado(a) que o chamado encontra-se pendente, até que tenhamos maiores informações da equipe responsável, para prosseguirmos o atendimento.\n\nEm caso de dúvidas, estamos à disposição.\n\nSinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:\nChat via ITNOW: https://iberdrola.service-now.com/itnow\nTelefone Externo: 7133706000\n\nCordialmente,\nService Desk Neoenergia.`,

        // ==========================================
        // ANOTAÇÕES DE TRABALHO (WORK NOTES)
        // ==========================================
        encerramentoWorkNote: `#DESIGN\nChamado Secundário ${secFormatado} Finalizado.\n\nNOTA de RESOLUÇÃO: ${notaFormatada}`,

        vinculoPrimario: `#DESIGN\nVinculado ao chamado primário ${primFormatado}`,

        vinculoSecundario: `#DESIGN\nVinculado ao chamado Secundário ${secFormatado}`,

        motivoPendenteWorkNote: `#DESIGN\nMotivo: O chamado encontra-se pendente (Status: Em espera - Resposta do Fornecedor), até que tenhamos maiores informações da Neoenergia, para prosseguirmos o atendimento.`,

        cobrancaAtualizacao: `#DESIGN\n\nPor gentileza, atualizar esse incidente com informações válidas, para que possamos comunicar o(a) colaborador(a) a respeito do andamento do chamado.\n\nCordialmente, \nService Desk Neoenergia.`
    };
}