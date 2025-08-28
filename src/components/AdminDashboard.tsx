import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Eye, Download, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  whatsappConsent: boolean;
  timestamp: string;
  source: string;
}

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Load leads from Supabase
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    const functionUrl = import.meta.env.VITE_SUPABASE_LEADS_FUNCTION_URL as string | undefined;
    const authToken = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined; // using anon key for edge function auth header if required
    if (!functionUrl || !authToken) {
      setError('Variáveis de ambiente VITE_SUPABASE_LEADS_FUNCTION_URL ou VITE_SUPABASE_ANON_KEY ausentes');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setLeads(result.leads || []);
      } else {
        setError(result.error || 'Erro ao carregar leads');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching leads:', err);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const exportLeads = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Mensagem', 'WhatsApp Consent', 'Data', 'Origem'].join(','),
      ...filteredLeads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.whatsappConsent ? 'Sim' : 'Não',
        `"${new Date(lead.timestamp).toLocaleString('pt-BR')}"`,
        `"${lead.source}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `claris-leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">
            Dashboard Administrativo - Claris Casa & Clube
          </h1>
          <p className="text-gray-600">
            Gerencie os leads e contatos da landing page
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">
                Contatos recebidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => 
                  new Date(lead.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Contatos de hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => lead.whatsappConsent).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Consentiram WhatsApp
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Conv.</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.length > 0 ? Math.round((leads.filter(l => l.message).length / leads.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Com mensagem personalizada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchLeads} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={exportLeads} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
            <p className="mt-4 text-gray-600">Carregando leads...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchLeads} variant="outline">
              Tentar novamente
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Leads Recebidos ({filteredLeads.length})</CardTitle>
              <CardDescription>
                Lista de todos os contatos recebidos através da landing page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? 'Nenhum lead encontrado para sua busca' : 'Nenhum lead recebido ainda'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">Nome</th>
                        <th className="text-left py-3 px-2 font-medium">Contato</th>
                        <th className="text-left py-3 px-2 font-medium">Data</th>
                        <th className="text-left py-3 px-2 font-medium">WhatsApp</th>
                        <th className="text-left py-3 px-2 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium">{lead.name}</div>
                              {lead.message && (
                                <div className="text-sm text-gray-600 truncate max-w-xs">
                                  {lead.message}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="text-sm">
                              <div>{lead.email}</div>
                              <div className="text-gray-600">{lead.phone}</div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="text-sm">
                              {new Date(lead.timestamp).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(lead.timestamp).toLocaleTimeString('pt-BR')}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={lead.whatsappConsent ? "default" : "secondary"}>
                              {lead.whatsappConsent ? "Sim" : "Não"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank')}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes do Lead</CardTitle>
                <CardDescription>
                  Informações completas do contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <p className="text-lg">{selectedLead.name}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p>{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p>{selectedLead.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Data e Hora</label>
                  <p>{new Date(selectedLead.timestamp).toLocaleString('pt-BR')}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Consent WhatsApp</label>
                  <p>
                    <Badge variant={selectedLead.whatsappConsent ? "default" : "secondary"}>
                      {selectedLead.whatsappConsent ? "Autorizado" : "Não autorizado"}
                    </Badge>
                  </p>
                </div>

                {selectedLead.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mensagem</label>
                    <p className="bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Origem</label>
                  <p>{selectedLead.source}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => window.open(`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}`, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => window.open(`mailto:${selectedLead.email}`, '_blank')}
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    onClick={() => setSelectedLead(null)}
                    variant="outline"
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}