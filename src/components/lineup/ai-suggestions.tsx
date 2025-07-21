
"use client";

import { useState } from 'react';
import { Wand2, Loader2, ArrowRight } from 'lucide-react';
import type { User, Player } from '@/lib/data';
import { generateBalancedTeam, type GenerateBalancedTeamOutput } from '@/ai/flows/suggest-player-replacements';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

interface AiSuggestionsProps {
  user: User;
  players: Record<string, Player>;
  onApplyLineup: (lineup: string[], reserves: string[]) => void;
}

export default function AiSuggestions({ user, players, onApplyLineup }: AiSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<GenerateBalancedTeamOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestion(null);
    setIsDialogOpen(true);
    try {
      const result = await generateBalancedTeam({
        availablePlayers: players,
        teamBudget: user.valuation,
      });
      setSuggestion(result);
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        title: "Erro ao gerar time",
        description: "Não foi possível contatar a IA. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (suggestion) {
      onApplyLineup(suggestion.lineup, suggestion.reserves);
      setIsDialogOpen(false);
      toast({
        title: "Time escalado!",
        description: "A escalação sugerida pela IA foi aplicada.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analisando...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Gerar Time com IA
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="text-primary"/>
              Time Gerado pela IA
            </DialogTitle>
            <DialogDescription>
              A nossa IA montou um time balanceado para você.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {suggestion && (
                <>
                    <Card className="bg-muted/50 dark:bg-muted/20">
                        <CardContent className="p-4">
                           <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                        </CardContent>
                    </Card>
                </>
            )}
            {!isLoading && !suggestion && (
                 <p className="text-center text-muted-foreground py-10">
                    Ocorreu um erro ao gerar o time.
                </p>
            )}
          </div>
           {suggestion && !isLoading && (
            <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleApplyClick}>Escalar Time</Button>
            </DialogFooter>
           )}
        </DialogContent>
      </Dialog>
    </>
  );
}
