/**
 * Parser para extrair dados de mensagens do WhatsApp
 * Regex para INC: INC\s?\d+
 */
export const parseWhatsAppText = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const chamados = [];

  // Padrão para identificar um novo chamado (geralmente começa com INC ou data)
  const incRegex = /INC\s?\d+/gi;
  
  let currentText = text;
  let match;
  
  // Encontrar todos os INCs no texto
  const matches = [...text.matchAll(incRegex)];
  
  if (matches.length === 0) return [];

  return matches.map((match, index) => {
    const inc = match[0].toUpperCase().replace(/\s/g, '');
    const startPos = match.index;
    const endPos = matches[index + 1] ? matches[index + 1].index : text.length;
    const block = text.substring(startPos, endPos);
    
    // Tenta extrair Loja/Local (exemplo: "Loja: Centro" ou "Local: Shopping")
    const lojaMatch = block.match(/(?:Loja|Local|Agência):\s*([^\n\r]+)/i);
    const loja = lojaMatch ? lojaMatch[1].trim() : 'Não identificada';

    // Tenta extrair Ocorrência
    const ocorrenciaMatch = block.match(/(?:Ocorrência|Problema|Falha):\s*([^\n\r]+)/i);
    const ocorrencia = ocorrenciaMatch ? ocorrenciaMatch[1].trim() : block.split('\n')[0].replace(match[0], '').trim();

    return {
      id: crypto.randomUUID(),
      inc,
      loja,
      ocorrencia,
      texto_bruto: block.trim(),
      data_importacao: new Date().toISOString()
    };
  });
};
