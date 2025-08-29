import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mic, BookOpen } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Practice conversational English with our AI tutor"
    },
    {
      icon: Mic,
      title: "Voice Practice",
      description: "Speak naturally and get instant pronunciation feedback"
    },
    {
      icon: BookOpen,
      title: "Grammar Insights",
      description: "Receive personalized grammar tips and improvements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
            English Talk Buddy
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto">
            Practice English speaking with real-time AI feedback. Build confidence through natural conversations.
          </p>
          
          <div className="mb-12 animate-bounce-in">
            <img 
              src={heroImage} 
              alt="People learning English together" 
              className="rounded-2xl shadow-2xl mx-auto max-w-full h-auto"
            />
          </div>

          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-in"
            onClick={() => navigate('/chat')}
          >
            Start Chat
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose English Talk Buddy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 animate-fade-in border-0 bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;