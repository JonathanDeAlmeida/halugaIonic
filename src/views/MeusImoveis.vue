<template>
      <ion-page>
        <ion-content>
        <!-- <Menu/> -->
            <template v-if="places.length > 0">
                <ion-card v-for="(place, index) of places" :key="index">
                    <ion-card-header>
                        <template v-if="place.images.length > 0">
                            <ion-slides pager="true" :options="slideOpts">
                                <ion-slide style="height: 200px" v-for="(image, index) of place.images" :key="index">
                                    <img :src="domain + image.path" width="100%">
                                </ion-slide>
                            </ion-slides>
                        </template>
                        <template v-else>
                            <div>
                                <div class="text-align-center no-image">
                                    <p> Sem Imagem</p>
                                </div>
                            </div>
                        </template>
                    </ion-card-header>
                    <ion-card-content>

                        <div class="text-align-center">
                            <template v-if="place.intent === 'rent'">
                                <p class="place-rent-value">R$ {{ formatValue(place.rent_value) }} 
                                <span class="fs-15">/ mês</span>
                                </p>
                            </template>
                            <template v-else>
                                <p class="place-rent-value">R$ {{ formatValue(place.sale_value) }} </p>
                            </template>
                            <br>
                        
                        
                            <p v-if="place.condominium_value > 0" class="d-inline place-secondary-value">Condomínio R$ {{ formatValue(place.condominium_value) }}</p> 

                            <span v-if="place.condominium_value > 0 && place.iptu > 0"> - </span> 

                            <p v-if="place.iptu > 0" class="d-inline place-secondary-value">IPTU R$ {{ formatValue(place.iptu) }}</p>
                                                
                            <template v-if="place.description">
                                <p style="margin-top: 15px" class="place-description-search" v-html="limitText(place.description, 42)"></p>...
                            </template>
                                                
                            <p v-html="textAddress(place, 50)" class="place-address-responsible" :class="place.description ? '' : 'mt-5'"></p>
                        
                        </div>

                        <ion-grid>
                            <ion-row>
                                <ion-col v-if="place.area" class="text-align-center">
                                    <span class="place-number">{{place.area}}</span>
                                    <span class="place-space">Área (m²)</span>
                                </ion-col>
                                <ion-col v-if="place.rooms" class="text-align-center">
                                    <span class="place-number">{{place.rooms}}</span>
                                    <span class="place-space">Quarto</span>
                                </ion-col>
                                <ion-col v-if="place.suites" class="text-align-center">
                                    <span class="place-number">{{place.suites}}</span>
                                    <span class="place-space">Suíte</span>
                                </ion-col>
                                <ion-col v-if="place.bathrooms" class="text-align-center">
                                    <span class="place-number">{{place.bathrooms}}</span>
                                    <span class="place-space">Banh.</span>
                                </ion-col>
                                <ion-col v-if="place.vacancies" class="text-align-center">
                                    <span class="place-number">{{place.vacancies}}</span>
                                    <span class="place-space">Vaga</span>
                                </ion-col>
                            </ion-row>
                        </ion-grid>

                        <div class="text-align-center">
                            <div class="width-place-button">
                                <div v-if="place.active">
                                    <button class="btn-general main" @click.prevent="openModalPlaceDetails(place)">
                                        Ver Mais
                                    </button>
                                </div>
                            </div>
                        </div>
                        <br>
                        
                        <div class="col-md-12 mt-2" style="padding: 0">
                            <div class="float-left">
                                <span v-if="place.active" style="color: white; cursor: pointer" class="badge bg-success">Anúncio Ativo</span>
                                <span v-else style="color: white; cursor: pointer" class="badge bg-danger" title="Para o anúncio estar ativo, deve ter no mínimo 5 fotos">
                                    Anúncio Inativo
                                </span>
                            </div>
                        </div>
                        

                    </ion-card-content>
                </ion-card>
            </template>
            <template v-else>
              <div class="text-align-center">
                  <h3>Nenhum imóvel encontrado</h3>
              </div>
            </template>
        </ion-content>
      </ion-page>

</template>

<script>
import { getHeader, logout, apiUrl, apiDomain, maskPhone } from './config'
import { modalController, IonSlides, IonSlide, IonCard, IonCardContent, IonCardHeader, IonPage, IonContent } from '@ionic/vue';
import axios from 'axios'
import ModalPlaceDetails from './ModalPlaceDetails.vue'

export default {
    name: 'MeusImoveis',
    components: {
      IonSlides, IonSlide, IonCard, IonCardContent, IonCardHeader, IonPage, IonContent
    },
    data: () => ({
        slideOpts: {initialSlide: 1, speed: 400},
        domain: apiDomain,
        places: [],
        user: null,
        placeDetails: null,
        placeDeleteId: null,
        maskPhone: maskPhone,
        load: false
    }),
    methods: {
        async openModalPlaceDetails (placeDetails) {
            const modal = await modalController.create({
                component: ModalPlaceDetails,
                componentProps: {
                    placeDetails: placeDetails
                }
            })
            modal.present()
        },
        limitText (value, limit) {
            if (value) {
                return (value.length > limit ? value.substr(0, limit) : value)
            }
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
        formatValue (valueNumber) {
            const value = parseFloat(valueNumber)
            return value.toLocaleString('pt-br', {minimumFractionDigits: 2})
        },
        goTo (path) {
            this.$router.push(path)
        },
        navigate (page = 1) {
            const userId = window.localStorage.getItem('userId')
            const params = {
                user_id: userId,
                page: page
            }
            axios({url: apiUrl + 'get-places', method: 'get', params, headers: getHeader()}).then(response => {
                this.places = response.data.data
                // this.pagination = response.body
                window.scrollTo(0, 0)
                // this.load = true
            })
        },
        exit () {
          window.localStorage.clear()
          this.$store.dispatch('users/getUser', null)
          this.$router.push('/tabs/login')
        },
        getUser () {
            const userId = window.localStorage.getItem('userId')
            console.log(userId)
            if (userId) {
                const params = {}
                params.user_id = userId
                axios({url: apiUrl + 'get-user', method: 'post', params, headers: getHeader()}).then(response => {
                    this.$store.dispatch('users/getUser', response.data)
                    this.navigate()
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

<style scoped>
</style>
