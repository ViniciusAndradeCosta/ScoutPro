import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Search, Eye, Star, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Report {
  id: string;
  athleteId: string;
  scoutId: string;
  playerName: string;
  scoutName: string;
  date: string;
  rating: number;
  position: string;
  backendStatus: string;
  strengths: string;
  weaknesses: string;
  notes: string;
  technicalRating: number;
  tacticalRating: number;
  physicalRating: number;
}

export function ReportsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports, setReports] = useState<Report[]>([]);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // CORREÇÃO: Removida a rota /admin/users que causava 403. Usando apenas a /users.
        const [reportsRes, athletesRes, usersRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/reports', { headers }).catch(() => null),
          fetch('http://localhost:8080/api/v1/athletes', { headers }).catch(() => null),
          fetch('http://localhost:8080/api/v1/users', { headers }).catch(() => null)
        ]);

        if (reportsRes && reportsRes.ok) {
          const reportsData = await reportsRes.json();
          const athletesData = athletesRes && athletesRes.ok ? await athletesRes.json() : [];
          
          const rawUsers = usersRes && usersRes.ok ? await usersRes.json() : [];
          const allUsers = Array.isArray(rawUsers) ? rawUsers : (rawUsers?.content || rawUsers?.data || []);

          const formattedReports = reportsData.map((r: any) => {
            const athlete = athletesData.find((a: any) => String(a.id) === String(r.athleteId));
            
            const scout = allUsers.find((u: any) => String(u.id) === String(r.scoutId) || String(u.id_user) === String(r.scoutId));
            const finalScoutName = r.scoutName || (scout ? scout.name : 'Olheiro Desconhecido');

            const ratingNumber = Math.round((r.technicalRating + r.tacticalRating + r.physicalRating) / 3);

            return {
              id: r.id?.toString(),
              athleteId: r.athleteId?.toString(),
              scoutId: r.scoutId?.toString(),
              playerName: athlete ? athlete.name : 'Jogador Desconhecido',
              scoutName: finalScoutName,
              date: new Date(r.createdAt || r.matchDate).toLocaleDateString('pt-BR'),
              rating: ratingNumber,
              position: athlete?.position ? athlete.position.toLowerCase().replace(/_/g, ' ') : 'ND',
              backendStatus: r.status || 'pending',
              strengths: r.strengths || 'Não informado',
              weaknesses: r.weaknesses || 'Não informado',
              notes: r.notes || 'Sem observações adicionais',
              technicalRating: r.technicalRating,
              tacticalRating: r.tacticalRating,
              physicalRating: r.physicalRating
            };
          });

          formattedReports.sort((a: any, b: any) => {
            const dateA = a.date.split('/').reverse().join('-');
            const dateB = b.date.split('/').reverse().join('-');
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });

          setReports(formattedReports);
        }
      } catch (error) { 
        console.error("Erro ao processar relatórios", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchReports();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLocalStatuses(prev => ({ ...prev, [id]: newStatus }));
    try {
      const token = localStorage.getItem('scoutpro_token');
      const reportToUpdate = reports.find(r => r.id === id);
      if(reportToUpdate) {
        await fetch(`http://localhost:8080/api/v1/reports/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            ...reportToUpdate, 
            status: newStatus 
          })
        });
      }
    } catch(err) {
      console.error("Erro ao salvar status no backend", err);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchSearch = report.playerName.toLowerCase().includes(searchTerm.toLowerCase()) || report.scoutName.toLowerCase().includes(searchTerm.toLowerCase());
    const currentStatus = localStatuses[report.id] || report.backendStatus;
    const matchStatus = statusFilter === 'all' || currentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold">Relatórios de Avaliação</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por jogador ou scout..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-input-background border-border" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-input-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Jogador</TableHead>
                <TableHead>Scout</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum relatório encontrado.</TableCell></TableRow>
              ) : filteredReports.map((report) => {
                const status = localStatuses[report.id] || report.backendStatus;
                return (
                  <TableRow key={report.id} className="border-border hover:bg-muted/20">
                    <TableCell className="font-medium capitalize">{report.playerName}</TableCell>
                    <TableCell className="text-muted-foreground font-semibold">{report.scoutName}</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-primary/10 text-primary capitalize">{report.position}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{report.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-bold">{report.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={status === 'approved' ? 'bg-accent/10 text-accent border-accent/20' : status === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-chart-3/10 text-chart-3 border-chart-3/20'}>
                        {status === 'approved' ? 'Aprovado' : status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      {status === 'pending' && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={(e: any) => { e.stopPropagation(); handleStatusChange(report.id, 'approved'); }}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={(e: any) => { e.stopPropagation(); handleStatusChange(report.id, 'rejected'); }}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selectedReport} onOpenChange={(open: boolean) => !open && setSelectedReport(null)}>
        {selectedReport && (
          <DialogContent className="max-w-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" /> Relatório Oficial
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                <div><p className="text-sm text-muted-foreground">Jogador</p><p className="font-bold text-lg">{selectedReport.playerName}</p></div>
                <div><p className="text-sm text-muted-foreground">Avaliador (Scout)</p><p className="font-bold text-lg text-primary">{selectedReport.scoutName}</p></div>
                <div><p className="text-sm text-muted-foreground">Posição</p><p className="font-medium capitalize">{selectedReport.position}</p></div>
                <div><p className="text-sm text-muted-foreground">Data da Análise</p><p className="font-medium">{selectedReport.date}</p></div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="bg-primary/10 text-primary border border-primary/20 p-4 rounded-xl flex-1 text-center">
                  <p className="text-sm font-semibold mb-1">Nota Técnica</p>
                  <p className="text-3xl font-bold">{selectedReport.technicalRating}</p>
                </div>
                <div className="bg-accent/10 text-accent border border-accent/20 p-4 rounded-xl flex-1 text-center">
                  <p className="text-sm font-semibold mb-1">Nota Tática</p>
                  <p className="text-3xl font-bold">{selectedReport.tacticalRating}</p>
                </div>
                <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-4 rounded-xl flex-1 text-center">
                  <p className="text-sm font-semibold mb-1">Nota Física</p>
                  <p className="text-3xl font-bold">{selectedReport.physicalRating}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-500 flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4"/> Pontos Fortes</h4>
                  <p className="text-sm bg-background p-3 rounded-lg border border-border">{selectedReport.strengths}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-500 flex items-center gap-2 mb-1"><XCircle className="w-4 h-4"/> Áreas a Melhorar</h4>
                  <p className="text-sm bg-background p-3 rounded-lg border border-border">{selectedReport.weaknesses}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary flex items-center gap-2 mb-1"><FileText className="w-4 h-4"/> Observações Finais</h4>
                  <p className="text-sm bg-background p-3 rounded-lg border border-border">{selectedReport.notes}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}