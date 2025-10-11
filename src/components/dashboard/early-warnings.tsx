import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { warnings } from "@/app/lib/mock-data";
import { AlertTriangle } from "lucide-react";

export function EarlyWarnings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Cảnh báo sớm</CardTitle>
        <CardDescription>Các cảnh báo quan trọng về tiến độ của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {warnings.length > 0 ? warnings.map((warning) => (
          <Alert key={warning.id} variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Yêu cầu chú ý</AlertTitle>
            <AlertDescription>{warning.message}</AlertDescription>
          </Alert>
        )) : (
          <p className="text-sm text-muted-foreground">Không có cảnh báo vào lúc này. Hãy tiếp tục làm tốt nhé!</p>
        )}
      </CardContent>
    </Card>
  );
}
