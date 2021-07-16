import {SiteClient} from 'datocms-client';

export default async function recebedorDeRequest(request, response) {
    if (request.method === 'POST') {
        const TOKEN = '9754c0a6acd3b85344663b8150a360';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "971788", // id do model de Community criado pelo Dato
             ...request.body,
            // title: 'Casdasd',
            // creatorSlug: 'comunidade-de-teste',
            // imageUrl: 'https://github.com/o-brenoalmeida.png',
        })

        console.log('api', request.body);

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET'
    })
}