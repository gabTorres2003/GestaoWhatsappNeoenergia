export function processarTabelaServiceNow(rawData) {
    if (!rawData) return { success: false, error: "Nenhum dado inserido." };
    
    const linhas = rawData.split('\n');
    if (linhas.length < 2) return { success: false, error: "Tabela inválida ou sem registros." };

    const header = linhas[0].split('\t').map((h) => h.trim().toLowerCase());
    const findIndex = (keywords) => header.findIndex((h) => keywords.some((k) => h.includes(k)));

    const map = {
        inc: findIndex(['identificador', 'incident', 'inc']),
        solicitante: findIndex(['solicitante', 'caller', 'requested', 'usuário', 'usuario']),
        criado: findIndex(['criado', 'created', 'aberto']),
        desc: findIndex(['descrição resumida', 'short description', 'descrição']),
    };

    if (map.inc === -1 || map.solicitante === -1) {
        return { success: false, error: "Erro: Cabeçalho não identificado. Copie a linha de títulos da tabela." };
    }

    const filaProcessada = linhas.slice(1).map((linha) => {
        let col = linha.split('\t').map((c) => c.trim());
        while (col.length && col[0] === '') col.shift();

        const inc = col[map.inc];
        if (!inc || !inc.match(/^INC\d+/)) return null;

        const descricao = (col[map.desc] || '').toUpperCase();
        const ehGse = descricao.includes('GSE');
        const ehUe = descricao.includes('UE WEB') || descricao.includes('UEWEB') || descricao.includes('UE-WEB');

        let sistemaFinal = 'Apenas Nota (15 min)';
        if (ehGse) {
            const dist = descricao.match(/COELBA|COSERN|PERNAMBUCO/i);
            // Ajustado para bater com o Select do ScriptsSD
            sistemaFinal = `GSE (${dist ? dist[0].toUpperCase() : 'COELBA'}) - PRD`; 
        } else if (ehUe) {
            sistemaFinal = 'UE WEB (CS) - PRD';
        }

        const nomeMatricula = col[map.solicitante] || '';
        const partes = nomeMatricula.split(' - ');
        const nomeLimpo = partes[0].trim();
        const matricula = partes[1] ? partes[1].split(' ')[0].trim() : '';

        const dataRaw = col[map.criado] || '';
        const dataObj = new Date(dataRaw.replace(/-/g, '/'));

        return {
            idUnico: Math.random().toString(36).substring(7), // Para controle interno
            registro: inc,
            nome: nomeLimpo,
            matricula: matricula,
            data: dataObj,
            dataExibicao: dataRaw,
            sistema: sistemaFinal,
            isPriority: ehGse || ehUe,
            acao: descricao.toLowerCase().includes('reset') ? 'reset' : 'unlock',
            concluido: false,
            senha: '' // Campo de senha vazio inicialmente
        };
    }).filter(Boolean);

    if (filaProcessada.length === 0) {
        return { success: false, error: "Nenhum chamado identificado." };
    }

    // Ordena por data
    filaProcessada.sort((a, b) => a.data - b.data);

    return { success: true, fila: filaProcessada };
}