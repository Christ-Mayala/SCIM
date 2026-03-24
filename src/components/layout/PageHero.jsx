import React from 'react';
import { cn } from '../../lib/utils';

const PageHero = ({
  badgeIcon: BadgeIcon,
  badgeText,
  title,
  description,
  backgroundImage,
  actions,
  children,
  className,
  containerClassName,
  aligned = 'center'
}) => {
  return (
    <section className={cn('relative overflow-hidden bg-zinc-950 text-white', className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-gold-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px]" />
        
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{ backgroundImage: `url("${backgroundImage}")`, opacity: 0.35 }}
          />
        )}
        {/* Dark overlay — lighter when we have a bg image to keep it visible */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b",
          backgroundImage
            ? "from-zinc-950/40 via-zinc-950/60 to-zinc-950"
            : "from-zinc-950/20 via-zinc-950/80 to-zinc-950"
        )} />
      </div>

      <div className={cn(
        'relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-20 lg:pb-32', 
        aligned === 'center' ? 'text-center' : 'text-left',
        containerClassName
      )}>
        <div className={cn('max-w-4xl', aligned === 'center' && 'mx-auto')}>
          {badgeText ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in shadow-lg shadow-gold-primary/5">
              {BadgeIcon ? <BadgeIcon className="h-3 w-3" /> : null}
              <span>{badgeText}</span>
            </div>
          ) : null}

          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            {title}
          </h1>

          {description ? (
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              {description}
            </p>
          ) : null}

          {actions ? (
            <div className={cn('flex flex-wrap gap-4 items-center', aligned === 'center' ? 'justify-center' : 'justify-start')}>
              {actions}
            </div>
          ) : null}

          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>

      {/* Bottom fade to zinc-950 instead of white SVG slope */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none" />
    </section>
  );
};

export default PageHero;
