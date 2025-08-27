import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Fish, MapPin, Calendar } from "lucide-react";

type UserProfileData = {
  user: {
    id: string;
    username: string;
    email?: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  stats: {
    totalRecords: number;
    personalBests: Array<{
      id: string;
      species: string;
      weight: number | string;
      length?: number;
      location: string;
      dateCaught: string;
    }>;
    /** NOU: pentru cardurile cu poziții */
    positions?: {
      national?: number;
      county?: number;
    };
  };
  recentRecords: Array<{
    id: string;
    species: string;
    weight: number | string;
    length?: number;
    dateCaught: string;
    location: string;
    verified: boolean;
  }>;
};

export default function UserProfile() {
  const { userId } = useParams();

  const { data: profile, isLoading } = useQuery<UserProfileData>({
    queryKey: [`/api/users/${userId}/profile`],
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Se încarcă profilul…</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Utilizatorul nu a fost găsit</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const nationalPos = profile.stats.positions?.national ?? "N/A";
  const countyPos = profile.stats.positions?.county ?? "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.user.firstName?.[0] ?? "U"}{profile.user.lastName?.[0] ?? ""}
              </div>
              <div>
                <CardTitle className="text-2xl" data-testid="user-name">
                  {profile.user.firstName} {profile.user.lastName}
                </CardTitle>
                <p className="text-gray-600" data-testid="user-username">@{profile.user.username}</p>
                <p className="text-sm text-gray-500" data-testid="user-since">
                  Membru din {formatDate(profile.user.createdAt)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Fish className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold" data-testid="stat-total-records">
                    {profile.stats.totalRecords}
                  </p>
                  <p className="text-gray-600">Recorduri Totale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="stat-national-position">
                    #{nationalPos}
                  </p>
                  <p className="text-gray-600">Poziție Națională</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="stat-county-position">
                    #{countyPos}
                  </p>
                  <p className="text-gray-600">Poziție Județeană</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Bests */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Recorduri Personale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.stats.personalBests?.length ? (
                profile.stats.personalBests.map((record, index) => (
                  <div key={record.id} className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg" data-testid={`personal-best-${index}`}>
                    <div>
                      <p className="font-semibold" data-testid={`pb-species-${index}`}>{record.species}</p>
                      <p className="text-sm text-gray-600" data-testid={`pb-location-${index}`}>{record.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary" data-testid={`pb-weight-${index}`}>{record.weight} kg</p>
                      <p className="text-xs text-gray-500" data-testid={`pb-date-${index}`}>{formatDate(record.dateCaught)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4" data-testid="no-personal-bests">Nu există recorduri personale</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Activitate Recentă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.recentRecords?.length ? (
                profile.recentRecords.map((record, index) => (
                  <div key={record.id} className="p-4 border rounded-lg" data-testid={`recent-record-${index}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold" data-testid={`recent-species-${index}`}>
                          {record.species} {record.weight} kg
                        </p>
                        <p className="text-sm text-gray-600" data-testid={`recent-location-${index}`}>{record.location}</p>
                        <p className="text-xs text-gray-500" data-testid={`recent-date-${index}`}>{formatDate(record.dateCaught)}</p>
                      </div>
                      <Badge variant={record.verified ? "default" : "secondary"} data-testid={`recent-status-${index}`}>
                        {record.verified ? "Verificat" : "În așteptare"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4" data-testid="no-recent-records">Nu există recorduri recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
