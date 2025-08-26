import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trophy, Flag, Map, Waves, Search } from "lucide-react";
import { fishSpecies, romanianCounties } from "@/data/fish-species";

export function LeaderboardSection() {
  const [, setLocation] = useLocation();
  const [leaderboardType, setLeaderboardType] = useState("national");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [countyFilter, setCountyFilter] = useState("all");
  const [waterBodyFilter, setWaterBodyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: nationalLeaderboard } = useQuery({
    queryKey: ["/api/leaderboards/national", speciesFilter, countyFilter, waterBodyFilter],
  });

  const { data: regionalLeaderboard } = useQuery({
    queryKey: ["/api/leaderboards/regional", speciesFilter, countyFilter || "B", waterBodyFilter], // București region
  });

  const { data: localLeaderboard } = useQuery({
    queryKey: ["/api/leaderboards/local", speciesFilter, countyFilter, waterBodyFilter || "lake"],
  });

  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Trophy className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="h-6 w-6 flex items-center justify-center text-gray-500">{position}</span>;
    }
  };

  const getBgColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-50";
      case 2:
        return "bg-gray-50";
      case 3:
        return "bg-orange-50";
      default:
        return "bg-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const LeaderboardCard = ({ title, icon, data, testId }: { title: string; icon: any; data: any[]; testId: string }) => (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid={testId}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {icon}
        {title}
      </h3>
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.slice(0, 3).map((entry: any) => (
            <div 
              key={entry.record.id} 
              className={`flex items-center space-x-3 p-3 ${getBgColor(entry.position)} rounded-lg`}
              data-testid={`leaderboard-entry-${entry.position}`}
            >
              {getTrophyIcon(entry.position)}
              <div className="flex-1">
                <p 
                  className="font-semibold cursor-pointer hover:text-primary transition-colors" 
                  data-testid={`text-username-${entry.position}`}
                  onClick={() => entry.user && setLocation(`/user/${entry.user.id}`)}
                >
                  {entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : 'Utilizator necunoscut'}
                </p>
                <p className="text-sm text-gray-600" data-testid={`text-record-${entry.position}`}>
                  {entry.record.species} {entry.record.weight} kg • {entry.record.location}
                </p>
                <p className="text-xs text-gray-500" data-testid={`text-date-${entry.position}`}>
                  {formatDate(entry.record.dateCaught)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4" data-testid="text-no-records">Nu există recorduri disponibile</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12" id="leaderboards">
      <div className="flex flex-col mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h2 className="text-2xl font-bold text-gray-900" data-testid="leaderboards-title">Clasamente</h2>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Caută după nume utilizator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={leaderboardType} onValueChange={setLeaderboardType}>
            <SelectTrigger className="w-[150px]" data-testid="select-leaderboard-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">Național</SelectItem>
              <SelectItem value="regional">Regional</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-species-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate speciile</SelectItem>
              {fishSpecies.map((fish) => (
                <SelectItem key={fish.id} value={fish.name}>{fish.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={countyFilter} onValueChange={setCountyFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-county-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate județele</SelectItem>
              {romanianCounties.map((county) => (
                <SelectItem key={county.code} value={county.code}>{county.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={waterBodyFilter} onValueChange={setWaterBodyFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-waterbody-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate tipurile de apă</SelectItem>
              <SelectItem value="river">Râuri</SelectItem>
              <SelectItem value="lake">Lacuri</SelectItem>
              <SelectItem value="pond">Bălți</SelectItem>
              <SelectItem value="private_pond">Bălți Private</SelectItem>
              <SelectItem value="coastal">Litoral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LeaderboardCard 
          title="Clasament Național"
          icon={<Flag className="h-5 w-5 text-red-500 mr-2" />}
          data={(nationalLeaderboard as any[]) || []}
          testId="leaderboard-national"
        />
        
        <LeaderboardCard 
          title="Regiunea București"
          icon={<Map className="h-5 w-5 text-blue-500 mr-2" />}
          data={(regionalLeaderboard as any[]) || []}
          testId="leaderboard-regional"
        />
        
        <LeaderboardCard 
          title="Clasament Local"
          icon={<Waves className="h-5 w-5 text-primary mr-2" />}
          data={(localLeaderboard as any[]) || []}
          testId="leaderboard-local"
        />
      </div>
    </div>
  );
}
