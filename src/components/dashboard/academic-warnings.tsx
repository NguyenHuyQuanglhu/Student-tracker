'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { warnings as staticWarnings, Warning } from '@/app/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

export function AcademicWarnings() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);

  const updateWarnings = () => {
    if (typeof window === 'undefined') return;

    const dynamicWarnings: Warning[] = JSON.parse(sessionStorage.getItem('dynamicWarnings') || '[]');
    
    // Combine static and dynamic warnings, then sort by reversing to get newest first, and slice to get top 5
    const allWarnings = [...staticWarnings, ...dynamicWarnings].reverse().slice(0, 5);
    setWarnings(allWarnings);
    setLoading(false);
  };

  useEffect(() => {
    updateWarnings();

    window.addEventListener('warningsChanged', updateWarnings);
    return () => {
      window.removeEventListener('warningsChanged', updateWarnings);
    };
  }, []);

  return (
    <Card className="flex flex-col">
      <Accordion type="single" collapsible className="w-full flex flex-col flex-grow" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0 flex flex-col flex-grow">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex flex-col items-start text-left">
              <CardTitle className="font-headline flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Cảnh báo học tập
              </CardTitle>
              <CardDescription className="pt-1.5">Những vấn đề cần chú ý trong quá trình học tập của bạn.</CardDescription>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex-grow flex flex-col justify-end">
            <CardContent>
              {loading ? (
                   <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                      <div className="flex items-start space-x-4" key={i}>
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                          </div>
                      </div>
                      ))}
                  </div>
              ) : warnings.length > 0 ? (
                <ul className="space-y-4">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                       <div className="flex-shrink-0 mr-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                              <AlertCircle className="h-5 w-5" />
                          </span>
                      </div>
                      <div className="pt-1">
                          <p className="text-sm font-medium text-foreground">{warning.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p>Tuyệt vời! Không có cảnh báo nào.</p>
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
