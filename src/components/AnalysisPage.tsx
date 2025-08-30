import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, BookOpen, ArrowLeft } from "lucide-react";
import { getOrCreateSessionId } from "@/utils/session";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
interface AnalyzeResponse {
  mistakes: string[];
  suggestions: string[];
  vocabTips: string[];
}

const AnalysisPage: React.FC = () => {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const sessionId = getOrCreateSessionId();
        const response = await fetch("http://localhost:8080/api/chat/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId }), 
        });

        if (!response.ok) throw new Error("No Conversation Found");

        const result: AnalyzeResponse = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Analyzing your conversation...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load analysis.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="border-b bg-card/80 backdrop-blur-sm mb-2">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">English Talk Buddy</h1>
          </div>
        </div>
      </div>

      {/* Mistakes */}
      <Card className="mb-6 border-red-300 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-500" />
            <h2 className="text-lg font-semibold text-red-600">Mistakes</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.mistakes.map((m, idx) => (
              <li key={idx}>{m.replace(/^\*\s*/, "")}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="mb-6 border-green-300 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-green-600" />
            <h2 className="text-lg font-semibold text-green-700">Suggestions</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.suggestions.map((s, idx) => (
              <li key={idx}>{s.replace(/^\*\s*/, "")}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Vocabulary Tips */}
      <Card className="border-blue-300 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-700">
              Vocabulary Tips
            </h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.vocabTips.map((tip, idx) => (
              <li key={idx}>{tip.replace(/^\*\s*/, "")}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisPage;
