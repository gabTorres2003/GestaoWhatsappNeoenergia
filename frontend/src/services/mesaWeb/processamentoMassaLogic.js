export function processarTabelaServiceNow(rawData) {
    if (!rawData) return { success: false, error: "Nenhum dado inserido." };
    
    const linhas = rawData.trim().split(/\r?\n/);
    if (linhas.length < 2) {
        if (linhas.length === 1 && linhas[0].toLowerCase().includes("nenhum registro")) {
            return { success: false, error: "A tabela copiada está vazia (Nenhum registro a exibir)." };
        }
        return { success: false, error: "Dados insuficientes. Copie a linha de títulos e os chamados." };
    }

    let headerIndex = -1;
    let map = { inc: -1, solicitante: -1, criado: -1, desc: -1 };

    for (let i = 0; i < Math.min(linhas.length, 5); i++) {
        const cols = linhas[i].split('\t').map(h => h.trim().toLowerCase());
        const findIndex = (keywords) => cols.findIndex((h) => keywords.some((k) => h === k || h.includes(k)));

        const incIdx = findIndex(['identificador', 'incident', 'inc', 'number']);
        
        if (incIdx !== -1) {
            headerIndex = i;
            map = {
                inc: incIdx,
                solicitante: findIndex(['solicitante', 'caller', 'requested', 'usuário', 'usuario']),
                criado: findIndex(['criado em', 'criado', 'created', 'aberto', 'opened']),
                desc: findIndex(['descrição resumida', 'short description', 'descrição']),
            };
            break;
        }
    }

    if (headerIndex === -1 || map.inc === -1) {
        return { success: false, error: "Erro: Cabeçalho não identificado. Certifique-se de copiar a linha com os nomes das colunas." };
    }

    const dataLines = linhas.slice(headerIndex + 1);
    
    if (dataLines.length === 0 || (dataLines.length === 1 && dataLines[0].toLowerCase().includes("nenhum registro a exibir"))) {
        return { success: false, error: "A tabela copiada está vazia (Nenhum registro a exibir)." };
    }

    const filaProcessada = dataLines.map((linha) => {
        const col = linha.split('\t').map((c) => c.trim());

        const realIncIndex = col.findIndex(c => c.match(/^INC\d+/));

        if (realIncIndex === -1) return null;
        const inc = col[realIncIndex];
        const offset = realIncIndex - map.inc; 
        const getCol = (mapIndex) => {
            if (mapIndex === -1) return '';
            const idx = mapIndex + offset;
            return col[idx] ? col[idx] : '';
        };

        const descricao = getCol(map.desc).toUpperCase();
        const ehGse = descricao.includes('GSE');
        const ehUe = descricao.includes('UE WEB') || descricao.includes('UEWEB') || descricao.includes('UE-WEB');

        let sistemaFinal = 'Apenas Nota (15 min)';
        if (ehGse) {
            const dist = descricao.match(/COELBA|COSERN|PERNAMBUCO/i);
            sistemaFinal = `GSE (${dist ? dist[0].toUpperCase() : 'COELBA'}) - PRD`; 
        } else if (ehUe) {
            sistemaFinal = 'UE WEB (CS) - PRD';
        }

        const nomeMatricula = getCol(map.solicitante);
        const partes = nomeMatricula.split(' - ');
        const nomeLimpo = partes[0] ? partes[0].trim() : '';
        const matricula = partes[1] ? partes[1].split(' ')[0].trim() : '';

        const dataRaw = getCol(map.criado);
        const dataObj = dataRaw ? new Date(dataRaw.replace(/-/g, '/')) : new Date();

        return {
            idUnico: Math.random().toString(36).substring(7),
            registro: inc,
            nome: nomeLimpo,
            matricula: matricula,
            data: dataObj,
            dataExibicao: dataRaw,
            sistema: sistemaFinal,
            isPriority: ehGse || ehUe,
            acao: descricao.toLowerCase().includes('reset') ? 'reset' : 'unlock',
            concluido: false,
            senha: ''
        };
    }).filter(Boolean); // Remove os nulls 

    if (filaProcessada.length === 0) {
        return { success: false, error: "Nenhum chamado válido identificado nas linhas copiadas. Verifique se o texto copiado está correto." };
    }
    filaProcessada.sort((a, b) => a.data - b.data);

    return { success: true, fila: filaProcessada };
}