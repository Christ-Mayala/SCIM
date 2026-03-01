import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { adminAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Search, Filter, Calendar, Download, RefreshCw, X, ChevronDown, ChevronLeft, ChevronRight, Eye, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '../../../lib/utils';

const AdminReservationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
    propertyType: '',
    clientId: '',
    propertyId: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Options pour les filtres
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'confirmee', label: 'Confirmée' },
    { value: 'annulee', label: 'Annulée' },
    { value: 'terminee', label: 'Terminée' }
  ];

  const propertyTypeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'appartement', label: 'Appartement' },
    { value: 'maison', label: 'Maison' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'hotel', label: 'Hôtel' },
    { value: 'commercial', label: 'Commercial' }
  ];

  // Charger les réservations avec filtres et pagination
  const loadReservations = useCallback(async (page = 1, resetFilters = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.clientId && { clientId: filters.clientId }),
        ...(filters.propertyId && { propertyId: filters.propertyId }),
        ...(filters.dateRange && { dateRange: filters.dateRange })
      };

      const res = await adminAPI.getReservations(params);
      const reservationsData = Array.isArray(res.data?.reservations) ? res.data.reservations : [];
      
      setReservations(reservationsData);
      setPagination(prev => ({
        ...prev,
        page,
        total: res.data?.total || reservationsData.length,
        totalPages: Math.ceil((res.data?.total || reservationsData.length) / pagination.limit)
      }));

      if (resetFilters) {
        setFilters({
          search: '',
          status: '',
          dateRange: '',
          propertyType: '',
          clientId: '',
          propertyId: ''
        });
      }

    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur lors du chargement des réservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    loadReservations(1);
  }, [loadReservations]);

  // Gestion des changements de filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadReservations(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: '',
      propertyType: '',
      clientId: '',
      propertyId: ''
    });
    loadReservations(1, true);
  };

  // Gestion de la pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadReservations(newPage);
    }
  };

  // Mise à jour du statut
  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await adminAPI.updateReservationStatus(id, status);
      if (res.success) {
        setReservations(prev => 
          prev.map(r => r._id === id ? { ...r, status: res.data.status } : r)
        );
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Mise à jour du statut impossible');
    }
  };

  // Réservations filtrées
  const filteredReservations = useMemo(() => {
    return reservations;
  }, [reservations]);

  // Statistiques
  const stats = useMemo(() => {
    const total = reservations.length;
    const enAttente = reservations.filter(r => r.status === 'en_attente').length;
    const confirmees = reservations.filter(r => r.status === 'confirmee').length;
    const annulees = reservations.filter(r => r.status === 'annulee').length;
    const terminees = reservations.filter(r => r.status === 'terminee').length;

    return { total, enAttente, confirmees, annulees, terminees };
  }, [reservations]);

  // Fonction pour obtenir le style du statut
  const getStatusStyle = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmee':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'annulee':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'terminee':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_attente':
        return <Clock className="w-4 h-4" />;
      case 'confirmee':
        return <CheckCircle className="w-4 h-4" />;
      case 'annulee':
        return <XCircle className="w-4 h-4" />;
      case 'terminee':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
              <p className="text-sm text-gray-600 mt-1">Gestion des demandes de visite et réservations</p>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => loadReservations(pagination.page)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <div className="text-blue-600 font-bold text-lg">{stats.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">En attente</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Confirmées</div>
                <div className="text-2xl font-bold text-green-600">{stats.confirmees}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Annulées</div>
                <div className="text-2xl font-bold text-red-600">{stats.annulees}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Terminées</div>
                <div className="text-2xl font-bold text-blue-600">{stats.terminees}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres avancés
              </h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  {showFilters ? 'Masquer' : 'Afficher'} les filtres
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                {/* Recherche */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Rechercher par référence, propriété, client..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type de propriété */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de propriété</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {propertyTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plage de dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Toutes les périodes</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="quarter">Ce trimestre</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>

                {/* ID Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Client</label>
                  <input
                    type="text"
                    value={filters.clientId}
                    onChange={(e) => handleFilterChange('clientId', e.target.value)}
                    placeholder="ID du client..."
                    className="w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* ID Propriété */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Propriété</label>
                  <input
                    type="text"
                    value={filters.propertyId}
                    onChange={(e) => handleFilterChange('propertyId', e.target.value)}
                    placeholder="ID de la propriété..."
                    className="w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Boutons d'action */}
                <div className="md:col-span-2 lg:col-span-3 flex items-end gap-2">
                  <Button onClick={applyFilters} className="w-full">
                    Appliquer les filtres
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tableau des réservations */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {error ? (
            <div className="p-6 bg-red-50 border border-red-200">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <div className="font-semibold text-red-900">Erreur de chargement</div>
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriété</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{reservation.reference}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">{reservation.property?.titre || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{reservation.property?.categorie || ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{reservation.user?.nom || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{reservation.user?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(reservation.startDate)}</div>
                          <div className="text-xs text-gray-500">{formatDate(reservation.endDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(reservation.status)}`}>
                            {getStatusIcon(reservation.status)}
                            <span className="ml-1.5">{reservation.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReservation(reservation)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <select
                              value={reservation.status}
                              onChange={(e) => handleStatusUpdate(reservation._id, e.target.value)}
                              className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="en_attente">En attente</option>
                              <option value="confirmee">Confirmée</option>
                              <option value="annulee">Annulée</option>
                              <option value="terminee">Terminée</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        const isCurrentPage = pageNum === pagination.page;
                        const showPage = pageNum === 1 || pageNum === pagination.totalPages || 
                          (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2);
                        
                        if (!showPage && pageNum !== 1 && pageNum !== pagination.totalPages) {
                          return <span key={pageNum} className="px-2">...</span>;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={isCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={!showPage}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.total} résultats)
                  </div>
                </div>
              )}

              {filteredReservations.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">Aucune réservation trouvée</div>
                  <div className="text-gray-400 text-sm mt-2">
                    {filters.search || filters.status || filters.propertyType ? 
                      'Essayez de modifier les filtres pour voir plus de résultats.' : 
                      'Commencez par ajouter des réservations.'
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Détails de la réservation</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedReservation(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                  <div className="space-y-2">
                    <div><span className="text-sm text-gray-600">Référence:</span> <span className="font-medium">#{selectedReservation.reference}</span></div>
                    <div><span className="text-sm text-gray-600">Statut:</span> 
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(selectedReservation.status)}`}>
                        {getStatusIcon(selectedReservation.status)}
                        <span className="ml-1.5">{selectedReservation.status}</span>
                      </span>
                    </div>
                    <div><span className="text-sm text-gray-600">Créée le:</span> <span className="font-medium">{formatDate(selectedReservation.createdAt)}</span></div>
                    <div><span className="text-sm text-gray-600">Date de visite:</span> <span className="font-medium">{formatDate(selectedReservation.startDate)}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Propriété</h4>
                  <div className="space-y-2">
                    <div><span className="text-sm text-gray-600">Titre:</span> <span className="font-medium">{selectedReservation.property?.titre || 'N/A'}</span></div>
                    <div><span className="text-sm text-gray-600">Type:</span> <span className="font-medium">{selectedReservation.property?.categorie || 'N/A'}</span></div>
                    <div><span className="text-sm text-gray-600">Prix:</span> <span className="font-medium">{formatPrice(selectedReservation.property?.prix)}</span></div>
                    <div><span className="text-sm text-gray-600">Localisation:</span> <span className="font-medium">{selectedReservation.property?.ville || 'N/A'}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                  <div className="space-y-2">
                    <div><span className="text-sm text-gray-600">Nom:</span> <span className="font-medium">{selectedReservation.user?.nom || 'N/A'}</span></div>
                    <div><span className="text-sm text-gray-600">Email:</span> <span className="font-medium">{selectedReservation.user?.email || 'N/A'}</span></div>
                    <div><span className="text-sm text-gray-600">Téléphone:</span> <span className="font-medium">{selectedReservation.user?.telephone || 'N/A'}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">WhatsApp:</span> 
                      <span className={`font-medium ${selectedReservation.isWhatsapp ? 'text-green-600' : 'text-gray-500'}`}>
                        {selectedReservation.isWhatsapp ? 'Oui' : 'Non'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;
