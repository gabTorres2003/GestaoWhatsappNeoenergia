export const rodapePadrao = `Em caso de dúvidas, estamos à disposição. 
Sinta-se à vontade para entrar em contato pelos Canais de Atendimento listados abaixo:

Chat via ITNOW: https://iberdrola.service-now.com/itnow
Telefone Externo: 7133706000

Cordialmente,
Service Desk Neoenergia.`;

export const SAPS_DATABASE = {
  "QA": [
    "SAP NRQ (Java Portal) - QA", "SAP PNQ (HANA CELPE) - QA", "SAP BNQ (HANA COELBA) - QA",
    "SAP RNQ (HANA COSERN) - QA", "SAP NFe Neoenergia - QA", "SAP NFe Elektro - QA",
    "SAP BW Click - QA", "SAP Solman - QA", "SAP PI - QA", "SAP CBQ (R3 Neoenergia) - QA",
    "SAP ECQ (Elektro) - QA", "SAP NHQ (RH) - QA", "SAP CFQ (Fiori RH) - QA",
    "SAP NGP (GRC Access Control) - QA", "SAP PSQ (CCS CELPE) - QA", "SAP BSQ (CCS COELBA) - QA",
    "SAP RSQ (CCS COSERN) - QA", "SAP PMQ (CRM CELPE) - QA", "SAP BMQ (CRM COELBA) - QA",
    "SAP RMQ (CRM COSERN) - QA", "SAP PLQ (MOM CELPE) - QA", "SAP BLQ (MOM COELBA) - QA",
    "SAP RLQ (MOM COSERN) - QA", "SAP NWQ (BW Comercial) - QA"
  ],
  "DEV": [
    "MASTERSAF (Fiscal) - DEV", "SAP NRD (Java Portal) - DEV", "SAP PND (HANA CELPE) - DEV",
    "SAP BND (HANA COELBA) - DEV", "SAP RND (HANA COSERN) - DEV", "SAP NFe Neoenergia - DEV",
    "SAP NFe Elektro - DEV", "SAP BW Click - DEV", "SAP Solman - DEV", "SAP PI - DEV",
    "SAP CBD (R3 Neoenergia) - DEV", "SAP ECD (Elektro) - DEV", "SAP NHD (RH) - DEV",
    "SAP CFD (Fiori RH) - DEV", "SAP NGD (GRC Access Control) - DEV", "SAP PSD (CCS CELPE) - DEV",
    "SAP BSD (CCS COELBA) - DEV", "SAP RSD (CCS COSERN) - DEV", "SAP PMD (CRM CELPE) - DEV",
    "SAP BMD (CRM COELBA) - DEV", "SAP RMD (CRM COSERN) - DEV", "SAP PLD (MOM CELPE) - DEV",
    "SAP BLD (MOM COELBA) - DEV", "SAP RLD (MOM COSERN) - DEV", "SAP NWD (BW Comercial) - DEV"
  ],
  "HANA": [
    "SAP PNP (HANA CELPE) - PRD", "SAP PNQ (HANA CELPE) - QA", "SAP PND (HANA CELPE) - DEV",
    "SAP BNP (HANA COELBA) - PRD", "SAP BNQ (HANA COELBA) - QA", "SAP BND (HANA COELBA) - DEV",
    "SAP RNP (HANA COSERN) - PRD", "SAP RNQ (HANA COSERN) - QA", "SAP RND (HANA COSERN) - DEV"
  ],
  "GCO": [
    "GCO NDB (Brasília) - PRD", "YGCO NDB (Brasília) - PRD"
  ],
  "SGD": [
    "SGD - PRD", "SGD Call Center - PRD"
  ]
};

export async function copiarTextoParaClipboard(texto) {
    if (!texto) return Promise.reject("Nenhum texto para copiar");
    return navigator.clipboard.writeText(texto);
}

