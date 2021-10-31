<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalhes</ion-title>
        <ion-button class="ion-padding-end" slot="end" @click="closeModal">Fechar</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item><strong class="mr-2">Anunciante: </strong> {{placeDetails.responsible_name}}</ion-item>
        <ion-item><strong class="mr-2">Contato: </strong> {{maskPhone(placeDetails.phone)}}</ion-item>
        <ion-item><strong class="mr-2">Endereço: </strong> <span v-html="textAddress(placeDetails, 1000)"></span></ion-item>
        <ion-item><strong class="mr-2">Descrição: </strong> {{placeDetails.description}}</ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonPage, IonHeader, IonTitle, IonContent, IonToolbar, IonButton, modalController } from '@ionic/vue'
import { maskPhone } from './config'

export default {
  name: 'ModalPlaceDetails',
  props: ['placeDetails'],
  data: () => ({
    maskPhone: maskPhone
  }),
  methods: {
    closeModal () {
      modalController.dismiss()
    },
    textAddress (place, limit) {
      let address = ''
      if (place.street) {
        address = place.street + ', ' + 'Bairro ' + place.district + ', ' + place.city
      } else {
        address = 'Bairro ' + place.district + ', ' + place.city
      }
      return (address.length > limit ? address.substr(0, limit) + '...' : address)
    },
  },
  components: {
    IonPage,
    IonHeader, 
    IonTitle, 
    IonContent,
    IonToolbar,
    IonButton
  }
}
</script> 