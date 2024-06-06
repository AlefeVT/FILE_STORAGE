import { RefObject, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { sendMessage } from "../../services/actions";
import { toast } from "@/components/ui/use-toast";
import { useFormik } from "formik";

interface LandingPageContactProps {
    initialRef: RefObject<HTMLDivElement>;
}

interface FormValues {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export function LandingPageContact({ initialRef }: LandingPageContactProps) {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            message: ''
        },
        onSubmit: async (values: FormValues) => {
            try {
                await sendMessage(values);
                toast({
                    title: 'Mensagem enviada',
                    description: 'Sua mensagem foi enviada com sucesso!',
                });
                formik.resetForm();
            } catch (error) {
                toast({
                    title: 'Erro',
                    description: 'Falha ao enviar a mensagem. Por favor, tente novamente mais tarde.',
                });
            }
        },
        validate: (values: FormValues) => {
            const errors: { [key: string]: string } = {};
            if (!values.name) {
                errors.name = 'Campo nome obrigatório';
            }
            if (!values.email) {
                errors.email = 'Campo email obrigatório';
            } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                errors.email = 'Formato de e-mail inválido';
            }
            if (!values.message) {
                errors.message = 'Campo mensagem obrigatório';
            }
            return errors;
        }
    });

    const handleScrollToStart = () => {
        if (initialRef.current) {
            initialRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const phone = event.target.value.replace(/\D/g, '');
        const maskedPhone = phone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4}).*/, '($1) $2 $3-$4');
        formik.setFieldValue('phone', maskedPhone);
    };

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-2">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                            Transforme sua presença online
                        </h1>
                        <p className="text-gray-500 md:text-xl lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Oferecemos soluções completas de desenvolvimento web e marketing digital para impulsionar o seu negócio.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <span
                                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
                            >
                                Mande sua mensagem
                                <ArrowRightIcon className="h-4 w-4" />
                            </span>
                        </div>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Entre em contato</CardTitle>
                                <CardDescription>Preencha o formulário abaixo e entraremos em contato.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nome *</Label>
                                                <Input id="name" placeholder="Digite seu nome" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {formik.touched.name && formik.errors.name ? <div className="text-red-500">{formik.errors.name}</div> : null}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input id="email" type="email" placeholder="Digite seu email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefone</Label>
                                            <Input id="phone" placeholder="Digite seu telefone" name="phone" value={formik.values.phone} onChange={handlePhoneChange} onBlur={formik.handleBlur} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Mensagem *</Label>
                                            <Textarea id="message" placeholder="Digite sua mensagem" className="min-h-[120px]" name="message" value={formik.values.message} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.touched.message && formik.errors.message ? <div className="text-red-500">{formik.errors.message}</div> : null}
                                        </div>
                                    </div>
                                    <CardFooter>
                                        <Button type="submit" className="w-full mt-10">
                                            Enviar Mensagem
                                        </Button>
                                    </CardFooter>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <button
                onClick={handleScrollToStart}
                className="fixed bottom-8 right-8 p-3 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition duration-300"
                aria-label="Ir para o início"
            >
                <ArrowUpIcon className="h-6 w-6" />
            </button>
        </section>
    )
}
