<template>
    <ion-page>
      <div v-if="alert.status" :class="'alert-general ' + alert.type">
        <div>
          <span class="pl-1">{{alert.message}}</span>
        </div>
      </div>
      <ion-content>
        <div style="margin: 15px; text-align: center">
          <p style="font-size: 35px; color: #e63946">Cadastro</p>
        </div>
        <ion-item>
          <ion-label position="stacked">Nome</ion-label>
          <ion-input v-model="form.name"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input v-model="form.email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Senha</ion-label>
          <ion-input type="password" v-model="form.password"></ion-input>
        </ion-item>
        <ion-item>
          <ion-button v-if="wait" slot="end">Aguarde...</ion-button>
          <ion-button v-else slot="end" @click="formSubmit()">Cadastrar</ion-button>
          <ion-button slot="start" router-link="login">Login</ion-button>
        </ion-item>
      </ion-content>
    </ion-page>
</template>
<script>
import { IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem } from '@ionic/vue'
import axios from 'axios';
import { getHeader, apiUrl } from './config'

export default {
    name: 'CadastrarPerfil',
    components: {
      IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem 
    },
    data: () => ({
      form: {
        name: null,
        email: null,
        password: null
      },
      user: null,
      alert: {
        status: false,
        type: "",
        message: ""
      },
      wait: false
    }),
    methods: {
      validateForm () {
        if (!this.form.name) {
          return false
        } 
        if (!this.form.email) {
          return false
        }
        if (!this.form.password) {
          return false
        }
        return true
      },
      showAlert (type, message) {
        this.alert.status = true
        this.alert.type = type
        this.alert.message = message
        setTimeout(() => {
          this.alert.status = false
          this.alert.type = ''
          this.alert.message = ''
        }, 7000)
      },
      formSubmit () {
        if (!this.validateForm()) {
          this.showAlert('danger', 'Insira os dados corretamente')
          return false
        }
        this.wait = true
        axios({url: apiUrl + 'user-create', method: 'post', data: this.form}).then(response => {
          if (response.data.user_enabled) {
            window.localStorage.setItem('userId', response.data.userId)
            window.localStorage.setItem('authUser', response.data.authUser)
            setTimeout(() => {
              this.$router.push('/tabs/meus-imoveis')
              this.wait = false
            }, 10000)
          } else {
            this.showAlert('danger', response.data.message)
          }
        })
      },
      getUser () {
        const userId = window.localStorage.getItem('userId')
        if (userId) {
          const params = {}
          params.user_id = userId
          axios({url: apiUrl + 'get-user', method: 'post', params, headers: getHeader()}).then(response => {
            this.$store.dispatch('users/getUser', response.data)
            this.$router.push('/tabs/meus-imoveis')
          }).catch(error => {
            console.log(error)
            this.$store.dispatch('users/getUser', null)
            window.localStorage.clear()
          })
        }
      }
    },
    created () {
      this.getUser()
      this.form.name = null
      this.form.email = null
      this.password = null
    }
}

</script>

<style scoped>
</style>
