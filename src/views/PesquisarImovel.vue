<template>
      <ion-page>
        <ion-content>
            <ion-grid>
              <ion-row>
                  <ion-col class="ion-align-self-start text-align-center">
                    <ion-select style="float: left" v-model="form.intent">
                      <ion-select-option value="sell">Comprar</ion-select-option>
                      <ion-select-option value="rent">Alugar</ion-select-option>
                    </ion-select>
                  </ion-col>
              </ion-row>
            </ion-grid>
            <template v-if="places.length > 0">
                <ion-card v-for="(place, index) of places" :key="index">
                    <ion-card-header>
                        <ion-slides pager="true" :options="slideOpts">
                            <ion-slide style="height: 200px" v-for="(image, index) of place.images" :key="index">
                                <img :src="apiDomain + image.path" width="100%">
                            </ion-slide>
                        </ion-slides>
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
import { IonSelect, modalController, IonPage, IonContent, IonSlides, IonSlide, IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonRow } from '@ionic/vue';
import { logout, getHeader, apiDomain, apiUrl, maskPhone } from './config'
import ModalPlaceDetails from './ModalPlaceDetails.vue';
import axios from 'axios';

export default {
    components: {
        IonSelect, IonSlides, IonSlide, IonCard, IonCardContent, IonCardHeader, IonPage, IonContent, IonCol, IonGrid, IonRow
    },
    data: () => ({
        places: [],
        clearFilter: false,
        apiDomain: apiDomain,
        maskPhone: maskPhone,
        user: null,
        form: {
            intent: "sell",
            condition: "",
            type: "",
            areaMin: "",
            areaMax: "",
            valueMin: 0,
            valueMax: 0,
            rooms: "",
            bathrooms: "",
            vacancies: "",
            suites: ""
        },
        placeDetails: null,
        showModalPlaceDetails: false,
        pagination: {},
        addressTypeText: 'Cidade'
    }),
    methods: {
        navigate (page = 1) {
            const params = {}
            const formKeys = Object.keys(this.form)
            for (const key of formKeys) {
                params[key] = this.form[key]
            }
            params.page = page
            params.city = ""
            params.district = ""
            params.street = ""
            axios({url: apiUrl + 'get-filter-place', method: 'get', params}).then(response => {
              for (const key of formKeys) {
                  if (this.form[key] !== "" && this.form[key] !== 0) {
                      this.clearFilter = true
                  }
              }
              this.places = response.data.data
              window.scrollTo(0, 0)
            })
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
        goTo (path) {
            this.$router.push(path)
        },
        exit () {
          window.localStorage.clear()
          this.$store.dispatch('users/getUser', null)
          this.$router.push('/tabs/login')
        },
        async openModalPlaceDetails (placeDetails) {
            const modal = await modalController.create({
                component: ModalPlaceDetails,
                componentProps: {
                    placeDetails: placeDetails
                }
            })
            modal.present()
        },
        formatValue (valueNumber) {
            const value = parseFloat(valueNumber)
            return value.toLocaleString('pt-br', {minimumFractionDigits: 2})
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
    computed: {
        search () {
            return this.form.intent
        }
    },
    watch: {
        search () {
           this.navigate()
        }
    },
    created () {
        // this.$route.go()
        this.getUser()
        this.navigate()
    }
}
</script>

<style scoped>
</style>
