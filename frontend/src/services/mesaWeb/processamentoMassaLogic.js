export const processarTabelaServiceNow = (textoBruto) => {
    if (!textoBruto || !textoBruto.trim()) {
        return { success: false, error: 'O texto está vazio.' };
    }

    try {
        const linhas = textoBruto.split('\n').filter(l => l.trim() !== '');
        if (linhas.length < 2) {
            return { success: false, error: 'Tabela inválida. Certifique-se de copiar o cabeçalho e os dados.' };
        }

        const cabecalho = linhas[0].split('\t').map(c => c.trim().toLowerCase());
        
        const mapa = {
            inc: cabecalho.findIndex(c => c.includes('identificador') || c.includes('número') || c === 'number'),
            solicitante: cabecalho.findIndex(c => c.includes('solicitante') || c.includes('caller')),
            sistema: cabecalho.findIndex(c => c.includes('item de configuração') || c.includes('cmdb_ci') || c.includes('cat item')),
            criado: cabecalho.findIndex(c => c.includes('criado em') || c.includes('opened')),
            descricao: cabecalho.findIndex(c => c.includes('descrição resumida') || c.includes('short description')),
            grupo: cabecalho.findIndex(c => c.includes('grupo designado') || c.includes('assignment group'))
        };

        if (mapa.inc === -1) {
            return { success: false, error: 'Não foi possível identificar a coluna de Identificador (INC). Verifique se copiou o cabeçalho.' };
        }

        const fila = [];

        for (let i = 1; i < linhas.length; i++) {
            const colunas = linhas[i].split('\t');
            
            if (!colunas[mapa.inc]?.trim().startsWith('INC')) continue;

            const identificador = colunas[mapa.inc]?.trim();
            const solicitanteBruto = mapa.solicitante !== -1 ? colunas[mapa.solicitante]?.trim() : 'Solicitante não encontrado';
            const sistemaExtraido = (mapa.sistema !== -1 && colunas[mapa.sistema]?.trim() !== '(vazia)') 
                                    ? colunas[mapa.sistema]?.trim() 
                                    : 'Sistema não identificado';
            const dataCriacao = mapa.criado !== -1 ? colunas[mapa.criado]?.trim() : '--/--/----';
            const descricao = mapa.descricao !== -1 ? colunas[mapa.descricao]?.trim() : '';

            let nome = solicitanteBruto;
            let matricula = '';
            if (solicitanteBruto.includes(' - ')) {
                const partes = solicitanteBruto.split(' - ');
                nome = partes[0].trim();
                matricula = partes[partes.length - 1].trim();
            }

            const isPriority = 
                sistemaExtraido.toUpperCase().includes('GSE') || 
                sistemaExtraido.toUpperCase().includes('MULTI_FACTOR') || 
                descricao.toUpperCase().includes('GSE') ||
                descricao.toUpperCase().includes('RESET');

            fila.push({
                id: crypto.randomUUID(),
                registro: identificador,
                nome: nome,
                matricula: matricula,
                sistema: sistemaExtraido,
                dataExibicao: dataCriacao,
                descricao: descricao,
                isPriority: isPriority,
                acao: 'reset',
                senha: '',
                concluido: false
            });
        }

        if (fila.length === 0) {
            return { success: false, error: 'Nenhum chamado válido encontrado após o cabeçalho.' };
        }

        return { success: true, fila };
    } catch (err) {
        return { success: false, error: 'Erro crítico: ' + err.message };
    }
};