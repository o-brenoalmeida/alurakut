import React from 'react';
import styled from 'styled-components'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <a className="boxLink" href={`https://github.com/&{propriedades.githubUser}`}>
        @{propriedades.githubUser}
      </a>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {
  const user = 'o-brenoalmeida';

  // Index 0 = lista de comunidades sendo salvo em communities - Index 1 - função que serve para monitorar modificações da lista, sendo salvo em setComunnities 
  const [communities, setCommunities] = React.useState([{
    id: '6465465',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  // const communities = ['Alurakut'];
  const listaPessoas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'marcobrunodev',
    'waldeyr',
    'fagundes'
  ];

  return (
    <>
      <AlurakutMenu githubUser={user}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={user} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo(a)
            </h1>

            <OrkutNostalgicIconSet sexy={3} legal={3} confiavel={3} />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCreateCommunity(e) {
              e.preventDefault();
              const dadosForm = new FormData(e.target);

              console.log("Titulo", dadosForm.get('title'));
              console.log("Image", dadosForm.get('image'));

              const comunity = {
                id: new Data().toISOString(),
                title: dadosForm.get('title'),
                image: dadosForm.get('image')
              }

              // operador spread
              // espalhou o conteúdo da lista communities dentro do array communitiesUpdated
              const communitiesUpdated =  [...communities, comunity];
              setCommunities(communitiesUpdated);
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

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Amigos ({listaPessoas.length})
            </h2>
            <ul>
              {listaPessoas.map((item) => {
                return (
                  <li key={item}>
                    <a href={`users/$(item)`} key={item}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box>

            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Comunidades ({communities.length})
              </h2>
              <ul>
                {communities.map((item) => {
                  return (
                    <li key={item.id}>
                      <a href={`users/$(item.title)`} key={item.title}>
                        <img src={item.image} />
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
