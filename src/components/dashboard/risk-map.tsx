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
      <CardContent className="flex-grow relative min-h-[300px] flex-shrink overflow-hidden">
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
      <CardFooter className="pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 w-full">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-muted-foreground">Critical</span>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
