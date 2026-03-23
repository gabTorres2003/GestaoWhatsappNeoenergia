export const rodapePadrao = `Em caso de dúvidas, estamos à disposição. 
Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:

Chat via ITNOW: https://iberdrola.service-now.com/itnow
Telefone Externo: 7133706000

Cordialmente,
Service Desk Neoenergia.`;

export function processarSenha(textoRaw) {
    if (!textoRaw) return "";
    const regex = /temporária\s+(.*?)\s+foi/i;
    const match = textoRaw.match(regex);
    return match && match[1] ? match[1].trim() : textoRaw.trim();
}

export async function copiarTextoParaClipboard(texto) {
    if (!texto) return Promise.reject("Nenhum texto para copiar");
    return navigator.clipboard.writeText(texto);
}

export function gerarTemplatesSD(dados) {
    const { acao, registro, sistema, nome, matricula, senha } = dados;
    const saudacao = nome ? `Olá, ${nome}` : `Olá,`;
    const isUEWEB = sistema === "UE WEB (CS) - PRD";
    const nomeSistemaUE = "UE WEB (CS)";

    let email = "";
    let chamado = "";

    if (acao === "disabled") {
        const corpoDisabled = `${saudacao}\n\nVerificado que não foi possível realizar o desbloqueio/reset de senha, pois o login não está ativo.\n\nLogin: ${matricula}\nSistema/Empresa: ${sistema}\n\nPor favor, realizar a abertura da solicitação via ITnow, para a reativação do usuário e atribuição de grupo desejado no GSE.\n\nEssa ação, requer aprovação gerencial, no qual deverá ser tratada via solicitação de serviço (RITM) e não por incidente (INC), para atuação da equipe responsável posteriormente.\n\nTemplate: Conceder acesso à Aplicações Corporativas\nLink para acesso: https://iberdrola.service-now.com/itnow?id=sc_cat_item_guide&sys_id=20fc4fbddbc1af40b716e2e15b9619a6\n\nGentileza entrar em contato com o agente de perfil da sua área/departamento, para apoio na tratativa da demanda. Caso não saiba quem é o seu agente de perfil, fineza acessar o portal "acessosap.neoenergia.net" e clicar no Menu: Agente de Perfil.\n\n${rodapePadrao}`;
        
        email = corpoDisabled;
        chamado = corpoDisabled;

    } else if (acao === "not_found") {
        const corpoNotFound = `${saudacao}\n\nConforme imagem em anexo, verificado que o login informado na descrição do chamado não foi encontrado: ${matricula}\n\nSistema: ${sistema}\n\nSolicitamos que abra nova demanda cumprindo as orientações enviadas neste chamado, visando garantir os novos requisitos estabelecidos pela Neoenergia.\n\nOBSERVAÇÕES:\n\n1 - O chamado no ITNOW deve ser aberto através do template: Conceder acesso à Aplicações Corporativas\n\nAcesse via Link Direto: https://iberdrola.service-now.com/itnow?id=sc_cat_item_guide&sys_id=20fc4fbddbc1af40b716e2e15b9619a6\n\n2- Deve ser aberto com o nome de quem vai receber o acesso no campo "Solicitado para" conforme determinação da Neoenergia.\n\n3- Os chamados devem ser abertos apenas um por sistema/ambiente.\n\n4- Tendo dúvidas no registro desta demanda você deve procurar o Agente de perfil de sua área para orientação no registro, caso você seja "Agente de Perfil", deve procurar a área de Controles Internos para orientações.\n\n${rodapePadrao}`;
        
        email = corpoNotFound;
        chamado = corpoNotFound;

    } else if (acao === "unlock") {
        if (isUEWEB) {
            const corpoUnlockUE = `${saudacao}\n\nFoi realizado o desbloqueio no acesso, conforme solicitado.\nObs: Informamos que a senha atual não foi alterada.\n\nLOGIN: ${matricula}\nSISTEMA/AMBIENTE: ${nomeSistemaUE}\n\n${rodapePadrao}`;
            email = corpoUnlockUE;
            chamado = corpoUnlockUE;
        } else {
            const corpoUnlockGSE = `${saudacao}\n\nFoi realizado o desbloqueio no acesso, conforme solicitado.\n\nObs: Informamos que a senha atual não foi alterada.\n\nLOGIN: ${matricula} \nSISTEMA/AMBIENTE: ${sistema} \n\nImportante: O Terminal Service (TS) deverá ser acessado com o mesmo login (matrícula) no GSE, para que não ocorra bloqueio automático no GSE.\n\n${rodapePadrao}`;
            email = corpoUnlockGSE;
            chamado = corpoUnlockGSE;
        }

    } else {
        if (isUEWEB) {
            email = `${saudacao}\n\nNotificamos que o seu acesso foi reativado, e foi gerada solicitação de nova senha de acesso foi atendida, seguem informações.\n\nRegistro ITNOW: ${registro}\nSISTEMA / AMBIENTE: ${nomeSistemaUE}\nLOGIN: ${matricula}\nNOVA SENHA: ${senha}\n\nOBS. ALTERAR ATÉ O FINAL DO DIA PARA EVITAR BLOQUEIO AUTOMÁTICO DO SISTEMA.\n\nEsta é uma mensagem automática. Por favor, não responda este e-mail.\n\n${rodapePadrao}`;
            
            chamado = `${saudacao}\n\nNotificamos que foi realizado a reativação de acesso, e o reset de senha foi enviada para o e-mail cadastrado no Itnow.\n\nLOGIN: ${matricula}\nSISTEMA/AMBIENTE: ${nomeSistemaUE}\n\nImportante (Orientações futuras para o reset de senha no UE WEB).\n\nSe houver necessidade de nova senha, deverá orientar o(a) colaborador(a) que para o envio de nova senha temporária para o e-mail cadastrado, deverá inserir o login utilizado no UE WEB no campo “Usuário” e depois clicar na opção “Esqueceu a senha? Clique aqui.\n\n${rodapePadrao}`;
        } else {
            email = `${saudacao} \n\nSua solicitação de nova senha de acesso foi atendida, seguem informações.\n\nRegistro ITNOW: ${registro}\nSISTEMA / AMBIENTE: ${sistema}\nLOGIN: ${matricula}\nNOVA SENHA: ${senha}\n\nOBS. ALTERAR ATÉ O FINAL DO DIA PARA EVITAR BLOQUEIO AUTOMÁTICO DO SISTEMA.\n\nImportante: O Terminal Service (TS) deverá ser acessado com o mesmo login (matrícula) no GSE, para que não ocorra bloqueio automático no GSE.\n\nEsta é uma mensagem automática. Por favor, não responda este e-mail. \n\n${rodapePadrao}`;
            
            chamado = `${saudacao} \n\nRealizado o reset de senha no GSE enviada para o e-mail cadastrado no Itnow.\n\nLOGIN: ${matricula}\nSISTEMA/AMBIENTE: ${sistema}\n\nImportante: O Terminal Service (TS) deverá ser acessado com o mesmo login (matrícula) no GSE, para que não ocorra bloqueio automático no GSE.\n\n${rodapePadrao}`;
        }
    }

    return { email, chamado };
}