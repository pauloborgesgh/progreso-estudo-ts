import { memo, useMemo, useState } from 'react';
import { BarChart3, CalendarDays, ChevronDown, PieChart as PieIcon } from 'lucide-react';
import type { Semana } from '../types/study';

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

function PieChart({ segments, size = 220 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  let currentAngle = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" style={{ maxHeight: size }}>
      {segments.map((seg, i) => {
        if (seg.value <= 0) return null;
        const sliceAngle = (seg.value / total) * 360;
        const path = describeArc(cx, cy, r, currentAngle, currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        const midAngle = currentAngle - sliceAngle / 2;
        const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);
        return (
          <g key={i}>
            <path d={path} fill={seg.color} opacity={0.85}>
              <title>{`${seg.label}: ${seg.value}`}</title>
            </path>
            {seg.value / total >= 0.05 && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize="11"
                fontWeight="bold"
              >
                {Math.round((seg.value / total) * 100)}%
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--bg-card)" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="24" fontWeight="bold">
        {Math.round((segments[0]?.value ?? 0) / total * 100)}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="10">
        concluído
      </text>
    </svg>
  );
}

interface StatsDashboardProps {
  datasEstudo: string[];
  progressoPorSemana: number[];
  planoEstudo: Semana[];
  diasConcluidos: number;
  totalDias: number;
}

const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: { date: Date; day: number; isToday: boolean }[] = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const today = new Date();
    days.push({ date, day: d, isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear() });
  }
  const startPad = firstDay.getDay();
  return { days, startPad };
}

const StatsDashboard = memo(function StatsDashboard({
  datasEstudo,
  progressoPorSemana,
  planoEstudo,
  diasConcluidos,
  totalDias,
}: StatsDashboardProps) {
  const [showCharts, setShowCharts] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  const hoje = useMemo(() => new Date(), []);
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const { days: monthDays, startPad } = useMemo(
    () => getMonthDays(anoAtual, mesAtual),
    [anoAtual, mesAtual]
  );

  const dataStrSet = useMemo(
    () => new Set(datasEstudo),
    [datasEstudo]
  );

  const barMax = useMemo(
    () => Math.max(...progressoPorSemana, 100),
    [progressoPorSemana]
  );

  const BAR_W = 32;
  const BAR_GAP = 8;
  const svgW = progressoPorSemana.length * (BAR_W + BAR_GAP) + 40;
  const svgH = 200;

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowCharts(prev => !prev)}
        className="flex items-center gap-2 text-sm font-medium mb-4 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        aria-expanded={showCharts}
      >
        <BarChart3 className="w-4 h-4" />
        Dashboard de Estatísticas
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${showCharts ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>

      {showCharts && (
        <div className="animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gráfico de Barras: Progresso por Semana */}
            <div className="rounded-2xl p-5 border backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Progresso por Semana
              </h3>
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: '200px' }}>
                {progressoPorSemana.map((val, i) => {
                  const barH = (val / barMax) * (svgH - 40);
                  const x = 20 + i * (BAR_W + BAR_GAP);
                  const y = svgH - 20 - barH;
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width={BAR_W}
                        height={barH}
                        rx={4}
                        fill={val === 100 ? '#22c55e' : '#3b82f6'}
                        opacity={0.8}
                        className="transition-all duration-300 hover:opacity-100"
                      >
                        <title>{`Semana ${i + 1}: ${val}%`}</title>
                      </rect>
                      <text
                        x={x + BAR_W / 2}
                        y={svgH - 4}
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize="10"
                      >
                        S{i + 1}
                      </text>
                      <text
                        x={x + BAR_W / 2}
                        y={y - 6}
                        textAnchor="middle"
                        fill={val === 100 ? '#22c55e' : '#60a5fa'}
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Gráfico de Pizza */}
            <div className="rounded-2xl p-5 border backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <PieIcon className="w-4 h-4 text-purple-400" />
                Distribuição do Progresso
              </h3>
              <div className="flex flex-col items-center">
                <PieChart
                  segments={[
                    { value: diasConcluidos, color: '#22c55e', label: 'Concluídos' },
                    { value: totalDias - diasConcluidos, color: 'var(--bg-card)', label: 'Restantes' },
                  ]}
                />
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#22c55e' }} />
                    {diasConcluidos} concluídos
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
                    {totalDias - diasConcluidos} restantes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendário do Mês */}
          <div className="rounded-2xl p-5 border backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setShowCalendar(prev => !prev)}
              className="w-full flex items-center gap-2 mb-4 text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-primary)' }}
              aria-expanded={showCalendar}
            >
              <CalendarDays className="w-4 h-4 text-green-400" />
              {monthNames[mesAtual]} {anoAtual}
              <ChevronDown
                className={`w-4 h-4 ml-auto transition-transform duration-200 ${showCalendar ? 'rotate-180' : ''}`}
                style={{ color: 'var(--text-muted)' }}
              />
            </button>
            {showCalendar && (<>
            <div className="grid grid-cols-7 gap-1 max-w-xs">
              {dayLabels.map(label => (
                <div key={label} className="text-[10px] text-center font-medium" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </div>
              ))}
              {Array.from({ length: startPad }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {monthDays.map((d) => {
                const dateStr = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
                const studied = dataStrSet.has(dateStr);
                return (
                  <div
                    key={d.day}
                    className={`aspect-square rounded-md flex items-center justify-center text-[11px] font-medium transition-colors ${
                      d.isToday ? 'ring-2 ring-blue-400' : ''
                    }`}
                    style={{
                      backgroundColor: studied ? '#22c55e' : 'var(--bg-card)',
                      color: studied ? '#fff' : 'var(--text-muted)',
                      border: studied ? 'none' : '1px solid var(--border-color)',
                    }}
                    title={`${dateStr}${studied ? ' ✓' : ''}`}
                  >
                    {d.day}
                  </div>
                );
              })}
            </div>
              <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
                  Estudado
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
                  Não estudado
                </span>
              </div>
            </>)}
          </div>

          {/* Barra de Progresso Consolidada */}
          <div className="rounded-2xl p-5 border backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Visão Geral
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {diasConcluidos} de {totalDias} dias concluídos
              </span>
            </div>
            <div className="h-6 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
              {planoEstudo.map((_, i) => {
                const pct = progressoPorSemana[i] || 0;
                if (pct === 0) return null;
                const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#ec4899'];
                return (
                  <div
                    key={i}
                    className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
                    style={{
                      width: `${pct / planoEstudo.length}%`,
                      backgroundColor: colors[i % colors.length],
                      opacity: 0.8,
                    }}
                    title={`Semana ${i + 1}: ${pct}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {planoEstudo.map((_, i) => {
                const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#ec4899'];
                return (
                  <span key={i} className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: colors[i % colors.length] }} />
                    S{i + 1}: {progressoPorSemana[i]}%
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default StatsDashboard;
