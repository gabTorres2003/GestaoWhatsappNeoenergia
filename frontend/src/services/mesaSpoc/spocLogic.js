export function processarTabelaSpoc(rawData) {
    if (!rawData.trim()) {
        return { success: false, error: 'Por favor, cole os dados da tabela do ServiceNow.' };
    }

    const text = rawData.replace(/\r\n/g, '\n');
    const matches = [...text.matchAll(/(INC\d+)/g)];

    if (matches.length === 0) {
        return { success: false, error: 'Nenhum incidente (INC) foi encontrado no texto inserido.' };
    }

    const fila = [];

    matches.forEach((match, i) => {
        const start = match.index;
        const end = matches[i + 1] ? matches[i + 1].index : text.length;
        const block = text.substring(start, end);

        const identificador = match[1];

        // 1. Solicitante
        let solicitante = '';
        const primeiraLinha = block.split('\n')[0];
        const restoLinha = primeiraLinha.replace(identificador, '').trim();
        const colunaSolicitante = restoLinha.split(/\t| {2,}/)[0] || '';
        
        const matchMatricula = colunaSolicitante.match(/(.+?)\s*-\s*[A-Z0-9]{6,8}$/i);
        if (matchMatricula) {
            solicitante = matchMatricula[1].trim();
        } else {
            solicitante = colunaSolicitante.trim();
        }

        // 2. Datas
        const datasEncontradas = [...block.matchAll(/(\d{4}-\d{2}-\d{2})\s+?(\d{2}:\d{2}:\d{2})/g)];
        let criadoEm = '';
        let atualizadoEm = '';

        if (datasEncontradas.length > 0) {
            const [_, ymdC, hmsC] = datasEncontradas[0];
            const [yC, mC, dC] = ymdC.split('-');
            criadoEm = `${dC}/${mC}/${yC} ${hmsC}`;
            
            if (datasEncontradas.length > 1) {
                const [_, ymdA, hmsA] = datasEncontradas[1];
                const [yA, mA, dA] = ymdA.split('-');
                atualizadoEm = `${dA}/${mA}/${yA} ${hmsA}`;
            }
        }

        // 3. Referência Externa
        const matchRefExterna = block.match(/(?:Referência externa|Chamado filho|Ref\. Externa)[\s:]*([A-Z]{3,4}\d+)/i) 
                             || block.match(/(?:INC|TASK|REQ|WO)\d+/gi); 
                             
        let referenciaExterna = '';
        if (matchRefExterna) {
             const possíveisRefs = Array.isArray(matchRefExterna) ? matchRefExterna : [matchRefExterna[1]];
             const refValida = possíveisRefs.find(ref => ref && ref !== identificador);
             referenciaExterna = refValida || '';
        }

        // 4. Razão para Esperar
        let razaoEsperar = '';
        if (/resposta do colaborador/i.test(block)) razaoEsperar = 'Resposta do Colaborador';
        else if (/resposta do fornecedor/i.test(block) || /resposta fornecedor/i.test(block)) razaoEsperar = 'Resposta Fornecedor';

        // 5. Estado
        let estado = '';
        if (/Em andamento/i.test(block)) estado = 'Em andamento';
        else if (/Aguardando/i.test(block)) estado = 'Aguardando';
        else if (/Resolvido/i.test(block)) estado = 'Resolvido';
        else if (/Designado/i.test(block)) estado = 'Designado';

        // 6. Localização
        const matchLocalizacao = block.match(/Loja.*?:\s*(.*)/i) || block.match(/Localização.*?:\s*(.*)/i);
        let localizacao = matchLocalizacao ? matchLocalizacao[1].trim() : '';

        // 7. Atribuído a
        let atribuidoA = '';
        const matchAtribuido = block.match(/(?:Atribuído a|Assigned to)[\s:]*([A-ZÀ-Ÿa-z\s]+)/i);
        if (matchAtribuido && matchAtribuido[1].trim() !== '(vazia)') {
            atribuidoA = matchAtribuido[1].trim();
        }

        // 8. Atualizada por
        let atualizadaPor = '';
        const matchAtualizadaPor = block.match(/(?:Atualizado por|Updated by)[\s:]*([A-ZÀ-Ÿa-z\s]+)/i);
         if (matchAtualizadaPor && matchAtualizadaPor[1].trim() !== '(vazia)') {
            atualizadaPor = matchAtualizadaPor[1].trim();
        }

        // 9. Extração de Telefone (Novo)
        let telefone = '';
        const matchTelefone = block.match(/telefone(?: para contato)?.*?:\s*([0-9\-\s\/]+)/i);
        if (matchTelefone) {
            telefone = matchTelefone[1].trim();
        }

        fila.push({
            id: crypto.randomUUID(),
            identificador,
            solicitante,
            telefone,
            criadoEm,
            atualizadoEm,
            referenciaExterna,
            razaoEsperar,
            estado,
            localizacao,
            atribuidoA,
            atualizadaPor,
            concluido: false
        });
    });

    return { success: true, fila };
}

export const copiarTexto = async (texto) => {
    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch (err) {
        console.error('Falha ao copiar texto: ', err);
        return false;
    }
};