/**
 * Serviço para detecção de incidentes massivos
 * Regra: N chamados do mesmo tipo em uma janela de T minutos
 */

export const detectMassiveIncidents = (chamados, threshold = 3, windowMinutes = 30) => {
  const now = new Date();
  const windowMs = windowMinutes * 60 * 1000;
  
  // Agrupar chamados por categoria que foram criados dentro da janela de tempo
  const recentChamados = chamados.filter(c => {
    const createdAt = new Date(c.created_at);
    return (now - createdAt) <= windowMs;
  });

  const counts = {};
  recentChamados.forEach(c => {
    counts[c.categoria] = (counts[c.categoria] || 0) + 1;
  });

  // Filtrar categorias que ultrapassaram o limite (threshold)
  const massives = Object.entries(counts)
    .filter(([, count]) => count >= threshold)
    .map(([categoria, count]) => ({
      categoria,
      count,
      incs: recentChamados
        .filter(c => c.categoria === categoria)
        .map(c => c.inc)
    }));

  return massives;
};
