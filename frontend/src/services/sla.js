export const calculateSLA = (dataCriacao, status) => {
  if (!dataCriacao) {
    return {
      status: 'SEM_DATA',
      color: 'text-slate-400',
      formattedTime: '--:--'
    };
  }

  const createdDate = new Date(dataCriacao);
  const now = new Date();
  const deadline = new Date(createdDate.getTime() + 15 * 60 * 1000);
  
  const diffMs = deadline.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);

  let statusSLA = 'DENTRO_PRAZO'; // 🟢
  let color = 'text-emerald-500';

  if (diffMinutes < 5 && diffMinutes >= 0) {
    statusSLA = 'PROXIMO_ATRASO'; // 🟡
    color = 'text-amber-500';
  } else if (diffMinutes < 0) {
    statusSLA = 'ATRASADO'; // 🔴
    color = 'text-rose-500';
  }

  if (status !== 'ABERTO') {
    return {
      status: 'CONCLUIDO',
      color: 'text-slate-400',
      formattedTime: '--:--'
    };
  }

  return {
    deadline,
    minutesLeft: diffMinutes,
    secondsLeft: diffSeconds,
    status: statusSLA,
    color,
    isLate: diffMinutes < 0,
    formattedTime: `${diffMinutes}:${Math.abs(diffSeconds).toString().padStart(2, '0')}`
  };
};