import { AiOutlineCloudUpload, AiOutlineFileSearch } from "react-icons/ai";
import { BsFillShieldLockFill, BsFillPeopleFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdSync } from "react-icons/md";

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
                            Tudo que você precisa para armazenar e compartilhar seus arquivos
                        </h2>
                        <p className="flex justify-center mx-auto max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Nosso serviço de armazenamento de arquivos oferece uma variedade de recursos para te ajudar a gerenciar seus documentos de forma eficiente.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                    <div className="grid gap-1">
                        <AiOutlineCloudUpload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Upload e Download Rápido</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Carregue e baixe seus arquivos com rapidez e segurança.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <AiOutlineFileSearch className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Pesquisa Avançada</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Encontre rapidamente os arquivos que você precisa com nossa pesquisa avançada.
                        </p>
                    </div>
            
                    <div className="grid gap-1">
                        <BsFillShieldLockFill className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        <h3 className="text-lg font-bold">Segurança e Privacidade</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Seus arquivos são protegidos com criptografia de ponta.
                        </p>
                    </div>
                   
                </div>
            </div>
        </section>
    )
}
