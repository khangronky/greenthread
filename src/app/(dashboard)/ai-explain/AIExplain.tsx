'use client';

import { 
  Brain, Clock, Minus, TrendingDown, TrendingUp, 
  Bot, Send, Loader2, User, AlertCircle, Sparkles,
  MessageSquareText
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// Logic & Types
import { getAIExplanations } from '@/data/mockData';
import { useAIExplainStore } from '@/stores/ai-explain.store';
import type { AIExplanation } from '@/types';

// Helper to extract text content from UIMessage parts
function getMessageContent(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return '';
  return message.parts
    .filter((part) => part.type === 'text' && part.text)
    .map((part) => part.text)
    .join('');
}

export default function AIExplain() {
  // --- State for Data List ---
  const [explanations] = useState<AIExplanation[]>(getAIExplanations());
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- AI Chat Logic ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const { clearHighlight, setIsStreaming } = useAIExplainStore();

  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: '/api/ai/explain',
    }),
    onFinish: () => {
      setIsStreaming(false);
      clearHighlight();
    },
    onError: (err) => {
      console.error('Chat error:', err);
      setIsStreaming(false);
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Update streaming status
  useEffect(() => {
    setIsStreaming(isLoading);
  }, [isLoading, setIsStreaming]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- Handlers ---
  const handleAskAI = (exp: AIExplanation) => {
    setIsChatOpen(true);
    // Send a context-aware prompt automatically
    sendMessage({
      text: `Analyze this ${exp.sensor} reading: Value is ${exp.value}, Status is ${exp.status}. The main factors are ${exp.factors.map(f => f.factor).join(', ')}. What should I do first?`
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const sensors = ['all', 'pH Level', 'Dissolved Oxygen', 'Turbidity', 'Conductivity', 'Flow Rate'];

  const filteredExplanations = explanations.filter(
    (exp) => selectedSensor === 'all' || exp.sensor === selectedSensor
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-3xl">
            <Brain className="h-8 w-8 text-primary" /> AI Insights
          </h1>
          <p className="text-muted-foreground text-sm">
            Structured causal analysis with interactive AI support
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsChatOpen(true)}>
          <MessageSquareText className="mr-2 h-4 w-4" /> Open Chat
        </Button>
      </div>

      {/* 2. Sensor Filters */}
      <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-2">
        {sensors.map((sensor) => (
          <Button
            key={sensor}
            variant={selectedSensor === sensor ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedSensor(sensor)}
            className="h-8"
          >
            {sensor === 'all' ? 'All Parameters' : sensor}
          </Button>
        ))}
      </div>

      {/* 3. Analysis List */}
      <div className="grid gap-4">
        {filteredExplanations.map((explanation) => (
          <Card key={explanation.id} className="overflow-hidden transition-all hover:border-primary/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${explanation.status === 'anomaly' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    {explanation.status === 'anomaly' ? <TrendingDown className="h-5 w-5 text-destructive" /> : <TrendingUp className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{explanation.sensor}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" /> {explanation.timestamp.toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-xl">{explanation.value.toFixed(2)}</div>
                    <Badge variant={explanation.status === 'anomaly' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                      {explanation.status}
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => handleAskAI(explanation)} className="gap-2">
                    <Sparkles className="h-4 w-4" /> Explain
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {explanation.factors.slice(0, 2).map((factor, idx) => (
                  <div key={idx} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{factor.factor}</span>
                      <span className={`text-[10px] font-bold ${factor.impact === 'high' ? 'text-destructive' : 'text-primary'}`}>
                        {factor.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{factor.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. AI Chat Side Pop-up (Sheet) */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent className="flex w-[400px] flex-col p-0 sm:w-[540px]">
          <SheetHeader className="border-b p-6">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" /> AI Causal Analyst
            </SheetTitle>
            <SheetDescription>
              Real-time deep dive into compliance and sensor data.
            </SheetDescription>
          </SheetHeader>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center pt-20 text-center opacity-50">
                <Brain className="mb-4 h-12 w-12" />
                <p className="text-sm">Select "Explain" on a card to start analysis</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && <Bot className="mt-1 h-5 w-5 text-primary" />}
                    <div className={`rounded-lg px-4 py-2 text-sm max-w-[85%] ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                      {getMessageContent(m)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                  </div>
                )}
                {error && (
                  <div className="flex gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3 border border-destructive/30">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Error: {error.message || 'Failed to get response. Please try again.'}</span>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Form */}
          <div className="border-t p-4">
            <form onSubmit={onSubmit} className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask follow-up questions..."
                className="min-h-[80px] pr-12 resize-none"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute bottom-2 right-2 h-8 w-8"
                disabled={isLoading || !input?.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}