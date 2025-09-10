import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Eye, Download, Search, Filter, ArrowLeft, RefreshCcw, CloudUpload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  whatsappConsent: boolean;
  timestamp: string;
  source: string;
  hubspotId?: string | null;
  hubspotSyncStatus?: 'pending' | 'synced' | 'error';
  hubspotSyncError?: string | null;
}

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Record<string, boolean>>({});
  const [endpointDiagnostics, setEndpointDiagnostics] = useState<{ url: string; ok: boolean; error?: string }[]>([]);
  const [overrideEndpoint, setOverrideEndpoint] = useState<string>(import.meta.env.VITE_LEADS_ENDPOINT_OVERRIDE || '');
  const adminToken = import.meta.env.VITE_SUPABASE_ADMIN_TOKEN || '';
  const [adminTokenLocal, setAdminTokenLocal] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('adminTokenOverride');
      if (saved) return saved;
    }
    return adminToken;
  });
  const [authError, setAuthError] = useState(false);
  let supabaseRef: SupabaseClient | null = null;

  // Load leads from Supabase
  useEffect(() => {
    fetchLeads();
  }, []);

  const resolveFetchLeadsUrls = () => {
    const list: string[] = [];
    if (overrideEndpoint) list.push(overrideEndpoint.trim());
    const fnUrl = import.meta.env.VITE_SUPABASE_FETCH_LEADS_FUNCTION_URL as string | undefined;
    if (fnUrl) {
      list.push(fnUrl); // se function configurada, não tentamos outros para evitar 404/401 desnecessários
    } else {
      list.push('/api/get-leads');
      if (import.meta.env.PROD) {
        list.push('/.netlify/functions/get-leads');
        list.push('/api/functions/get-leads');
      }
    }
    return Array.from(new Set(list.filter(Boolean)));
  };

  const mapLeads = (arr: any[]): Lead[] => (arr || []).map((l: any) => ({
    id: l.id,
    name: l.name || '',
    email: l.email || '',
    phone: l.phone || '',
    message: l.message || '',
    whatsappConsent: !!(l.whatsapp_consent ?? l.whatsappConsent),
    timestamp: l.created_at || l.timestamp || '',
    source: l.source || '',
    hubspotId: l.hubspot_id || l.hubspotId || null,
    hubspotSyncStatus: l.hubspot_id ? 'synced' : 'pending',
    hubspotSyncError: null
  }));

  const fetchLeadsDirectFromSupabase = async (): Promise<Lead[] | null> => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
      if (!supabaseUrl || !anonKey) return null;
      if (!supabaseRef) supabaseRef = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
      const { data, error } = await supabaseRef.from('leads').select('*').order('created_at', { ascending: false }).limit(1000);
      if (error) throw error;
      return mapLeads(data as any[]);
    } catch (e) {
      console.warn('Fallback Supabase direto falhou', e);
      return null;
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    setAuthError(false);
    setEndpointDiagnostics([]);
    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
      const urls = resolveFetchLeadsUrls();
      let lastErr: any = null;
      for (const url of urls) {
        try {
          const headers: Record<string, string> = { 'Accept': 'application/json' };
          if (adminTokenLocal) headers['x-admin-token'] = adminTokenLocal;
          if (anonKey) {
            headers['apikey'] = anonKey;
            headers['Authorization'] = `Bearer ${anonKey}`;
          }
          const res = await fetch(url, { method: 'GET', headers, credentials: 'omit' });
          const status = res.status;
          const contentType = res.headers.get('content-type') || '';
          if (!res.ok) {
            const preview = await res.text();
            const errMsg = `HTTP ${status} ${url} corpo: ${preview.slice(0,100)}`;
            setEndpointDiagnostics(d => [...d, { url, ok: false, error: errMsg }]);
            if (status === 401) {
              setAuthError(true);
              if (url === urls[0]) break;
            }
            throw new Error(errMsg);
          }
          if (!contentType.includes('application/json')) {
            const textBody = await res.text();
            const errMsg = `Não JSON (${contentType}) ${url} início: ${textBody.slice(0,80)}`;
            setEndpointDiagnostics(d => [...d, { url, ok: false, error: errMsg }]);
            throw new Error(errMsg);
          }
          let json: any = null;
          try { json = await res.json(); } catch (parseErr: any) {
            const errMsg = `Parse JSON falhou ${url}: ${parseErr.message}`;
            setEndpointDiagnostics(d => [...d, { url, ok: false, error: errMsg }]);
            throw new Error(errMsg);
          }
          if (json && (json.leads || Array.isArray(json))) {
            const raw = json.leads || json;
            const mapped = mapLeads(raw);
            setLeads(mapped);
            setEndpointDiagnostics(d => [...d, { url, ok: true }]);
            lastErr = null;
            break;
          } else {
            const errMsg = `Formato inesperado ${url} keys: ${Object.keys(json||{}).join(',')}`;
            setEndpointDiagnostics(d => [...d, { url, ok: false, error: errMsg }]);
            throw new Error(errMsg);
          }
        } catch (inner) {
          lastErr = inner;
          continue;
        }
      }
      if (lastErr && !authError) {
        const direct = await fetchLeadsDirectFromSupabase();
        if (direct && direct.length) {
          setLeads(direct);
          setEndpointDiagnostics(d => [...d, { url: 'direct-supabase', ok: true }]);
          lastErr = null;
        }
      }
      if (lastErr && !authError) throw lastErr;
    } catch (err: any) {
      if (!authError) setError(`Erro ao buscar leads: ${err?.message || 'desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const hubspotSyncUrlCandidates = () => {
    const v = import.meta.env.VITE_HUBSPOT_SYNC_URL as string | undefined; // pode ser uma Edge Function / serverless
    const arr: string[] = [];
    if (v) arr.push(v);
    arr.push('/api/hubspot-sync');
    arr.push('/.netlify/functions/hubspot-sync');
    return arr;
  };

  const attemptFetch = async (urls: string[], body: any) => {
    let lastErr: any = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const txt = await res.text();
            throw new Error(`${res.status} ${txt}`);
        }
        return await res.json();
      } catch (e) {
        lastErr = e;
        continue;
      }
    }
    throw lastErr || new Error('Todas tentativas falharam');
  };

  const updateLeadState = (id: string, patch: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const syncLeadWithHubSpot = async (lead: Lead) => {
    if (syncingIds[lead.id]) return;
    setSyncingIds(prev => ({ ...prev, [lead.id]: true }));
    updateLeadState(lead.id, { hubspotSyncStatus: 'pending', hubspotSyncError: null });
    try {
      const result = await attemptFetch(hubspotSyncUrlCandidates(), { lead });
      updateLeadState(lead.id, { hubspotSyncStatus: 'synced', hubspotId: result?.hubspotId || result?.id || null });
    } catch (e: any) {
      console.error('HubSpot sync lead error', e);
      updateLeadState(lead.id, { hubspotSyncStatus: 'error', hubspotSyncError: e?.message || 'Erro' });
    } finally {
      setSyncingIds(prev => ({ ...prev, [lead.id]: false }));
    }
  };

  const syncAllPending = async () => {
    setSyncingAll(true);
    const pending = leads.filter(l => l.hubspotSyncStatus !== 'synced');
    for (const l of pending) {
      // eslint-disable-next-line no-await-in-loop
      await syncLeadWithHubSpot(l);
    }
    setSyncingAll(false);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const exportLeads = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Mensagem', 'WhatsApp Consent', 'Data', 'Origem', 'HubSpotID', 'Status HubSpot'].join(','),
      ...filteredLeads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.whatsappConsent ? 'Sim' : 'Não',
        `"${new Date(lead.timestamp).toLocaleString('pt-BR')}"`,
        `"${lead.source}"`,
        `"${lead.hubspotId || ''}"`,
        `"${lead.hubspotSyncStatus || ''}"`
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
        {/* Avisos de configuração */}
        {authError && (
          <div className="mb-4 p-3 rounded border border-red-300 bg-red-50 text-xs text-red-700">
            401 Unauthorized: verifique se ADMIN_TOKEN na Edge Function coincide com VITE_SUPABASE_ADMIN_TOKEN (build) e se a variável está exposta no ambiente de produção.
          </div>
        )}
        {!authError && !adminToken && (
          <div className="mb-4 p-3 rounded border border-amber-300 bg-amber-50 text-xs text-amber-700">
            VITE_SUPABASE_ADMIN_TOKEN não definido no frontend. Se a função exigir token irá retornar 401.
          </div>
        )}
        <div className="mb-2 text-[11px] font-mono text-gray-500">
          Envio de header x-admin-token: {adminTokenLocal ? 'SIM' : 'NÃO'} {adminTokenLocal && `(len=${adminTokenLocal.length})`}
        </div>
        <div className="mb-4 p-3 rounded border bg-white flex flex-col gap-2">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-medium text-gray-600">Override Admin Token (session)</label>
              <Input
                type="text"
                placeholder="Cole o ADMIN_TOKEN para testar"
                value={adminTokenLocal}
                onChange={e => {
                  const v = e.target.value.trim();
                  setAdminTokenLocal(v);
                  if (typeof window !== 'undefined') {
                    if (v) sessionStorage.setItem('adminTokenOverride', v); else sessionStorage.removeItem('adminTokenOverride');
                  }
                }}
              />
              <p className="text-[10px] text-gray-500">Não será persistido no build, apenas na sessão. Primeiro/último chars: {adminTokenLocal ? `${adminTokenLocal[0]}...${adminTokenLocal[adminTokenLocal.length-1]}` : '—'}</p>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" className="w-full" onClick={fetchLeads}>Testar Token</Button>
            </div>
          </div>
          {endpointDiagnostics.length > 0 && (
            <div className="text-xs text-gray-600 flex flex-col gap-1 max-h-40 overflow-auto">
              {endpointDiagnostics.map((d,i) => (
                <div key={i} className={d.ok ? 'text-green-600' : 'text-red-600'}>
                  {d.ok ? 'OK' : 'FAIL'} - {d.url} {d.error ? '→ ' + d.error : ''}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button & Header */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <Button variant="outline" onClick={() => window.location.href = '/'} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <Button variant="outline" onClick={fetchLeads} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Recarregar
          </Button>
          <Button variant="outline" disabled={syncingAll || leads.length === 0} onClick={syncAllPending} className="flex items-center gap-2">
            <CloudUpload className="h-4 w-4" /> {syncingAll ? 'Sincronizando...' : 'Sincronizar Pendentes'}
          </Button>
          <div className="text-xs text-gray-500">
            HubSpot Sync URL(s): {hubspotSyncUrlCandidates().join(' | ')}
          </div>
        </div>
        {/* Header Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">
            Dashboard Administrativo - Claris Casa & Clube
          </h1>
          <p className="text-gray-600">
            Gerencie os leads e contatos da landing page (Supabase + HubSpot)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HubSpot Synced</CardTitle>
              <CloudUpload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(l => l.hubspotSyncStatus === 'synced').length}</div>
              <p className="text-xs text-muted-foreground">
                Contatos enviados
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
                Lista de todos os contatos recebidos e status de sincronização HubSpot
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLeads.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum lead recebido ainda.</p>
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
                        <th className="text-left py-3 px-2 font-medium">HubSpot</th>
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
                            {lead.hubspotSyncStatus === 'synced' && (
                              <Badge variant="default">OK {lead.hubspotId ? `#${lead.hubspotId}` : ''}</Badge>
                            )}
                            {lead.hubspotSyncStatus === 'pending' && (
                              <Badge variant="secondary">Pendente</Badge>
                            )}
                            {lead.hubspotSyncStatus === 'error' && (
                              <Badge variant="destructive">Erro</Badge>
                            )}
                            {lead.hubspotSyncError && (
                              <div className="text-xs text-red-500 max-w-[140px] truncate" title={lead.hubspotSyncError}>{lead.hubspotSyncError}</div>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2 flex-wrap">
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
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={syncingIds[lead.id] || lead.hubspotSyncStatus === 'synced'}
                                onClick={() => syncLeadWithHubSpot(lead)}
                              >
                                <CloudUpload className="h-4 w-4 mr-1" />
                                {syncingIds[lead.id] ? '...' : lead.hubspotSyncStatus === 'synced' ? 'Synced' : 'Sync'}
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

                <div>
                  <label className="text-sm font-medium text-gray-600">Status HubSpot</label>
                  <p>
                    <Badge variant={selectedLead.hubspotSyncStatus === 'synced' ? 'default' : selectedLead.hubspotSyncStatus === 'error' ? 'destructive' : 'secondary'}>
                      {selectedLead.hubspotSyncStatus || 'Pendente'}
                    </Badge>
                  </p>
                  {selectedLead.hubspotId && (
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedLead.hubspotId}</p>
                  )}
                  {selectedLead.hubspotSyncError && (
                    <p className="text-xs text-red-500 mt-1">Erro: {selectedLead.hubspotSyncError}</p>
                  )}
                </div>

                {selectedLead.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mensagem</label>
                    <p className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Origem</label>
                  <p>{selectedLead.source}</p>
                </div>

                <div className="flex gap-2 pt-4 flex-wrap">
                  <Button onClick={() => window.open(`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}`, '_blank')} className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button onClick={() => window.open(`mailto:${selectedLead.email}`, '_blank')} variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" disabled={!!syncingIds[selectedLead.id] || selectedLead.hubspotSyncStatus === 'synced'} onClick={() => syncLeadWithHubSpot(selectedLead)}>
                    <CloudUpload className="h-4 w-4 mr-2" />
                    {syncingIds[selectedLead.id] ? 'Sincronizando...' : selectedLead.hubspotSyncStatus === 'synced' ? 'Já sincronizado' : 'Sincronizar HubSpot'}
                  </Button>
                  <Button onClick={() => setSelectedLead(null)} variant="outline">
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