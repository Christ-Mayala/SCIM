import React, { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Zap } from 'lucide-react';
import { useProperty } from '../../contexts/PropertyContext';
import { cn } from '../../lib/utils';

const DEFAULT = {
  search: '', category: '', minPrice: '', maxPrice: '',
  city: '', bedrooms: '', bathrooms: '', transactionType: '',
  minSurface: '', maxSurface: '', isBonPlan: '',
};

const CATS = [
  { v: 'Appartement', l: 'Appartement' },
  { v: 'Maison',      l: 'Maison' },
  { v: 'Hôtel',       l: 'Hôtel' },
  { v: 'Terrain',     l: 'Terrain' },
  { v: 'Commercial',  l: 'Commercial' },
  { v: 'Autre',       l: 'Autre' },
];
const TRANS = [{ v: 'location', l: 'Location' }, { v: 'vente', l: 'Vente' }];
const BEDS = ['1', '2', '3', '4', '5+'];
const BATHS = ['1', '2', '3', '4'];

const Pill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    type="button"
    className={cn(
      'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap',
      active
        ? 'bg-gold-primary text-black border-gold-primary shadow-sm shadow-gold-primary/20'
        : 'border-white/8 bg-zinc-900/60 text-zinc-500 hover:text-white hover:border-white/15',
    )}
  >
    {children}
  </button>
);

const FieldLabel = ({ children }) => (
  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">{children}</p>
);

const NativeSelect = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full bg-zinc-900/60 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-gold-primary/30 appearance-none transition-all"
  >
    <option value="" className="bg-zinc-900">{placeholder}</option>
    {options.map(o => <option key={o.v || o} value={o.v || o} className="bg-zinc-900">{o.l || o}</option>)}
  </select>
);

const NumberInput = ({ value, onChange, placeholder }) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min="0"
    className="w-full bg-zinc-900/60 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-bold text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
  />
);

