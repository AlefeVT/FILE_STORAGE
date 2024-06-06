import { BarChartIcon, CalendarIcon } from "@radix-ui/react-icons"
import { LuPiggyBank } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineFileSync } from "react-icons/ai";
import { LuShieldCheck } from "react-icons/lu";

export function LandingPageAbout() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container space-y-12 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                            Recursos e Funcionalidades
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            Tudo que você precisa para controlar suas finanças
                        </h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Nosso sistema de controle financeiro pessoal oferece uma variedade de recursos para te ajudar a
                            gerenciar seu dinheiro de forma eficiente.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                    <div className="grid gap-1">
                        <CalendarIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Controle de Receitas e Despesas</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Registre suas receitas e despesas de forma fácil e intuitiva.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <BarChartIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Relatórios e Gráficos</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Visualize seus dados financeiros em gráficos e relatórios personalizados.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <LuPiggyBank className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Metas de Poupança</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Defina metas de poupança e acompanhe seu progresso.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <IoMdNotificationsOutline className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Alertas e Notificações</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receba alertas sobre gastos, prazos de pagamento e metas atingidas.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <AiOutlineFileSync className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Sincronização Automática</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sincronize suas contas bancárias e cartões de crédito para um registro automático de transações.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <LuShieldCheck className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Segurança e Privacidade</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Seus dados financeiros são protegidos com criptografia e armazenados de forma segura.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}