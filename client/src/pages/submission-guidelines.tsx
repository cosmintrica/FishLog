import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Video, Camera, Scale, Ruler, CheckCircle, AlertTriangle } from "lucide-react";

export default function SubmissionGuidelines() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="page-title">
            Ghid pentru Submisia Recordurilor
          </h1>
          <p className="text-lg text-gray-600" data-testid="page-description">
            Urmează aceste instrucțiuni pentru a-ți submite recordul corect și a fi verificat rapid
          </p>
        </div>

        {/* Video Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 text-red-500 mr-2" />
              Cerințe pentru Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>IMPORTANT:</strong> Videoul este obligatoriu pentru toate recordurile. Fără video, recordul nu va fi verificat.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">✅ Ce trebuie să conțină videoul:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Spune clar: "Această filmare este pentru submisia pe PescArt România"</li>
                    <li>• Arată peștele pe cântar cu greutatea vizibilă</li>
                    <li>• Măsoară lungimea cu ruleta/riglă</li>
                    <li>• Filmează locația de pescuit</li>
                    <li>• Durata minimă: 30 secunde</li>
                    <li>• Calitate minimă: 720p</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">❌ Ce NU trebuie să faci:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Nu edita videoul</li>
                    <li>• Nu folosi imagini statice</li>
                    <li>• Nu ascunde cântarul sau ruleta</li>
                    <li>• Nu filma în întuneric complet</li>
                    <li>• Nu folosi cântare defecte</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 text-blue-500 mr-2" />
              Cerințe pentru Fotografii
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Scale className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Fotografie cu Cântarul</h4>
                  <p className="text-sm text-gray-600">Peștele pe cântar cu greutatea clară</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Ruler className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Fotografie cu Ruleta</h4>
                  <p className="text-sm text-gray-600">Măsurarea lungimii cu riglă/ruletă</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Camera className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Fotografie la Locație</h4>
                  <p className="text-sm text-gray-600">Tu cu peștele la locul de pescuit</p>
                </div>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Fotografiile sunt opționale dacă ai video complet, dar ajută la verificarea mai rapidă.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Measurement Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 text-purple-500 mr-2" />
              Cerințe pentru Măsurători
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Greutatea (Obligatorie)</h4>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Folosește un cântar digital calibrat</li>
                  <li>• Afișajul trebuie să fie clar vizibil</li>
                  <li>• Peștele trebuie să fie cântărit proaspăt prins</li>
                  <li>• Precisie minimă: 0.1 kg</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Lungimea (Obligatorie)</h4>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Măsoară de la vârful gurii la vârful cozii</li>
                  <li>• Folosește riglă sau ruletă cu gradații clare</li>
                  <li>• Peștele trebuie să fie întins drept</li>
                  <li>• Precisie: 1 cm</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Process */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Procesul de Verificare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">1</Badge>
                <div>
                  <h4 className="font-semibold">Submisia Recordului</h4>
                  <p className="text-sm text-gray-600">Completezi formularul cu toate datele și încarci materialele</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">2</Badge>
                <div>
                  <h4 className="font-semibold">Verificare Automată</h4>
                  <p className="text-sm text-gray-600">Sistemul verifică dacă toate fișierele și datele sunt complete</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">3</Badge>
                <div>
                  <h4 className="font-semibold">Verificare Manuală</h4>
                  <p className="text-sm text-gray-600">Administratorii verifică videoul și fotografiile (24-48 ore)</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">4</Badge>
                <div>
                  <h4 className="font-semibold">Publicare Record</h4>
                  <p className="text-sm text-gray-600">Recordul apare în clasamente și pe profilul tău</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Sfaturi pentru Verificare Rapidă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">🚀 Pentru verificare rapidă:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Filmează în lumină naturală bună</li>
                  <li>• Vorbește clar în video</li>
                  <li>• Arată cântarul și ruleta aproape</li>
                  <li>• Completează toate câmpurile obligatorii</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">⚠️ Evită respingerile:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Nu folosi recorduri vechi</li>
                  <li>• Nu copia conținut de pe alte site-uri</li>
                  <li>• Nu exagera dimensiunile</li>
                  <li>• Nu uita să menționezi site-ul în video</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}