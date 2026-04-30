export function processarTabelaServiceNow(rawData) {
    if (!rawData.trim()) {
        return { success: false, error: 'Por favor, cole os dados da tabela.' };
    }

    const text = rawData.replace(/\r\n/g, '\n');
    const matches = [...text.matchAll(/(INC\d+)/g)];

    if (matches.length === 0) {
        return { success: false, error: 'Nenhum incidente (INC) foi encontrado.' };
    }

    const fila = [];

    matches.forEach((match, i) => {
        const start = match.index;
        const end = matches[i + 1] ? matches[i + 1].index : text.length;
        const block = text.substring(start, end);

        const incRegistro = match[1];

        const dateMatch = block.match(/(\d{4}-\d{2}-\d{2})\s+?(\d{2}:\d{2}:\d{2})/);
        let incCriadoEm = '';
        if (dateMatch) {
            const [_, ymd, hms] = dateMatch;
            const [y, m, d] = ymd.split('-');
            incCriadoEm = `${d}/${m}/${y} ${hms}`;
        }

        const solicitanteMatch = block.match(/([A-ZÀ-Ÿa-z\s]+?)\s*-\s*([A-Z0-9]{6,8})/i);
        let incNome = '';
        let incMatricula = '(PENDENTE)';
        const primeiraLinha = block.split('\n')[0];
        const restoLinha = primeiraLinha.replace(/INC\d+\s+/, '').trim();
        const colunaSolicitante = restoLinha.split(/\t| {2,}/)[0] || '';
        const matchMatricula = colunaSolicitante.match(/(.+?)\s*-\s*([A-Z0-9]{6,8})$/i);
        
        if (matchMatricula) {
            incNome = matchMatricula[1].trim();
            incMatricula = matchMatricula[2].trim();
        } else {
            incNome = colunaSolicitante.trim();
        }

        let incSistema = 'NÃO IDENTIFICADO';

        if (/GSE\s*\(COSERN\)/i.test(block)) incSistema = 'GSE (COSERN) - PRD';
        else if (/GSE\s*\(PERNAMBUCO\)/i.test(block)) incSistema = 'GSE (PERNAMBUCO) - PRD';
        else if (/GSE\s*\(COELBA\)/i.test(block)) incSistema = 'GSE (COELBA) - PRD';
        else if (/UE\s*WEB/i.test(block)) incSistema = 'UE WEB (CS) - PRD';
        else if (/MFA/i.test(block)) incSistema = 'MFA (Autenticador)'; 

        let acaoInferida = 'reset';
        if (/Desbloqueio/i.test(block)) acaoInferida = 'unlock';

        const isPriority = /GSE|UE\s*WEB|MFA/i.test(block);

        fila.push({
            id: crypto.randomUUID(),
            registro: incRegistro,
            nome: incNome,
            matricula: incMatricula,
            dataExibicao: incCriadoEm,
            sistema: incSistema,
            acao: acaoInferida,
            senha: '',
            isPriority: isPriority,
            concluido: false
        });
    });

    return { success: true, fila };
}