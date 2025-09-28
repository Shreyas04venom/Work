import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  X, 
  Minimize2,
  Maximize2,
  Lightbulb,
  Calculator,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, AIChat } from '@/lib/supabase';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  context?: string;
}

const AIChatbot = ({ isOpen, onClose, context }: AIChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickActions = [
    {
      id: 'tax-optimization',
      label: 'Tax Optimization',
      icon: Calculator,
      prompt: 'How can I optimize my tax savings for this year?'
    },
    {
      id: 'credit-score',
      label: 'Credit Score',
      icon: CreditCard,
      prompt: 'How can I improve my credit score?'
    },
    {
      id: 'investment-advice',
      label: 'Investment Advice',
      icon: TrendingUp,
      prompt: 'What are the best investment options for me?'
    },
    {
      id: 'general-query',
      label: 'General Query',
      icon: Lightbulb,
      prompt: 'I have a question about my finances'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_chats')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const chatMessages: ChatMessage[] = data.map(chat => ({
        id: chat.id,
        type: 'user',
        message: chat.message,
        timestamp: new Date(chat.created_at),
        context: chat.context
      }));

      // Add AI responses
      const aiMessages: ChatMessage[] = data.map(chat => ({
        id: chat.id + '_ai',
        type: 'ai',
        message: chat.response,
        timestamp: new Date(chat.created_at),
        context: chat.context
      }));

      // Interleave user and AI messages
      const allMessages: ChatMessage[] = [];
      for (let i = 0; i < chatMessages.length; i++) {
        allMessages.push(chatMessages[i]);
        allMessages.push(aiMessages[i]);
      }

      setMessages(allMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date(),
      context
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI API call)
      const aiResponse = await generateAIResponse(message, context);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        context
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to database
      await supabase
        .from('ai_chats')
        .insert({
          message: message.trim(),
          response: aiResponse,
          context: context || 'general'
        });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message: string, context?: string): Promise<string> => {
    // Simulate AI response based on context and message
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('tax') || lowerMessage.includes('optimization')) {
      return `Based on your financial profile, here are some tax optimization strategies:

1. **Section 80C**: You can save up to ₹1.5 lakhs by investing in ELSS, PPF, or EPF
2. **Section 80D**: Health insurance premiums can save you up to ₹25,000-₹1 lakh
3. **HRA**: If you're paying rent, ensure you're claiming House Rent Allowance
4. **NPS**: Additional ₹50,000 deduction under Section 80CCD(1B)

Would you like me to help you calculate your potential tax savings?`;
    }
    
    if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
      return `Here's how you can improve your credit score:

1. **Payment History (35%)**: Pay all bills on time, set up auto-payments
2. **Credit Utilization (30%)**: Keep credit card usage below 30% of limit
3. **Credit Age (15%)**: Keep old accounts open, don't close them unnecessarily
4. **Credit Mix (10%)**: Have a mix of credit types (cards, loans, etc.)
5. **New Credit (10%)**: Limit new credit applications

Your current score of 720 is good, but we can help you reach 750+ with these strategies.`;
    }
    
    if (lowerMessage.includes('investment') || lowerMessage.includes('invest')) {
      return `Here are some investment options based on your risk profile:

**Low Risk:**
- Fixed Deposits (6-7% returns)
- Government Securities (7-8% returns)
- PPF (7.1% returns, tax-free)

**Medium Risk:**
- Balanced Mutual Funds (10-12% returns)
- Corporate Bonds (8-9% returns)
- Hybrid Funds (9-11% returns)

**High Risk:**
- Equity Mutual Funds (12-15% returns)
- Direct Equity (15-20% returns)
- Small Cap Funds (15-18% returns)

Would you like me to create a personalized investment plan for you?`;
    }
    
    return `I'm here to help you with your financial questions! I can assist with:

- Tax optimization strategies
- Credit score improvement
- Investment planning
- Budget management
- Financial goal setting
- Document analysis

What specific area would you like to discuss?`;
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
  };

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
    } else {
      // Start listening (simulate voice input)
      setIsListening(true);
      toast({
        title: "Voice Input",
        description: "Voice input is not yet implemented. Please type your message.",
      });
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <Card className="w-full h-full flex flex-col shadow-2xl border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="h-4 w-4" />
            TaxWise AI Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Welcome to TaxWise AI!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        I'm here to help you with your financial questions and optimization.
                      </p>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Quick actions:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map(action => {
                            const Icon = action.icon;
                            return (
                              <Button
                                key={action.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAction(action.prompt)}
                                className="h-auto p-2 text-left justify-start"
                              >
                                <Icon className="h-3 w-3 mr-2" />
                                <span className="text-xs">{action.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'user' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about your finances..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleListening}
                      className={`h-10 w-10 p-0 ${isListening ? 'text-primary' : ''}`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => sendMessage(inputMessage)}
                      disabled={!inputMessage.trim() || isLoading}
                      className="h-10 w-10 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;
