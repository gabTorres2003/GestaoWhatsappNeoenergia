import React from 'react'

const MassiveAlert = ({ massives }) => {
  if (!massives || massives.length === 0) return null

  return (
    <div className="space-y-4">
      {massives.map((massive, idx) => (
        <div
          key={idx}
          className="bg-rose-900/40 border border-rose-500/50 p-4 rounded-2xl animate-pulse shadow-lg shadow-rose-900/20"
        >
          <div className="flex items-center gap-3">
            <div className="bg-rose-500 text-white p-2 rounded-full">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-rose-100 font-bold text-lg">
                ⚠️ Incidente Massivo Detectado:{' '}
                <span className="text-rose-400">{massive.categoria}</span>
              </h3>
              <p className="text-rose-200/70 text-sm">
                Foram identificados{' '}
                <span className="font-bold text-rose-300">{massive.count}</span>{' '}
                chamados recentes deste tipo.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {massive.incs.map((inc, i) => (
              <span
                key={i}
                className="text-[10px] font-mono bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30"
              >
                {inc}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MassiveAlert
