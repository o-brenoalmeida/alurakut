import React from 'react';
import nookies from "nookies";
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations';


//bebido7171@ovooovo.com
function ProfileSidebar(propriedades) {
    return (
        <Box as="aside">
            <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}/>
            <hr/>

            <a className="boxLink" href={`https://github.com/&{propriedades.githubUser}`}>
                @{propriedades.githubUser}
            </a>
            <hr/>

            <AlurakutProfileSidebarMenuDefault/>
        </Box>
    )
}

function ProfileRelationsBox(props) {
    return (
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                {props.title} ({props.items.length})
            </h2>
            <ul>

                {props.items.map((item) => {
                    return (
                        <li key={item.id}>
                            <a href={item.html_url}>
                                <img src={item.avatar_url}/>
                                <span>{item.login}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </ProfileRelationsBoxWrapper>
    )
}

export default function Home(props) {
    const user = props.githubUser;

    // Index 0 = lista de comunidades sendo salvo em communities - Index 1 - função que serve para monitorar modificações da lista, sendo salvo em setComunnities
    const [communities, setCommunities] = React.useState([{}]);

    const [following, setFollowing] = React.useState([]);
    React.useEffect(function () {

        fetch('https://api.github.com/users/' + user + '/following')
            .then(function (serverResponse) {
                return serverResponse.json();
            })
            .then(function (fullResponse) {
                setFollowing(fullResponse);
            })
    }, [])

    const [followers, setFollowers] = React.useState([]);
    React.useEffect(function () {
        fetch('https://api.github.com/users/' + user + '/followers')
            .then(function (serverResponse) {
                return serverResponse.json();
            })
            .then(function (fullResponse) {
                setFollowers(fullResponse);
            })

        // API GraphQL
        fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Authorization': 'c24d4379d799a1f1f9c662e02b18e1',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                "query": `query {
                          allCommunities {
                            id
                            title
                            imageUrl
                            creatorSlug
                          }
                    }`
            })
        })
            .then((res) => res.json())
            .then((fullResponse) => {
                const communitiesFromDato = fullResponse.data.allCommunities;
                console.log(communitiesFromDato)
                setCommunities(communitiesFromDato)
            })
    }, [])

    return (
        <>
            <AlurakutMenu githubUser={user}/>
            <MainGrid>
                <div className="profileArea" style={{gridArea: 'profileArea'}}>
                    <ProfileSidebar githubUser={user}/>
                </div>

                <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
                    <Box>
                        <h1 className="title">
                            Bem-vindo(a)
                        </h1>

                        <OrkutNostalgicIconSet sexy={3} legal={3} confiavel={3}/>
                    </Box>
                    <Box>
                        <h2 className="subTitle">O que você deseja fazer?</h2>
                        <form onSubmit={function handleCreateCommunity(e) {
                            e.preventDefault();
                            const dadosForm = new FormData(e.target);

                            console.log("Titulo", dadosForm.get('title'));
                            console.log("Image", dadosForm.get('image'));

                            const community = {
                                title: dadosForm.get('title'),
                                imageUrl: dadosForm.get('image'),
                                creatorSlug: user,
                            }

                            fetch('/api/comunidades', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(community)
                            })
                                .then(async (response) => {
                                    const dados = await response.json();
                                    console.log(dados.registroCriado);
                                    const community = dados.registroCriado;
                                    // operador spread
                                    // espalhou o conteúdo da lista communities dentro do array communitiesUpdated
                                    const communitiesUpdated = [...communities, community];
                                    setCommunities(communitiesUpdated);
                                })


                        }}>
                            <div>
                                <input
                                    placeholder="Qual vai ser o nome da comunidade?"
                                    name="title"
                                    aria-label="Qual vai ser o nome da comunidade?"
                                    type="text"
                                />
                            </div>
                            <div>
                                <input
                                    placeholder="Coloque uma URL para usarmos de capa"
                                    name="image"
                                    aria-label="Coloque uma URL para usarmos de capa"
                                />
                            </div>

                            <button>
                                Criar comunidade
                            </button>
                        </form>
                    </Box>
                </div>

                <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
                    <Box>
                        <ProfileRelationsBox title="Seguidores" items={followers}/>
                    </Box>

                    <Box>
                        <ProfileRelationsBox title="Seguindo" items={following}/>
                    </Box>

                    <Box>
                        <ProfileRelationsBoxWrapper>
                            <h2 className="smallTitle">
                                Comunidades ({communities.length})
                            </h2>
                            <ul>
                                {communities.map((item) => {
                                    return (
                                        <li key={item.id}>
                                            <a href={`users/$(item.id)`}>
                                                <img src={item.imageUrl}/>
                                                <span>{item.title}</span>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </ProfileRelationsBoxWrapper>
                    </Box>
                </div>
            </MainGrid>
        </>
    )
}

//Roda somente no servidor
export async function getServerSideProps(context) {
    const cookies = nookies.get(context)
    const token = cookies.USER_TOKEN


    const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
        headers: {
            Authorization: token
        }
    })
        .then((resposta) => resposta.json())

    if (!isAuthenticated) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    const {githubUser} = jwt.decode(token)
    return {
        props: {
            githubUser
        }
    }
}