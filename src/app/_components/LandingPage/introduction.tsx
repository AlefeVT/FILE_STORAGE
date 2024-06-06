import Link from "next/link"

export function LandingPageIntroduction() {
    return (
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
            <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
                <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16 mb-20">
                    <div>
                        <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                            Controle Financeiro Pessoal Simplificado
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            Gerencie suas finanças com facilidade e tenha uma visão clara do seu dinheiro.
                        </p>
                        <div className="space-x-4 mt-6">
                            <Link
                                href="/auth/register"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                prefetch={false}
                            >
                                Cadastre-se
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-start space-y-4">
                        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                            Controle Financeiro Pessoal
                        </div>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            Tenha uma visão clara de suas finanças e tome melhores decisões sobre seu dinheiro.
                        </p>
                    </div>
                </div>
                {/* <img
                    src="/placeholder.svg"
                    alt="Hero"
                    className="mx-auto aspect-[3/1] overflow-hidden rounded-t-xl object-cover"
                /> */}
            </div>
        </section>
    )
}