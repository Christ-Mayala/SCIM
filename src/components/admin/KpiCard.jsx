import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import Sparkline from './Sparkline';

const KpiCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  color = 'gold',
  description,
  sparklineData,
  className,
}) => {
  const colorStyles = {
    gold: { text: 'text-gold-primary', bg: 'bg-gold-primary/10', border: 'border-gold-primary/20' },
    blue: { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    emerald: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    violet: { text: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    orange: { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    red: { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  };

  const styles = colorStyles[color];

  return (
    <div className={cn(
      "bg-zinc-900/40 border border-white/5 rounded-3xl p-5 transition-all hover:border-white/10 hover:bg-zinc-900/60 group",
      className
    )}>
      {/* Top Section */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 leading-tight">
            {title}
          </p>
          <h3 className="text-2xl font-black text-white tracking-tight leading-none truncate">
            {value}
          </h3>
        </div>
        <div className={cn(
          "h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center border border-white/5 transition-all group-hover:scale-105",
          styles.bg
        )}>
          <Icon className={cn("h-5 w-5", styles.text)} />
        </div>
      </div>

      {/* Trend & Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0",
              trend === 'up'      ? "bg-emerald-500/10 text-emerald-500" :
              trend === 'pending' ? "bg-orange-500/10 text-orange-500"  :
                                    "bg-red-500/10 text-red-500"
            )}>
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> :
               trend === 'pending' ? <Clock className="h-3 w-3" /> :
               <ArrowDownRight className="h-3 w-3" />}
              <span className="truncate max-w-[80px]">{trendValue}</span>
            </div>
          )}
          {trendLabel && (
            <span className="text-[10px] font-medium text-zinc-600 truncate">{trendLabel}</span>
          )}
        </div>
        <div className="h-8 w-20 shrink-0">
          <Sparkline
            data={sparklineData}
            color={color === 'gold' ? '#d4af37' : color === 'emerald' ? '#10b981' : color === 'orange' ? '#f59e0b' : color === 'red' ? '#ef4444' : '#6366f1'}
          />
        </div>
      </div>

      {description && (
        <p className="text-[10px] text-zinc-600 mt-3 pt-3 border-t border-white/5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default KpiCard;
