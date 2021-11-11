<template>
    <ion-page>

      <div v-if="alert.status" :class="'alert-general ' + alert.type">
          <div>
            <span class="pl-1">{{alert.message}}</span>
          </div>
      </div>
      
      <ion-content>
        <div style="margin: 15px; text-align: center">
          <p style="font-size: 35px; color: #e63946">Login</p>
        </div>
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input v-model="form.email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Senha</ion-label>
          <ion-input type="password" v-model="form.password"></ion-input>
        </ion-item>
        <ion-item>
          <ion-button slot="end" @click="formSubmit()">Entrar</ion-button>
          <ion-button slot="start" router-link="cadastrar-perfil">Cadastrar</ion-button>
        </ion-item>
      </ion-content>

    </ion-page>
</template>

<script>
import { IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem } from '@ionic/vue'
import { getHeader, apiUrl } from './config'
import axios from 'axios';
export default {
    name: 'Login',
    components: {
      IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem 
    },
    data: () => ({
        form: {
          email: null,
          password: null
        },
        alert: {
          status: false,
          type: "",
          message: ""
        }
    }),
    methods: {
        validateForm () {
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
          const params = this.form
          axios({url: apiUrl + 'login', method: 'post', params}).then(response => {
            if (response.data.user_enabled) {
              window.localStorage.setItem('userId', response.data.userId)
              window.localStorage.setItem('authUser', response.data.authUser)
              this.$router.push('/tabs/meus-imoveis')
            } else {
              this.showAlert('danger', response.data.message)
            }
          })
        },
        goTo (path) {
          this.$router.push(path)
        },
        getUser () {
          const userId = window.localStorage.getItem('userId')
          if (userId) {
            const params = {}
            params.user_id = userId
            axios({url: apiUrl + 'get-user', method: 'post', params, headers: getHeader()}).then(response => {
              this.$store.dispatch('users/getUser', response.data)
              this.$router.push('/tabs/pesquisar-imovel')
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
      this.form.email = null
      this.form.password = null
    }
}

</script>

<style scoped>
</style>
