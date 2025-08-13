import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Home, Calendar, Mail, Phone, MessageCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { projectId, publicAnonKey } from './utils/supabase/info';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  whatsappConsent: boolean;
  submittedAt: string;
  status: string;
}

interface Stats {
  totalLeads: number;
  unitsAvailable: number;
  recentLeads: number;
  unitsRemaining: number;
}

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    unitsAvailable: 12,
    recentLeads: 0,
    unitsRemaining: 12
  });
  const [loading, setLoading] = useState(true);
  const [newUnitsCount, setNewUnitsCount] = useState(12);
  const [isUpdatingUnits, setIsUpdatingUnits] = useState(false);

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch leads and stats in parallel
      const [leadsResponse, statsResponse] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-17b725d2/leads`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-17b725d2/stats`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        })
      ]);

      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.leads || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
        setNewUnitsCount(statsData.stats.unitsAvailable);
      }
    } catch (error) {
      console.log('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUnitsAvailable = async () => {
    setIsUpdatingUnits(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-17b725d2/update-units`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ units: newUnitsCount }),
      });

      if (response.ok) {
        setStats(prev => ({ ...prev, unitsAvailable: newUnitsCount }));
        alert('Unidades disponíveis atualizadas com sucesso!');
      } else {
        alert('Erro ao atualizar unidades disponíveis');
      }
    } catch (error) {
      console.log('Error updating units:', error);
      alert('Erro de conexão ao atualizar unidades');
    } finally {
      setIsUpdatingUnits(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getWhatsAppUrl = (phone: string, name: string) => {
    const message = `Olá ${name}! Obrigado pelo interesse no Claris Casa & Club. Como posso ajudá-lo?`;
    return `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">
            Dashboard Administrativo - <span className="text-[#D4AF37]">Claris Casa & Club</span>
          </h1>
          <p className="text-gray-600">Gerencie leads e monitore o desempenho da landing page</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <Users className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads (24h)</p>
                  <p className="text-3xl font-bold text-green-600">{stats.recentLeads}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unidades Disponíveis</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.unitsAvailable}</p>
                </div>
                <Home className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.totalLeads > 0 ? Math.round((stats.totalLeads / (stats.totalLeads + stats.unitsAvailable)) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Units Management */}
        <Card className="p-6 bg-white shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Settings className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl font-semibold text-gray-800">Gerenciar Unidades Disponíveis</h2>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="0"
              max="50"
              value={newUnitsCount}
              onChange={(e) => setNewUnitsCount(Number(e.target.value))}
              className="w-32"
              placeholder="Unidades"
            />
            <Button
              onClick={updateUnitsAvailable}
              disabled={isUpdatingUnits}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
            >
              {isUpdatingUnits ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="bg-white shadow-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Leads Recentes</h2>
              <Button onClick={fetchData} variant="outline" size="sm">
                Atualizar
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {leads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum lead encontrado ainda.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensagem</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          {lead.whatsappConsent && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <MessageCircle className="w-3 h-3" />
                              WhatsApp OK
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${lead.email}`} className="hover:text-[#D4AF37]">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${lead.phone}`} className="hover:text-[#D4AF37]">
                              {lead.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {lead.message || 'Sem mensagem'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(lead.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={getWhatsAppUrl(lead.phone, lead.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                          <a
                            href={`mailto:${lead.email}?subject=Claris Casa & Club - Contato&body=Olá ${lead.name},%0D%0A%0D%0AObrigado pelo interesse no Claris Casa & Club!`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}