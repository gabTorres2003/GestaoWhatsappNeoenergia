/**
 * Gerador de scripts dinâmicos para atendimento
 */

const TEMPLATES = {
  PRIMEIRO_CONTATO: (incs, nome = 'Equipe') => `Bom dia, @${nome}!
  
Solicitada a prioridade e previsão de atendimento para os chamados abaixo:

(${incs.join(', ')})

Voltamos em 15 minutos com mais informações!`,

  SOLICITACAO_PREVISAO: (incs) => `Olá, bom dia!
  
Poderia nos informar a previsão de atendimento para o(s) chamado(s) abaixo?

(${incs.join(', ')})`,

  NORMALIZADO: (incs) => `Prezados, 
  
Informamos que a falha reportada nos chamados abaixo foi normalizada.

(${incs.join(', ')})

Favor validar o acesso.`,

  FINALIZADO: (incs) => `Bom dia!
  
Chamados finalizados e validados com o usuário.

(${incs.join(', ')})`
};

export const generateScript = (tipo, incs, nome) => {
  const template = TEMPLATES[tipo];
  if (!template) return 'Template não encontrado';
  return template(incs, nome);
};
