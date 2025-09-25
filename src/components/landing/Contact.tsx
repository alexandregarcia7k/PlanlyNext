import { ContactCard } from "@/components/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DefaultDemo() {
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
					<form action="" className="w-full space-y-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" type="text" placeholder="Seu nome" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" name="email" type="email" placeholder="nome@example.com" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="subject">Assunto</Label>
							<Input id="subject" name="subject" type="text" placeholder="Sobre o que você gostaria de falar?" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="message">Message</Label>
							<Textarea id="message" name="message" placeholder="Escreva sua mensagem aqui..." />
						</div>
						<Button className="w-full" type="submit">
							Enviar Mensagem
						</Button>
					</form>
				</ContactCard>
			</div>
		</section>
	);
}
