import React from 'react';
import { Eye, Edit, Trash2, ArrowUpDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

const DataTable = ({
  columns,
  data,
  loading,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  statusFilter,
  onStatusChange,
  statusOptions,
  pagination,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  emptyState = 'Aucune donnée disponible',
  emptyIcon: EmptyIcon,
}) => {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
      {/* ── Header toolbar ── */}
      <div className="flex flex-col gap-4 px-6 py-5 border-b border-white/5 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/60 border border-white/5 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-primary/40 transition-all"
          />
        </div>

        {/* Status pills */}
        {statusOptions?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStatusChange?.(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                  statusFilter === opt.value
                    ? 'bg-gold-primary text-black border-gold-primary'
                    : 'text-zinc-500 border-white/5 bg-zinc-950/50 hover:text-white hover:border-white/10',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 bg-zinc-950/30">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-300 transition-colors">
                    {col.label}
                    {col.sortable && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-20 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                      Chargement...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    {EmptyIcon && (
                      <div className="h-16 w-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-600">
                        <EmptyIcon className="h-8 w-8" />
                      </div>
                    )}
                    <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">
                      {emptyState}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="group hover:bg-white/[0.025] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-5">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            title="Voir"
                            className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            title="Modifier"
                            className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-white/5 text-zinc-500 hover:text-gold-primary flex items-center justify-center transition-all"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            title="Supprimer"
                            className="h-8 w-8 rounded-lg border border-white/5 bg-zinc-900 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 flex items-center justify-center transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 0 && (
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            {pagination.totalItems ?? pagination.total ?? 0} résultat
            {(pagination.totalItems ?? pagination.total ?? 0) > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest transition-all"
            >
              Précédent
            </button>
            <span className="px-3 py-1.5 text-xs font-black text-zinc-500 bg-zinc-950/30 rounded-lg border border-white/5 whitespace-nowrap">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="h-9 px-4 rounded-xl border border-white/5 bg-zinc-950/50 text-xs font-black text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest transition-all"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
