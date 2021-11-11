<template>
  <ion-page>
    <div v-if="alert.status" :class="'alert-general ' + alert.type">
      <div>
        <span class="pl-1">{{alert.message}}</span>
      </div>
    </div>
    <ion-content>
      <div style="margin: 15px; text-align: center">
        <p style="font-size: 35px; color: #e63946">Editar Perfil</p>
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
        <ion-label position="stacked">Confirmar Senha</ion-label>
        <ion-input type="password" v-model="form.confirmPassword"></ion-input>
      </ion-item>
      <ion-item>
        <ion-button slot="start" @click="formSubmit()">Salvar</ion-button>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem } from '@ionic/vue'
import axios from 'axios'
import { logout, getHeader, apiUrl } from './config'

export default {
    name: 'EditarPerfil',
    components: {
      IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem
    },
    data: () => ({
      user: null,
      alert: {
        status: false,
        type: "",
        message: ""
      },
      form: {
          name: null,
          email: null,
          password: null,
          confirmPassword: null
      }
    }),
    methods: {
        validateForm () {
          if (!this.form.name) {
            return false
          } 
          if (!this.form.email) {
            return false
          }
          if (this.form.password && this.form.password !== this.form.confirmPassword) {
              return false
          }
          if (this.form.confirmPassword && this.form.confirmPassword !== this.form.password) {
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
          this.form.id = window.localStorage.getItem('userId')
          const params = this.form
          axios({url: apiUrl + 'user-edit', method: 'post', params, headers: getHeader()}).then(response => {
            if (response.data.user_enabled) {
              this.showAlert('success', 'Usuário Editado Com Sucesso')
              this.getUserEdit()
            } else {
              this.showAlert('danger', response.data.message)
            }
          }).catch(error => {
            console.log(error)
            if (error.response.status === 401) {
              this.$store.dispatch('users/getUser', null)
              logout()
            }
          })
        },
        exit () {
          window.localStorage.clear()
          this.$store.dispatch('users/getUser', null)
          this.$router.push('/tabs/login')
        },
        goTo (path) {
          this.$router.push(path)
        },
        getUserEdit () {
          const userId = window.localStorage.getItem('userId')
          const params = {}
          params.user_id = userId
          axios({url: apiUrl + 'get-user', method: 'post', params, headers: getHeader()}).then(response => {
            const user = response.data
            this.form = {
              name: user.name,
              email: user.email
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
              this.getUserEdit()
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
      this.form.name = null
      this.form.email = null
      this.form.password = null
      this.form.confirmPassword = null
      this.getUser()
    }
}

</script>

<style scoped>
</style>
