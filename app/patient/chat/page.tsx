'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function PatientChat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([
    {
      text: "Hello! I'm your AI Health Assistant. How can I help you today? I can provide general health information, answer questions about symptoms, or help you prepare for your doctor's appointment.",
      sender: 'ai',
      time: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=patient')
    }
  }, [status, router])

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Medical symptoms responses
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "For fever, I recommend: 1) Rest and stay hydrated. 2) Take over-the-counter fever reducers if needed. 3) Monitor your temperature. If fever persists beyond 3 days or exceeds 103°F (39.4°C), please book an appointment with a doctor immediately."
    }
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      return "Headaches can have various causes. Try: 1) Resting in a quiet, dark room. 2) Staying hydrated. 3) Applying a cold compress. If headaches are severe, frequent, or accompanied by other symptoms like vision changes, please consult a doctor."
    }
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
      return "For cough and cold: 1) Get plenty of rest. 2) Drink warm fluids like tea or soup. 3) Use a humidifier. 4) Gargle with salt water. If symptoms persist beyond a week or worsen, please schedule an appointment."
    }
    if (lowerMessage.includes('stomach') || lowerMessage.includes('pain') || lowerMessage.includes('ache')) {
      return "Stomach pain can have many causes. General advice: 1) Avoid heavy, spicy, or fatty foods. 2) Stay hydrated. 3) Rest. If pain is severe, persistent, or accompanied by vomiting, fever, or blood, seek medical attention immediately."
    }
    
    // Appointment related
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
      return "You can easily book an appointment through our system! Click on 'Book Appointment' from your dashboard, select your preferred doctor and time slot. Would you like me to guide you through the process?"
    }
    if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
      return "We have specialists in various fields including Cardiology, Neurology, Orthopedics, Pediatrics, and Dermatology. You can view all available doctors and their specializations when booking an appointment. Is there a specific specialty you're looking for?"
    }
    
    // General health
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      return "I cannot prescribe medications, but your doctor can provide prescriptions during your appointment. You can view all your prescriptions in the 'Medical Records' section. Always take medications as prescribed by your doctor."
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "⚠️ If this is a medical emergency, please call emergency services (911) immediately or go to the nearest emergency room. For urgent but non-emergency issues, you can book an immediate appointment or visit our urgent care."
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I assist you with your health concerns today? Feel free to ask about symptoms, appointments, or general health information."
    }
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with? Remember, I'm here 24/7 to assist you."
    }
    
    // Default response
    return "I understand you're asking about: \"" + userMessage + "\". While I can provide general health information, for specific medical advice, I recommend booking an appointment with one of our doctors. They can provide personalized care based on your medical history. Would you like to book an appointment?"
  }

  const handleSend = () => {
    if (message.trim()) {
      // Add user message
      const userMsg = { text: message, sender: 'patient', time: new Date() }
      setMessages(prev => [...prev, userMsg])
      setMessage('')
      
      // Show typing indicator
      setIsTyping(true)
      
      // Simulate AI thinking and respond
      setTimeout(() => {
        const aiResponse = getAIResponse(message)
        const aiMsg = { text: aiResponse, sender: 'ai', time: new Date() }
        setMessages(prev => [...prev, aiMsg])
        setIsTyping(false)
      }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">AI Health Assistant</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No messages yet. Start a conversation with your AI assistant.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'patient' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                    }`}>
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">🤖 AI Assistant</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.time.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">🤖 AI Assistant</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
