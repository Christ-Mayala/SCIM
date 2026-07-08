import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const ActivityTimeline = ({ activities }) => (
  <div className="space-y-5">
    {activities.map((activity, index) => {
      const Icon = activity.icon || Clock;
      return (
        <div key={index} className="flex gap-4">
          <div className="relative flex flex-col items-center">
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center border-2 z-10",
              activity.status === 'success'
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : activity.status === 'warning'
                ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                : "bg-zinc-800 border-white/10 text-zinc-400"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            {index < activities.length - 1 && (
              <div className="w-px h-full bg-white/5 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-white">
                {activity.title}
              </p>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                {activity.time}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{activity.description}</p>
            {activity.badge && (
              <span className={cn(
                "inline-block mt-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                activity.status === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                activity.status === 'warning' ? "bg-orange-500/10 text-orange-500" :
                "bg-zinc-800 text-zinc-500"
              )}>
                {activity.badge}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default ActivityTimeline;
