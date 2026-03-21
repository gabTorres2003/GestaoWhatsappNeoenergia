/**
 * Mapeamento baseado nos dados reais fornecidos:
 * Assunto -> (Primeira equipe -> Equipe atual)
 */

const REGRAS_CLASSIFICACAO = [
  {
    categoria: 'SAP BASIS',
    palavras_chave: ['sap basis', 'lentidão no sistema comercial sap', 'lentidão no sap', 'lentidão no sap crm'],
    equipe_primeira: 'L2-NE-IT SAP BASIS',
    equipe_final: 'L2-NE-IT SAP BASIS'
  },
  {
    categoria: 'SAP CCS',
    palavras_chave: ['falha no sap', 'sap ccs'],
    equipe_primeira: 'L2-NE-IT SAP BASIS',
    equipe_final: 'L3-NE-SAP CCS'
  },
  {
    categoria: 'GR',
    palavras_chave: ['gr', 'squadra gr', 'boc', 'falha no gr'],
    equipe_primeira: 'L2-NE-SQUADRA GR',
    equipe_final: 'L2-NE-IT BOC'
  },
  {
    categoria: 'CANAIS DIGITAIS',
    palavras_chave: ['agência virtual', 'canais digitais', 'portal gd'],
    equipe_primeira: 'LB-NE-CANAIS DIGITAIS',
    equipe_final: 'LB-NE-CANAIS DIGITAIS'
  },
  {
    categoria: 'SALESFORCE',
    palavras_chave: ['salesforce', 'falha no salesforce'],
    equipe_primeira: 'L2-NE-SALESFORCE',
    equipe_final: 'L2-NE-SALESFORCE'
  },
  {
    categoria: 'URA',
    palavras_chave: ['ura', 'protocolo da ura'],
    equipe_primeira: 'L2-NE-IT WSO2 INFRA',
    equipe_final: 'L3-NE-IT APP AND DATABASE'
  },
  {
    categoria: 'TOTEM',
    palavras_chave: ['sga', 'totem neo'],
    equipe_primeira: 'L2-NE-TOTEM NEO',
    equipe_final: 'L2-NE-TOTEM NEO'
  },
  {
    categoria: 'CITRIX',
    palavras_chave: ['citrix', 'lentidão citrix'],
    equipe_primeira: 'L2-NE-IT CITRIX',
    equipe_final: 'L2-NE-IT SAP BASIS'
  },
  {
    categoria: 'BOC/TS',
    palavras_chave: ['ts', 'falha no ts'],
    equipe_primeira: 'L2-NE-IT BOC',
    equipe_final: 'L2-NE-IT BOC'
  }
];

export const classifyChamado = (texto) => {
  const lowText = texto.toLowerCase();
  
  // Encontra a regra com maior número de correspondências ou a primeira que bater
  const rule = REGRAS_CLASSIFICACAO.find(r => 
    r.palavras_chave.some(kw => lowText.includes(kw))
  );

  if (rule) {
    return {
      categoria: rule.categoria,
      equipe_primeira: rule.equipe_primeira,
      equipe_final: rule.equipe_final
    };
  }

  // Fallback padrão
  return {
    categoria: 'OUTROS',
    equipe_primeira: 'L1-NE-SERVICE DESK',
    equipe_final: 'L2-NE-IT BOC'
  };
};
