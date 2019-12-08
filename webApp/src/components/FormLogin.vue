<template>
  <v-dialog v-model="dialog" @click:outside="hideDialog()" max-width="600px">
    <v-card
      color="#333345"
      dark
      max-width="90vw"
      max-height="80vh"
      v-if="!registered"
    >
      <p style="padding:20px;text-align:center">
        <b>IMPORTANTE:</b>La información que vas a suministrar es completamente
        voluntaria y no será tratada.
      </p>
      <v-col>
        <form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="10" offset="1">
              <v-text-field
                v-model="name"
                :error-messages="nameErrors()"
                label="Nombre:"
                required
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
                :disabled="registered"
              ></v-text-field>
              <v-text-field
                v-model="description"
                :error-messages="descriptionErrors()"
                label="Descripción breve del lugar:"
                required
                counter
                @input="$v.description.$touch()"
                @blur="$v.description.$touch()"
                :disabled="registered"
              ></v-text-field>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors()"
                label="Correo Electronico"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                :disabled="registered"
              ></v-text-field>
              <v-text-field
                v-model="phone"
                :error-messages="phoneErrors()"
                :counter="10"
                label="Celular"
                required
                @input="$v.phone.$touch()"
                @blur="$v.phone.$touch()"
                :disabled="registered"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="5">
              <v-btn color="red" @click="hideDialog()">Cancelar</v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn type="submit" color="blue">Registrarme</v-btn>
            </v-col>
          </v-row>
        </form>
      </v-col>
    </v-card>
    <AlertDialog
      :message="messageAlert"
      :dialog="alert"
      @hideDialog="() => ((alert = false), (messageAlert = ''))"
    ></AlertDialog>
    <v-card color="#333345" width="100%" v-if="registered">
      <v-row justify="center">
        <v-col cols="6" align="center">
          <v-btn
            x-large
            fab
            color="red"
            @click="hideDialog()"
            class="font-weight-light white--text"
            >Cancelar</v-btn
          >
        </v-col>
        <v-col cols="6" align="center">
          <v-btn
            x-large
            fab
            color="green"
            @click="postComment()"
            class="font-weight-light white--text"
            >Confirmar</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  maxLength,
  email,
  minLength,
  minValue
} from 'vuelidate/lib/validators'
import AlertDialog from '@/components/AlertDialog.vue'
import { db, auth } from '@/firebaseConfig.js'
export default {
  mixins: [validationMixin],
  components: {
    AlertDialog
  },
  validations: {
    name: { required, maxLength: maxLength(25) },
    description: { required, maxLength: maxLength(30) },
    email: { required, email },
    phone: {
      required,
      maxLength: maxLength(10),
      minLength: minLength(10),
      minValue: minValue(0)
    }
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    messageAlert: '',
    alert: false,
    name: '',
    description: '',
    email: '',
    phone: null,
    registered: false
  }),
  computed: {
    formAnyError() {
      return this.$v.$anyError
    }
  },
  methods: {
    descriptionErrors() {
      const errors = []
      if (!this.$v.description.$dirty) return errors
      !this.$v.description.maxLength &&
        errors.push('La descripción no debe exceder 30 caracteres.')
      !this.$v.description.required &&
        errors.push('Descripción corta es requerida para solicitar ayuda.')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength &&
        errors.push('El nombre  no debe exceder 15 caracteres.')
      !this.$v.name.required &&
        errors.push('El nombre es requerido para solicitar ayuda.')
      return errors
    },
    emailErrors() {
      const errors = []
      this.email.replace(' ', '')
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email &&
        errors.push('El correo electronico debe ser valido.')
      !this.$v.email.required && errors.push('Correo electronico es requerido.')
      return errors
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.maxLength && errors.push('Celular no valido')
      !this.$v.phone.minLength && errors.push('Celular no valido')
      !this.$v.phone.required && errors.push('Celular es requerido.')
      isNaN(this.phone) && errors.push('Celular no valido')
      return errors
    },

    submitForm() {
      this.$v.$touch()
      if (!this.formAnyError) {
        let data = {
          name: this.name,
          description: this.description,
          email: this.email,
          phone: this.phone
        }
        this.registered = true
        this.hideDialog()
        console.log(data)
      }
    },
    hideDialog() {
      this.$emit('hide-dialog-help')
    },

    postComment() {
      let message =
        'SE SOLICITA AYUDA PARA ' +
        this.name +
        ', DESCRIPCION DEL LUGAR: ' +
        this.description +
        ', CORREO ELECTRÓNICO: ' +
        this.email +
        ',CELULAR: ' +
        this.phone +
        '.'
      db.collection('messages').add({
        usersVotes: [auth.currentUser.uid],
        message: message,
        points: 1,
        state: 'help',
        date: new Date()
      })
      this.hideDialog()
    }
  }
}
</script>

<style></style>
