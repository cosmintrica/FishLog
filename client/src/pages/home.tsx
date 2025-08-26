import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { FishingMap } from "@/components/map/fishing-map";
import { LeaderboardSection } from "@/components/leaderboards/leaderboard-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { MapPin, Plus, TrendingUp } from "lucide-react";

export default function Home() {
  const { user, login, logout } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: recentRecords } = useQuery({
    queryKey: ["/api/fishing-records"],
  });

  const handleLocationSelect = (location: any) => {
    if (!user) {
      alert("Trebuie să te conectezi pentru a adăuga recorduri!");
      return;
    }
    // Handle location selection - this would be used in the submit modal
    console.log("Location selected:", location);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Acum";
    if (diffHours < 24) return `${diffHours}h`;
    if (diffHours < 48) return "Ieri";
    return `${Math.floor(diffHours / 24)} zile`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onAuthSuccess={login}
        onLogout={logout}
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-primary to-water rounded-xl p-8 text-white mb-8" data-testid="hero-section">
          <h2 className="text-3xl font-bold mb-4">Descoperă cele mai bune locuri de pescuit din România</h2>
          <p className="text-lg mb-6">Explorează harta interactivă, înregistrează recordurile tale și concurează în clasamentele naționale!</p>
          <Button 
            onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary hover:bg-gray-100"
            data-testid="button-explore-map"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Explorează Harta
          </Button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <FishingMap onLocationSelect={handleLocationSelect} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="stats-title">Statistici Rapide</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Locuri înregistrate</span>
                    <span className="font-semibold text-primary" data-testid="stat-locations">
                      {(stats as any)?.totalLocations || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Recorduri totale</span>
                    <span className="font-semibold text-primary" data-testid="stat-records">
                      {(stats as any)?.totalRecords || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pescari activi</span>
                    <span className="font-semibold text-primary" data-testid="stat-users">
                      {(stats as any)?.activeUsers || '---'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Records */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="recent-records-title">Recorduri Recente</h3>
                <div className="space-y-4">
                  {recentRecords && (recentRecords as any[]).length > 0 ? (
                    (recentRecords as any[]).slice(0, 3).map((record: any, index: number) => (
                      <div key={record.id} className="border-l-4 border-accent pl-4" data-testid={`recent-record-${index}`}>
                        <p className="font-semibold text-gray-900" data-testid={`record-species-${index}`}>
                          {record.species} {record.weight} kg
                        </p>
                        <p className="text-sm text-gray-600" data-testid={`record-location-${index}`}>
                          {record.location}
                        </p>
                        <p className="text-xs text-gray-500" data-testid={`record-time-${index}`}>
                          {formatTimeAgo(record.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4" data-testid="no-recent-records">
                      Nu există recorduri recente
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Record Info */}
            <Card>
              <CardContent className="pt-6 text-center">
                <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {user ? "Folosește butonul din header pentru a adăuga recorduri" : "Conectează-te pentru a adăuga recorduri"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leaderboards */}
        <LeaderboardSection />
      </div>

    </div>
  );
}
