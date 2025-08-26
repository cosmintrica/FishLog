import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { fishSpecies, romanianCounties } from "@/data/fish-species";
import { Upload, Video, Camera, AlertTriangle, ExternalLink } from "lucide-react";

interface SubmitRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  prefilledLocation?: {
    name: string;
    county: string;
    type: string;
    latitude?: string;
    longitude?: string;
  };
}

export function SubmitRecordModal({ isOpen, onClose, user, prefilledLocation }: SubmitRecordModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    species: "",
    weight: "",
    length: "",
    location: prefilledLocation?.name || "",
    county: prefilledLocation?.county || "",
    waterType: prefilledLocation?.type || "",
    dateCaught: "",
    description: "",
    latitude: prefilledLocation?.latitude || "",
    longitude: prefilledLocation?.longitude || ""
  });

  const [uploadFiles, setUploadFiles] = useState({
    video: null as File | null,
    photos: [] as File[]
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error("Trebuie să fii conectat pentru a înregistra un record");
      
      const recordData = {
        ...data,
        userId: user.id,
        dateCaught: new Date(data.dateCaught),
        photos: [] // TODO: Implement photo upload
      };
      
      const response = await apiRequest("POST", "/api/fishing-records", recordData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Record înregistrat cu succes!" });
      queryClient.invalidateQueries({ queryKey: ["/api/fishing-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      onClose();
      setForm({
        species: "",
        weight: "",
        length: "",
        location: "",
        county: "",
        waterType: "",
        dateCaught: "",
        description: "",
        latitude: "",
        longitude: ""
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Eroare", 
        description: error.message || "Nu s-a putut înregistra recordul", 
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Eroare", description: "Trebuie să fii conectat", variant: "destructive" });
      return;
    }

    // Validate required fields
    if (!form.species || !form.weight || !form.length || !form.location || !form.county || !form.dateCaught) {
      toast({ 
        title: "Eroare", 
        description: "Toate câmpurile obligatorii trebuie completate", 
        variant: "destructive" 
      });
      return;
    }

    if (!uploadFiles.video) {
      toast({ 
        title: "Eroare", 
        description: "Videoul este obligatoriu pentru verificarea recordului", 
        variant: "destructive" 
      });
      return;
    }

    submitMutation.mutate(form);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "Eroare",
          description: "Videoul nu poate depăși 100MB",
          variant: "destructive"
        });
        return;
      }
      setUploadFiles({ ...uploadFiles, video: file });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadFiles.photos.length > 5) {
      toast({
        title: "Eroare", 
        description: "Poți încărca maximum 5 fotografii",
        variant: "destructive"
      });
      return;
    }
    setUploadFiles({ ...uploadFiles, photos: [...uploadFiles.photos, ...files] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-submit-record">
        <DialogHeader>
          <DialogTitle>Înregistrează Record</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="species">Specia Peștelui</Label>
              <Select value={form.species} onValueChange={(value) => setForm({ ...form, species: value })}>
                <SelectTrigger data-testid="select-species">
                  <SelectValue placeholder="Selectează specia" />
                </SelectTrigger>
                <SelectContent>
                  {fishSpecies.map((fish) => (
                    <SelectItem key={fish.id} value={fish.name}>
                      {fish.name} ({fish.scientificName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="weight">Greutate (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="0.0"
                required
                data-testid="input-weight"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Lungime (cm) *</Label>
              <Input
                id="length"
                type="number"
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
                placeholder="0"
                required
                data-testid="input-length"
              />
            </div>
            
            <div>
              <Label htmlFor="dateCaught">Data Capturii</Label>
              <Input
                id="dateCaught"
                type="date"
                value={form.dateCaught}
                onChange={(e) => setForm({ ...form, dateCaught: e.target.value })}
                required
                data-testid="input-date"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Locația</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="ex: Lacul Snagov, București"
              required
              data-testid="input-location"
            />
            {prefilledLocation && (
              <p className="text-sm text-gray-500 mt-1">Locația completată automat din hartă</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="county">Județul</Label>
              <Select value={form.county} onValueChange={(value) => setForm({ ...form, county: value })}>
                <SelectTrigger data-testid="select-county">
                  <SelectValue placeholder="Selectează județul" />
                </SelectTrigger>
                <SelectContent>
                  {romanianCounties.map((county) => (
                    <SelectItem key={county.code} value={county.code}>
                      {county.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="waterType">Tipul Apei</Label>
              <Select value={form.waterType} onValueChange={(value) => setForm({ ...form, waterType: value })}>
                <SelectTrigger data-testid="select-water-type">
                  <SelectValue placeholder="Selectează tipul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="river">Râu</SelectItem>
                  <SelectItem value="lake">Lac</SelectItem>
                  <SelectItem value="pond">Baltă</SelectItem>
                  <SelectItem value="reservoir">Rezervor</SelectItem>
                  <SelectItem value="canal">Canal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Video Upload - Required */}
          <div>
            <Label htmlFor="video">Video * (Obligatoriu pentru verificare)</Label>
            <Alert className="mb-4">
              <Video className="h-4 w-4" />
              <AlertDescription>
                Videoul trebuie să conțină: declarația pentru site, cântărirea peștelui, măsurarea lungimii și locația.
                <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => window.open('/guidelines', '_blank')}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Vezi ghidul complet
                </Button>
              </AlertDescription>
            </Alert>
            <div className="border-2 border-dashed border-red-300 rounded-lg p-6">
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                data-testid="input-video"
              />
              <label 
                htmlFor="video" 
                className="cursor-pointer flex flex-col items-center"
              >
                <Video className="mx-auto h-12 w-12 text-red-500" />
                <p className="mt-2 text-gray-700 font-medium">
                  {uploadFiles.video ? uploadFiles.video.name : "Încarcă video (max 100MB)"}
                </p>
                <p className="text-sm text-gray-500">MP4, MOV, AVI - minim 30 secunde</p>
              </label>
            </div>
          </div>

          {/* Photo Upload - Optional */}
          <div>
            <Label htmlFor="photos">Fotografii (Opțional - ajută la verificare rapidă)</Label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6">
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                data-testid="input-photos"
              />
              <label 
                htmlFor="photos" 
                className="cursor-pointer flex flex-col items-center"
              >
                <Camera className="mx-auto h-12 w-12 text-blue-500" />
                <p className="mt-2 text-gray-700 font-medium">
                  {uploadFiles.photos.length > 0 
                    ? `${uploadFiles.photos.length} fotografii selectate` 
                    : "Încarcă fotografii (max 5)"
                  }
                </p>
                <p className="text-sm text-gray-500">JPG, PNG - peștele pe cântar, cu ruleta, la locație</p>
              </label>
            </div>
            {uploadFiles.photos.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadFiles.photos.map((photo, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{photo.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newPhotos = uploadFiles.photos.filter((_, i) => i !== index);
                        setUploadFiles({ ...uploadFiles, photos: newPhotos });
                      }}
                    >
                      Șterge
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Detalii Suplimentare</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Momeli folosite, condiții meteo, alte observații..."
              rows={3}
              data-testid="textarea-description"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" data-testid="button-cancel">
              Anulează
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-accent text-white hover:bg-yellow-600" 
              disabled={submitMutation.isPending}
              data-testid="button-submit-record"
            >
              {submitMutation.isPending ? "Se înregistrează..." : "Înregistrează Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
