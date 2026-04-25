import React, { useEffect, useState } from 'react';
import { calculateSLA } from '../services/sla';

const SLAIndicator = ({ createdAt }) => {
  const [sla, setSLA] = useState(calculateSLA(createdAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setSLA(calculateSLA(createdAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  const { status, formattedTime, color } = sla;

  const statusIcons = {
    'DENTRO_PRAZO': '🟢',
    'PROXIMO_ATRASO': '🟡',
    'ATRASADO': '🔴'
  };

  if (statusAtual !== 'ABERTO') {
    return {
      status: 'CONCLUIDO',
      color: 'text-slate-400',
      formattedTime: '--:--'
    };
  }

  return (
    <div className={`flex items-center gap-2 font-mono font-bold ${color}`}>
      <span>{statusIcons[status]}</span>
      <span className="text-sm">{formattedTime}</span>
    </div>
  );
};

export default SLAIndicator;
