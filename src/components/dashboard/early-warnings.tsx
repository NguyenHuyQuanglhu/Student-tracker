import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { warnings } from "@/app/lib/mock-data";
import { AlertTriangle } from "lucide-react";

export function EarlyWarnings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Early Warnings</CardTitle>
        <CardDescription>Important alerts about your progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {warnings.length > 0 ? warnings.map((warning) => (
          <Alert key={warning.id} variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attention Required</AlertTitle>
            <AlertDescription>{warning.message}</AlertDescription>
          </Alert>
        )) : (
          <p className="text-sm text-muted-foreground">No warnings at this time. Keep up the great work!</p>
        )}
      </CardContent>
    </Card>
  );
}