export function gerarTemplatesAC(dados) {
    const { acao, nome, usuario_id, aplicacao, senha, email_colaborador, ambiente, gcoExistente } = dados;
    const saudacao = nome ? `Olá, ${nome}` : `Olá,`;
    
    const isHana = ambiente === "HANA" || (aplicacao && aplicacao.toUpperCase().includes("HANA"));
    const isSgd = ambiente === "SGD" || (aplicacao && aplicacao.toUpperCase().includes("SGD"));
    const isGco = ambiente === "GCO" || (aplicacao && aplicacao.toUpperCase().includes("GCO"));

    const templates = {
        assunto: acao === "novo" ? "Controle de Acessos - Novo Usuário" : "Controle de Acessos - Nova Senha",
        email: "",
        chamado: ""
    };

    const textoSeguranca = "Lembramos que a segurança das informações é uma prioridade para nós, e, como tal, a credencial fornecida é de uso pessoal e intransferível. É de sua inteira responsabilidade manter a confidencialidade desta credencial, que não deve ser compartilhada ou utilizada por terceiros.";

    // --- CORPO DO E-MAIL ---
    if (isGco && acao === "senha") {
        templates.email = `${saudacao}\n\nInformamos que a sua senha de acesso está disponível. Segue abaixo os detalhes da sua solicitação:\n\nAplicação: ${aplicacao}\nSenha: ${senha}\n\nA senha inicial é temporária, deve ser trocada na tela inicial do sistema GCO;\n\nO sistema GCO solicitará mudança da senha a cada 90 (noventa) dias e não poderão ser utilizadas as 05 (cinco) senhas anteriores;\n\nApós 5 (cinco) tentativas inválidas de acesso o usuário será bloqueado. Neste caso deve-se abrir um novo chamado para Reset de senha de usuário GCO.\n\n${rodapePadrao}`;
    } else if (acao === "novo") {
        templates.email = `${saudacao}\n\nInformamos que o novo usuário foi criado em nosso sistema.\n\nAplicação: ${aplicacao}\nNome: ${nome}\nID: ${usuario_id}\n\n${textoSeguranca}\n\n${rodapePadrao}`;
    } else {
        templates.email = `${saudacao}\n\nInformamos que a sua senha de acesso está disponível.\n\nAplicação: ${aplicacao}\nSenha: ${senha}\n\n${textoSeguranca}\n\n${rodapePadrao}`;
    }

    // --- TEXTO DO CHAMADO ---
    let observacoes = "";
    
    if (isHana) {
        observacoes = "\n\nObservação: Desmarcar a opção de auto-reconect.\n- Em caso de falha no login, orientamos a realizar o mapeamento de logins no Hana Studio do zero.";
    } else if (isSgd) {
        observacoes = "\n\nObservações:\n- Clicar primeiro em alterar a senha.\n- A senha deve ser alterada no item alterar a senha do sistema SGD.\n- Caso não altere a senha, irá perder o acesso, pois é temporária e expira em 24h.";
    } else if (isGco && acao === "novo") {
        const statusGco = gcoExistente ? 
            `Conforme verificado no sistema GCO, sua matrícula local NDB ${usuario_id} já está devidamente cadastrada.` : 
            `Conforme verificado no sistema GCO, sua matrícula local NDB não está cadastrada.\n\nPara que o acesso ao sistema GS seja liberado, é necessário abrir uma solicitação no ITNOW utilizando o formulário “Conceder acesso a Aplicações Corporativas” ou pelo link: https://iberdrola.service-now.com/itnow?id=sc_cat_item_guide&sys_id=20fc4fbddbc1af40b716e2e15b9619a6`;
        
        templates.chamado = `${saudacao}\n\nInformamos que seu chamado foi atendido com sucesso.\n\n- Aplicação: ${aplicacao}\n- ID do Usuário: ${usuario_id}\n\nObs.: O acesso deve ser realizado com a senha de rede local da Neoenergia Brasília.\n\nImportante: ${statusGco}\n\n${rodapePadrao}`;
        return templates;
    }

    templates.chamado = `${saudacao}\n\nInformamos que seu chamado foi atendido com sucesso, de acordo com a solicitação realizada. Para garantir a segurança e a confidencialidade, as credenciais de acesso necessárias foram enviadas diretamente para o seguinte endereço de e-mail: ${email_colaborador}${observacoes}\n\n${rodapePadrao}`;

    return templates;
}