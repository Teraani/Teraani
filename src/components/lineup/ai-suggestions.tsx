"use client";

import { useState } from 'react';
import { Wand2, Loader2, ArrowRight } from 'lucide-react';
import type { User, Player } from '@/lib/data';
import { suggestPlayerReplacements, type SuggestPlayerReplacementsOutput } from '@/ai/flows/suggest-player-replacements';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

interface AiSuggestionsProps {
  user: User;
  players: Record<string, Player>;
}

export default function AiSuggestions({ user, players }: AiSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestPlayerReplacementsOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setIsDialogOpen(true);
    try {
      const availablePlayersForAI = { ...players };
      user.lineup.forEach(playerId => {
        delete availablePlayersForAI[playerId];
      });

      const result = await suggestPlayerReplacements({
        teamName: user.teamName,
        currentLineup: user.lineup,
        availablePlayers: availablePlayersForAI,
        teamBudget: user.valuation,
        upcomingMatchDifficulty: 'medium',
      });
      setSuggestions(result);
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        title: "Erro ao buscar sugestões",
        description: "Não foi possível contatar a IA. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
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
            Sugestões da IA
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="text-primary"/>
              Sugestões de Substituição
            </DialogTitle>
            <DialogDescription>
              A nossa IA analisou seu time e o mercado. Aqui estão as recomendações:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {suggestions && suggestions.length > 0 && (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => {
                  const playerOut = players[suggestion.playerToReplaceId];
                  const playerIn = players[suggestion.suggestedReplacementPlayerId];
                  if (!playerOut || !playerIn) return null;

                  return (
                    <Card key={index} className="bg-muted/50 dark:bg-muted/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col items-center text-center w-20">
                            <Image src={playerOut.img} alt={playerOut.name} width={48} height={48} data-ai-hint="player portrait" className="rounded-full border-2 border-red-500"/>
                            <p className="text-xs font-semibold mt-1">{playerOut.name}</p>
                            <p className="text-xs text-red-500">SAI</p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-muted-foreground" />
                          <div className="flex flex-col items-center text-center w-20">
                            <Image src={playerIn.img} alt={playerIn.name} width={48} height={48} data-ai-hint="player portrait" className="rounded-full border-2 border-green-500"/>
                             <p className="text-xs font-semibold mt-1">{playerIn.name}</p>
                             <p className="text-xs text-green-500">ENTRA</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            {!isLoading && suggestions?.length === 0 && (
                 <p className="text-center text-muted-foreground py-10">
                    Nenhuma sugestão encontrada. Seu time parece ótimo!
                </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
