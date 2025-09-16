import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function RiskMap() {
  const riskMapImage = PlaceHolderImages.find((img) => img.id === 'risk-map');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Real-Time Risk Map</CardTitle>
        <CardDescription>Vulnerable zones based on multi-source data correlation.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative min-h-[400px]">
        {riskMapImage && (
          <Image
            src={riskMapImage.imageUrl}
            alt={riskMapImage.description}
            fill
            className="rounded-lg object-cover"
            data-ai-hint={riskMapImage.imageHint}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-muted-foreground">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <span className="text-sm text-muted-foreground">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <span className="text-sm text-muted-foreground">Critical</span>
        </div>
      </CardFooter>
    </Card>
  );
}
