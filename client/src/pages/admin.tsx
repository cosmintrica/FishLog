import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, Eye, Calendar, MapPin, Fish, AlertTriangle } from "lucide-react";

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is admin (this would normally be handled server-side)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.email === 'cosmin.trica@outlook.com';

  const { data: pendingRecords, isLoading } = useQuery({
    queryKey: ["/api/admin/pending-records"],
    enabled: isAdmin
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ recordId, approved }: { recordId: string; approved: boolean }) => {
      const response = await apiRequest("POST", `/api/admin/verify-record/${recordId}`, { approved });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({ 
        title: variables.approved ? "Record aprobat" : "Record respins",
        description: variables.approved ? "Recordul a fost verificat și aprobat" : "Recordul a fost respins"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fishing-records"] });
    },
    onError: () => {
      toast({ 
        title: "Eroare", 
        description: "Nu s-a putut procesa verificarea", 
        variant: "destructive" 
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nu aveți permisiuni de administrator. Accesul la acest panel este restricționat pentru cosmin.trica@outlook.com.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="admin-title">
            Panou Administrator
          </h1>
          <p className="text-gray-600 mt-2">
            Verifică și aprobă recordurile trimise de utilizatori
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8" data-testid="loading-state">
            Se încarcă recordurile în așteptare...
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRecords && pendingRecords.length > 0 ? (
              pendingRecords.map((record: any, index: number) => (
                <Card key={record.id} className="border-l-4 border-yellow-500" data-testid={`pending-record-${index}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl" data-testid={`record-title-${index}`}>
                          {record.species} - {record.weight} kg
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Fish className="h-4 w-4 mr-1" />
                            <span data-testid={`record-length-${index}`}>{record.length} cm</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span data-testid={`record-location-${index}`}>{record.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span data-testid={`record-date-${index}`}>{formatDate(record.dateCaught)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" data-testid={`record-status-${index}`}>
                        În așteptare
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Record Details */}
                      <div>
                        <h4 className="font-semibold mb-3">Detalii Record</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Utilizator:</span>
                            <span className="font-medium" data-testid={`record-user-${index}`}>
                              {record.userFirstName} {record.userLastName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span data-testid={`record-email-${index}`}>{record.userEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Județ:</span>
                            <span data-testid={`record-county-${index}`}>{record.county}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tip apă:</span>
                            <span data-testid={`record-water-type-${index}`}>{record.waterType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submis la:</span>
                            <span data-testid={`record-submitted-${index}`}>{formatDate(record.createdAt)}</span>
                          </div>
                        </div>
                        
                        {record.description && (
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Descriere:</h5>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded" data-testid={`record-description-${index}`}>
                              {record.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Media Section */}
                      <div>
                        <h4 className="font-semibold mb-3">Media Încărcată</h4>
                        
                        {/* Video placeholder */}
                        <div className="space-y-4">
                          <div className="bg-gray-100 rounded-lg p-6 text-center">
                            <Eye className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              Video de verificare
                            </p>
                            <Button variant="outline" size="sm" className="mt-2" data-testid={`video-view-${index}`}>
                              Vezi Video
                            </Button>
                          </div>

                          {/* Photos placeholder */}
                          {record.photos && record.photos.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                {record.photos.length} fotografii încărcate
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {record.photos.slice(0, 4).map((photo: any, photoIndex: number) => (
                                  <div key={photoIndex} className="bg-gray-100 rounded aspect-square flex items-center justify-center">
                                    <span className="text-xs text-gray-500" data-testid={`photo-${index}-${photoIndex}`}>
                                      Foto {photoIndex + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-6 pt-4 border-t">
                      <Button
                        onClick={() => verifyMutation.mutate({ recordId: record.id, approved: true })}
                        disabled={verifyMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        data-testid={`approve-button-${index}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobă Record
                      </Button>
                      
                      <Button
                        onClick={() => verifyMutation.mutate({ recordId: record.id, approved: false })}
                        disabled={verifyMutation.isPending}
                        variant="destructive"
                        className="flex-1"
                        data-testid={`reject-button-${index}`}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Respinge Record
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card data-testid="no-pending-records">
                <CardContent className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nu există recorduri în așteptare
                  </h3>
                  <p className="text-gray-600">
                    Toate recordurile au fost verificate și procesate.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}