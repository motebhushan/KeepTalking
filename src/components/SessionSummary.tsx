import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChat } from '@/contexts/ChatContext';
import { Trophy, MessageSquare, Clock, BookOpen } from 'lucide-react';

const SessionSummary: React.FC = () => {
  const { state } = useChat();
  const { sessionData, messages } = state;

  // Calculate session duration (mock calculation)
  const sessionStartTime = messages.length > 0 ? messages[0].timestamp : new Date();
  const currentTime = new Date();
  const durationMinutes = Math.floor((currentTime.getTime() - sessionStartTime.getTime()) / (1000 * 60));

  const stats = [
    {
      icon: Trophy,
      label: "Grammar Score",
      value: `${sessionData.grammarScore}%`,
      progress: sessionData.grammarScore,
      color: sessionData.grammarScore >= 70 ? "text-green-600" : sessionData.grammarScore >= 50 ? "text-yellow-600" : "text-red-600"
    },
    {
      icon: MessageSquare,
      label: "Messages",
      value: sessionData.totalMessages.toString(),
      progress: Math.min(100, (sessionData.totalMessages / 20) * 100),
      color: "text-blue-600"
    },
    {
      icon: Clock,
      label: "Duration",
      value: `${durationMinutes}m`,
      progress: Math.min(100, (durationMinutes / 30) * 100),
      color: "text-purple-600"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Session Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Vocabulary Tips */}
      {sessionData.vocabularyTips.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Vocabulary Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionData.vocabularyTips.slice(-3).map((tip, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="block p-2 text-xs animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tip}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvements */}
      {sessionData.improvements.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionData.improvements.slice(-3).map((improvement, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-accent/20 rounded-lg text-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {improvement}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Encouragement */}
      <Card className="bg-gradient-hero text-white border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold mb-2">Keep Going! 🌟</h3>
          <p className="text-sm opacity-90">
            {messages.length < 5 
              ? "You're just getting started! Keep the conversation flowing."
              : messages.length < 15
              ? "Great progress! Your English is improving with each message."
              : "Amazing work! You're having a fantastic conversation!"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionSummary;