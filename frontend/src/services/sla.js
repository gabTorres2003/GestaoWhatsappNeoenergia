/**
 * Cálculo de SLA baseado na regra de 15 minutos
 */

export const calculateSLA = (dataCriacao) => {
  const createdDate = new Date(dataCriacao);
  const now = new Date();
  const deadline = new Date(createdDate.getTime() + 15 * 60 * 1000); // 15 minutos em ms
  
  const diffMs = deadline.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);

  let status = 'DENTRO_PRAZO'; // 🟢
  let color = 'text-emerald-500';

  if (diffMinutes < 5 && diffMinutes >= 0) {
    status = 'PROXIMO_ATRASO'; // 🟡
    color = 'text-amber-500';
  } else if (diffMinutes < 0) {
    status = 'ATRASADO'; // 🔴
    color = 'text-rose-500';
  }

  return {
    deadline,
    minutesLeft: diffMinutes,
    secondsLeft: diffSeconds,
    status,
    color,
    isLate: diffMinutes < 0,
    formattedTime: `${diffMinutes}:${Math.abs(diffSeconds).toString().padStart(2, '0')}`
  };
};
