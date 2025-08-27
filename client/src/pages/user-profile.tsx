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
              <div className="flex items-center space-x-
