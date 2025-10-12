
'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { warnings as staticWarnings, Warning } from "@/app/lib/mock-data";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export function EarlyWarnings() {
  const [warnings, setWarnings] = useState<Warning[]>(staticWarnings);

  const updateWarnings = () => {
    if (typeof window === 'undefined') return;
    const dynamicWarnings: Warning[] = JSON.parse(sessionStorage.getItem('dynamicWarnings') || '[]');
    setWarnings([...staticWarnings, ...dynamicWarnings]);
  };

  useEffect(() => {
    updateWarnings();

    window.addEventListener('warningsChanged', updateWarnings);

    return () => {
      window.removeEventListener('warningsChanged', updateWarnings);
    };
  }, []);

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
