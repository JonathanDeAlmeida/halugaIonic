<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="top">

        <ion-tab-button tab="pesquisar-imovel" href="/tabs/pesquisar-imovel">
          <img height="40" src="../../public/static/logo-color.svg">
        </ion-tab-button>

        <template v-if="$store.state.users.user">  
          
          <ion-tab-button tab="meus-imoveis" href="/tabs/meus-imoveis">
            <ion-label>Meus Imoveis</ion-label>
          </ion-tab-button>
          
          <ion-tab-button tab="editar-perfil" href="/tabs/editar-perfil">
            <ion-label>Editar Perfil</ion-label>
          </ion-tab-button>
          
          <ion-tab-button @click="exit">
            <ion-label>Sair</ion-label>
          </ion-tab-button>

        </template>

        <template v-else>

          <ion-tab-button tab="login" href="/tabs/login">
            <ion-label>Anúnciar Imóvel</ion-label>
          </ion-tab-button>
        
        </template>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage, IonRouterOutlet } from '@ionic/vue';
import { logout, getHeader, apiUrl } from './config'
import axios from 'axios';

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonPage, IonRouterOutlet },
  data: () => ({
    user: null
  }),
  methods: {
    exit () {
      window.localStorage.clear()
      this.$store.dispatch('users/getUser', null)
      this.$router.push('/tabs/pesquisar-imovel')
    },
    getUser () {
      const userId = window.localStorage.getItem('userId')
      if (userId) {
          const params = {}
          params.user_id = userId
          axios({url: apiUrl + 'get-user', method: 'post', params, headers: getHeader()}).then(response => {
              this.$store.dispatch('users/getUser', response.data)
          }).catch(error => {
              if (error.response.status === 401) {
                  this.$store.dispatch('users/getUser', null)
                  logout()
              }
          })
      }
    }
  },
  created () {
    this.getUser()
  }
}
</script>