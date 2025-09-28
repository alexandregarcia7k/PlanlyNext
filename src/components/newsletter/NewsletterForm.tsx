"use client";

import { subscribeNewsletter } from '@/server/newsletter/actions';
import { Input } from '@/components/ui/kibo-ui/landingpageui/input';
import { Button } from '@/components/ui/kibo-ui/landingpageui/button';
import { toast } from 'sonner';
import { useActionState, useState } from 'react';
import { Loader2, Check } from 'lucide-react';

interface NewsletterFormState {
  success: boolean;
  error?: string;
}

export function NewsletterForm() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [state, formAction] = useActionState(async (prevState: NewsletterFormState | null, formData: FormData) => {
    setIsPending(true);
    setIsSuccess(false);
    
    const result = await subscribeNewsletter(formData);
    
    setIsPending(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      toast.success("Inscrito na newsletter!", {
        description: "Você receberá nossas novidades em breve."
      });
    } else {
      toast.error("Erro ao inscrever", {
        description: result.error || "Tente novamente."
      });
    }

    return result;
  }, null);

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <Input 
        name="email" 
        type="email" 
        placeholder="seu@email.com" 
        required 
        className="flex-1"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending || isSuccess} className="whitespace-nowrap">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Inscrevendo...
          </>
        ) : isSuccess ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Inscrito!
          </>
        ) : (
          "Inscrever"
        )}
      </Button>
    </form>
  );
}