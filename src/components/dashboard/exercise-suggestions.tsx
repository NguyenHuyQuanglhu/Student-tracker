"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personalizedExerciseSuggestions } from "@/ai/flows/personalized-exercise-suggestions";
import type { PersonalizedExerciseSuggestionsOutput } from "@/ai/flows/personalized-exercise-suggestions";
import { Lightbulb, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function ExerciseSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const result: PersonalizedExerciseSuggestionsOutput = await personalizedExerciseSuggestions({
        studentId: "student-123",
        courseId: "course-abc",
        learningProgress: "Student has an 85% in Quantum Physics and 92% in Organic Chemistry, but is struggling in Data Structures (72%) and World History (68%). Needs help with algorithm complexity and historical analysis.",
      });
      setSuggestions(result.exerciseSuggestions);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load AI suggestions. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Personalized Exercise Suggestions
                </CardTitle>
                <CardDescription>AI-powered recommendations to help you improve.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={getSuggestions} disabled={loading}>
                Refresh
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div className="flex items-center space-x-4" key={i}>
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                        <BookOpen className="h-4 w-4" />
                    </span>
                </div>
                <div className="pt-1.5">
                    <p className="text-sm text-foreground">{suggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
