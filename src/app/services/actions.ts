export async function sendMessage(formData: any) {
    const messageData = {
        embeds: [
            {
                title: 'Mensagem de Contato',
                color: 0x4983f5,
                fields: [
                    {
                        name: 'Nome',
                        value: formData.name,
                        inline: true,
                    },
                    {
                        name: 'Email',
                        value: formData.email,
                        inline: true,
                    },
                    {
                        name: 'Telefone',
                        value: formData.phone,
                        inline: true,
                    },
                    {
                        name: 'Mensagem',
                        value: formData.message,
                        inline: false,
                    },
                ],
            },
        ]
    };

    const discord = process.env.NEXT_PUBLIC_WEBHOOK_URL || ''

    try {
        const response = await fetch(discord, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        if (response.ok) {
            console.log('Mensagem enviada com sucesso!');
        } else {
            console.error('Falha ao enviar mensagem.');
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

export function scrollToStart(initialRef: React.RefObject<HTMLDivElement>) {
    if (initialRef.current) {
        initialRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
