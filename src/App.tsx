import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  PaperPlaneRight,
  FilePdf,
  Robot,
  User,
  SpinnerGap,
  CheckCircle,
  WarningCircle,
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: number
}

interface AnalysisStatus {
  phase: string
  current: number
  total: number
  logs: string[]
}

function App() {
  const [messages, setMessages] = useKV<Message[]>('chat-messages', [])
  const [inputValue, setInputValue] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, analysisStatus])

  const sendMessage = (content: string) => {
    if (!content.trim() || isAnalyzing) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...(prev || []), newMessage])
    setInputValue('')

    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: '¡Entendido! ¿Tienes algún documento PDF que necesites analizar? Puedes subirlo usando el botón de archivo.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...(prev || []), agentResponse])
    }, 800)
  }

  const simulateAnalysis = async (fileName: string) => {
    setIsAnalyzing(true)
    setFileError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `📄 ${fileName}`,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...(prev || []), userMessage])

    const phases = [
      { phase: 'Extrayendo información del documento...', duration: 1500 },
      { phase: 'Leyendo estructura del documento...', duration: 1200 },
      { phase: 'Procesando información...', duration: 1000 },
    ]

    for (const { phase, duration } of phases) {
      setAnalysisStatus({
        phase,
        current: 0,
        total: 0,
        logs: [],
      })
      await new Promise((resolve) => setTimeout(resolve, duration))
    }

    const totalRules = 15
    setAnalysisStatus({
      phase: 'Analizando reglas',
      current: 0,
      total: totalRules,
      logs: [],
    })

    for (let i = 1; i <= totalRules; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

      setAnalysisStatus((prev) => {
        if (!prev) return prev
        const newLog = `✓ Regla ${i}/${totalRules} analizada`
        return {
          ...prev,
          current: i,
          logs: [...prev.logs, newLog],
        }
      })
    }

    setAnalysisStatus({
      phase: 'Detectando errores y anomalías...',
      current: totalRules,
      total: totalRules,
      logs: [],
    })
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const agentResponse: Message = {
      id: (Date.now() + 2).toString(),
      role: 'agent',
      content: `Análisis completado para "${fileName}"\n\n✅ Se procesaron ${totalRules} reglas exitosamente\n⚠️ Se detectaron 3 advertencias menores\n\nResumen:\n- Todas las reglas son sintácticamente válidas\n- Se recomienda revisar las reglas 4, 8 y 12 por posibles optimizaciones\n- Tiempo de procesamiento: ${((totalRules * 500) / 1000).toFixed(1)}s`,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...(prev || []), agentResponse])
    setIsAnalyzing(false)
    setAnalysisStatus(null)
    toast.success('Análisis completado exitosamente')
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setFileError('Solo se aceptan archivos PDF')
      toast.error('Solo se aceptan archivos PDF')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('El archivo es demasiado grande (máximo 10MB)')
      toast.error('El archivo es demasiado grande')
      return
    }

    setFileError(null)
    simulateAnalysis(file.name)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-semibold text-2xl text-foreground">Análisis de Documentos AI</h1>
          <p className="text-muted-foreground text-sm">Agente inteligente para análisis de reglas en documentos PDF</p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {(!messages || messages.length === 0) && (
              <Card className="border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                <Robot className="mx-auto mb-3 text-muted-foreground" size={48} weight="duotone" />
                <h3 className="mb-2 font-medium text-foreground text-lg">¡Bienvenido!</h3>
                <p className="text-muted-foreground text-sm">
                  Envía un mensaje o sube un documento PDF para comenzar el análisis de reglas.
                </p>
              </Card>
            )}

            {messages && messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'agent' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Robot size={20} weight="duotone" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-card text-card-foreground shadow-sm ring-1 ring-border/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User size={20} weight="duotone" />
                  </div>
                )}
              </div>
            ))}

            {isAnalyzing && analysisStatus && (
              <Card className="border-primary/20 bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <SpinnerGap className="animate-spin text-primary" size={20} weight="bold" />
                  <span className="shimmer-text font-medium text-sm">{analysisStatus.phase}</span>
                  {analysisStatus.total > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {analysisStatus.current}/{analysisStatus.total}
                    </Badge>
                  )}
                </div>

                {analysisStatus.total > 0 && (
                  <Progress
                    value={(analysisStatus.current / analysisStatus.total) * 100}
                    className="mb-3 h-2"
                  />
                )}

                {analysisStatus.logs.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <ScrollArea className="h-32">
                      <div className="space-y-1 rounded-md bg-muted p-3 font-mono text-xs">
                        {analysisStatus.logs.map((log, idx) => (
                          <div key={idx} className="shimmer-text flex items-center gap-2">
                            <CheckCircle size={14} weight="fill" className="shrink-0 text-accent" />
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </Card>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto max-w-4xl">
            {fileError && (
              <Alert variant="destructive" className="mb-3">
                <WarningCircle size={16} weight="fill" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isAnalyzing}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="shrink-0"
              >
                <FilePdf size={20} weight="duotone" />
              </Button>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe un mensaje..."
                disabled={isAnalyzing}
                className="flex-1 text-[15px]"
              />

              <Button
                type="submit"
                disabled={!inputValue.trim() || isAnalyzing}
                className="shrink-0"
              >
                {isAnalyzing ? (
                  <SpinnerGap className="animate-spin" size={20} weight="bold" />
                ) : (
                  <PaperPlaneRight size={20} weight="fill" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App