"use client";

import { ContactCard } from "@/components/ui/kibo-ui/landingpageui/contact-card";
import { MailIcon, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/kibo-ui/landingpageui/input';
import { Button } from '@/components/ui/kibo-ui/landingpageui/button';
import { Label } from '@/components/ui/kibo-ui/landingpageui/label';
import { Textarea } from '@/components/ui/kibo-ui/landingpageui/textarea';
import { sendContactEmail } from "@/server/actions";
import { toast } from 'sonner';
import { useActionState, useState } from 'react';

interface ContactFormState {
	success: boolean;
	error?: string;
}

export default function DefaultDemo() {
	const [isPending, setIsPending] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	
	const [state, formAction] = useActionState(async (prevState: ContactFormState | null, formData: FormData) => {
		setIsPending(true);
		setIsSuccess(false);
		const result = await sendContactEmail(formData);
		
		setIsPending(false);

		if (result.success) {
			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 2000);
			toast.success("Mensagem enviada!", {
				description: "Sua sugestão foi enviada com sucesso. Obrigado!"
			});
		} else {
			toast.error("Erro ao enviar", {
				description: result.error || "Tente novamente em alguns instantes."
			});
		}

		return result;
	}, null);
	return (
		<section id="contact" className="relative flex w-full items-center justify-center px-4 sm:px-8 pb-32">
			<div className="mx-auto max-w-5xl">
				<ContactCard
					title="Faça sua Sugestão"
					description="Se você tem alguma sugestão ou gostaria de entrar em contato, preencha o formulário abaixo. Responderemos o mais breve possível."
					contactInfo={[
						{
							icon: MailIcon,
							label: 'Email',
							value: 'suggestions@planly.space',
						},
						// {
						// 	icon: PhoneIcon,
						// 	label: 'Phone',
						// 	value: '+92 312 1234567',
						// },
						// {
						// 	icon: MapPinIcon,
						// 	label: 'Address',
						// 	value: 'Faisalabad, Pakistan',
						// 	className: 'col-span-2',
						// }
					]}
				>
					<form action={formAction} className="w-full space-y-4">
						{/* Honeypot anti-spam */}
						<input 
							name="website" 
							style={{ display: 'none' }} 
							tabIndex={-1} 
							autoComplete="off" 
						/>
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" type="text" placeholder="Seu nome" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" name="email" type="email" placeholder="nome@example.com" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="subject">Assunto</Label>
							<Input id="subject" name="subject" type="text" placeholder="Sobre o que você gostaria de falar?" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="message">Message</Label>
							<Textarea id="message" name="message" placeholder="Escreva sua mensagem aqui..." required />
						</div>
						<Button className="w-full" type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Enviando...
								</>
							) : isSuccess ? (
								<>
									<Check className="mr-2 h-4 w-4" />
									Enviado!
								</>
							) : (
								"Enviar Mensagem"
							)}
						</Button>
					</form>
				</ContactCard>
			</div>
		</section>
	);
}