const PropertyFilters = ({ className }) => {
  const { filters, setFilters, resetFilters, fetchProperties } = useProperty();
  const [local, setLocal] = useState({ ...DEFAULT, ...filters });
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  // Sync global → local when filters change externally (URL nav)
  useEffect(() => {
    setLocal(prev => ({ ...DEFAULT, ...filters }));
  }, [filters]);

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }));

  const apply = () => {
    setFilters({ ...DEFAULT, ...local });
    fetchProperties(1, { ...DEFAULT, ...local });
  };

  // Pour les filtres "pill" (transaction, catégorie, chambres, salles de bain) :
  // on lance la recherche immédiatement au clic, sans attendre Entrée/Chercher.
  const applyImmediate = (patch) => {
    const next = { ...DEFAULT, ...local, ...patch };
    setLocal(next);
    setFilters(next);
    fetchProperties(1, next);
  };

  const reset = () => {
    setLocal(DEFAULT);
    resetFilters();
    fetchProperties(1, DEFAULT);
  };

  const activeCount = Object.values(local).filter(v => String(v || '').trim() !== '').length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* ── Main search row ── */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Titre, ville, quartier..."
            value={local.search}
            onChange={e => set('search', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && apply()}
            className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-gold-primary/30 transition-all"
          />
          {local.search && (
            <button onClick={() => { set('search', ''); searchRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          className={cn(
            'flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all shrink-0',
            open || activeCount > 0
              ? 'bg-gold-primary text-black border-gold-primary shadow-lg shadow-gold-primary/20'
              : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white hover:border-white/20',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtres</span>
          {activeCount > 0 && (
            <span className={cn(
              'h-5 min-w-[20px] px-1 rounded-md text-[9px] font-black flex items-center justify-center',
              open ? 'bg-black text-gold-primary' : 'bg-gold-primary text-black',
            )}>
              {activeCount}
            </span>
          )}
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </button>

        <button
          onClick={apply}
          className="px-6 py-3.5 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 transition-all hover:-translate-y-0.5 shrink-0"
        >
          Chercher
        </button>
      </div>

      {/* ── Quick transaction pills ── */}
      <div className="flex gap-2 flex-wrap">
        <Pill active={local.transactionType === ''} onClick={() => applyImmediate({ transactionType: '' })}>Tous</Pill>
        <Pill active={local.transactionType === 'location'} onClick={() => applyImmediate({ transactionType: 'location' })}>Location</Pill>
        <Pill active={local.transactionType === 'vente'} onClick={() => applyImmediate({ transactionType: 'vente' })}>Vente</Pill>
        <span className="w-px h-6 bg-white/10 self-center mx-1" />
        {CATS.slice(0, 4).map(c => (
          <Pill key={c.v} active={local.category === c.v} onClick={() => applyImmediate({ category: local.category === c.v ? '' : c.v })}>
            {c.l}
          </Pill>
        ))}
        <span className="w-px h-6 bg-white/10 self-center mx-1" />
        <Pill
          active={Boolean(local.isBonPlan)}
          onClick={() => applyImmediate({ isBonPlan: local.isBonPlan ? '' : true })}
        >
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Bons Plans
          </span>
        </Pill>
      </div>

      {/* ── Advanced filters panel ── */}
      {open && (
        <div className="bg-zinc-900/60 border border-white/8 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">

          <div>
            <FieldLabel>Ville</FieldLabel>
            <input
              type="text"
              value={local.city}
              onChange={e => set('city', e.target.value)}
              placeholder="Ex: Brazzaville"
              className="w-full bg-zinc-900/60 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-bold text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all"
            />
          </div>

          <div>
            <FieldLabel>Catégorie</FieldLabel>
            <NativeSelect value={local.category} onChange={e => applyImmediate({ category: e.target.value })} options={CATS.map(c => ({ v: c.v, l: c.l }))} placeholder="Tous les types" />
          </div>

          <div>
            <FieldLabel>Prix min (XAF)</FieldLabel>
            <NumberInput value={local.minPrice} onChange={e => set('minPrice', e.target.value)} placeholder="0" />
          </div>

          <div>
            <FieldLabel>Prix max (XAF)</FieldLabel>
            <NumberInput value={local.maxPrice} onChange={e => set('maxPrice', e.target.value)} placeholder="∞" />
          </div>

          <div>
            <FieldLabel>Surface min (m²)</FieldLabel>
            <NumberInput value={local.minSurface} onChange={e => set('minSurface', e.target.value)} placeholder="0" />
          </div>

          <div>
            <FieldLabel>Surface max (m²)</FieldLabel>
            <NumberInput value={local.maxSurface} onChange={e => set('maxSurface', e.target.value)} placeholder="∞" />
          </div>

          <div>
            <FieldLabel>Chambres (min)</FieldLabel>
            <div className="flex gap-1.5 flex-wrap">
              {BEDS.map(b => (
                <Pill key={b} active={local.bedrooms === b} onClick={() => applyImmediate({ bedrooms: local.bedrooms === b ? '' : b })}>{b}</Pill>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Salles de bain (min)</FieldLabel>
            <div className="flex gap-1.5 flex-wrap">
              {BATHS.map(b => (
                <Pill key={b} active={local.bathrooms === b} onClick={() => applyImmediate({ bathrooms: local.bathrooms === b ? '' : b })}>{b}</Pill>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 lg:col-span-4 flex gap-3 pt-2 border-t border-white/5">
            <button
              onClick={() => { apply(); setOpen(false); }}
              className="flex-1 h-11 rounded-2xl bg-gold-primary hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold-primary/20 transition-all"
            >
              Appliquer les filtres
            </button>
            {activeCount > 0 && (
              <button
                onClick={() => { reset(); setOpen(false); }}
                className="px-6 h-11 rounded-2xl border border-white/10 bg-zinc-950/50 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2"
              >
                <X className="h-3.5 w-3.5" /> Réinitialiser
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
