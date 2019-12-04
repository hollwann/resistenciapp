<template>
  <v-row justify="center">
    <v-col cols="12" sm="6" offset-sm="3">
      <v-card>
        <v-toolbar flat color="secondary" dark>
          <v-spacer></v-spacer>
          <v-toolbar-title style="font-size:20px;font-weight:500"
            >Crear Ticket</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-col>
          <form @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="1.5">
                <v-text-field
                  v-model="type"
                  :error-messages="typeErrors()"
                  label="Tipo de boleto:"
                  required
                  @input="$v.type.$touch()"
                  @blur="$v.type.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" offset-sm="1.5">
                <v-text-field
                  v-model="description"
                  :error-messages="descriptionErrors()"
                  label="Descripción del boleto:"
                  required
                  counter
                  @input="$v.description.$touch()"
                  @blur="$v.description.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" offset-sm="1.5">
                <v-text-field
                  v-model="price"
                  :error-messages="inputValueNullErrors('price')"
                  label="Precio de venta al público:"
                  required
                  @input="$v.price.$touch()"
                  @blur="$v.price.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" offset-sm="1.5">
                <v-text-field
                  v-model="valuePro"
                  label="Comisión a promotor: Proximamente"
                  disabled
                  required
                  @input="$v.valuePro.$touch()"
                  @blur="$v.valuePro.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" offset-sm="1.5">
                <v-text-field
                  v-model="quantity"
                  :error-messages="inputValueNullErrors('quantity')"
                  label="Cantidad de boletos disponibles"
                  required
                  @input="$v.quantity.$touch()"
                  @blur="$v.quantity.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-col align="center">
              <v-btn class="mr-4" type="submit" color="secondary">Crear</v-btn>
            </v-col>
          </form>
        </v-col>
      </v-card>
      <Loader :load="loader"></Loader>
      <AlertDialog
        :message="messageAlert"
        :dialog="alert"
        @hideDialog="() => ((alert = false), (messageAlert = ''))"
      ></AlertDialog>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minValue } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],

  validations: {
    type: { required, maxLength: maxLength(15) },
    price: { required, minValue: minValue(0) },
    // valuePro: { required, minValue: minValue(0) },
    quantity: { required, minValue: minValue(0) },
    description: { required, maxLength: maxLength(30) }
  },
  data: () => ({
    messageAlert: '',
    alert: false,
    loader: false,
    type: '',
    price: '',
    valuePro: '',
    quantity: '',
    description: ''
  }),
  computed: {
    formAnyError() {
      return this.$v.$anyError
    }
  },
  methods: {
    inputValueNullErrors(inputName) {
      const errors = []
      if (!this.$v[inputName].$dirty) return errors
      !this.$v[inputName].required && errors.push('valor es requerido.')
      if (isNaN(this[inputName])) errors.push('valor no valido.')
      else {
        if (this[inputName] < 0) errors.push('valor no valido.')
      }
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.description.$dirty) return errors
      !this.$v.description.maxLength &&
        errors.push('La descripción no debe exceder 30 caracteres.')
      !this.$v.description.required &&
        errors.push('Descripción corta es requerida.')
      return errors
    },
    typeErrors() {
      const errors = []
      if (!this.$v.type.$dirty) return errors
      !this.$v.type.maxLength &&
        errors.push('El tipo de boleta no debe exceder 15 caracteres.')
      !this.$v.type.required && errors.push('El tipo de boleta es requerido.')
      return errors
    },

    submitForm() {
      this.$v.$touch()
      if (!this.formAnyError) {
        this.loader = true
        let data = {
          type: this.type,
          price: this.price,
          quantity: this.quantity,
          description: this.description,
          eventId: this.eventId,
          valuePro: this.valuePro
        }
        console.log(data)
      }
    }
  }
}
</script>

<style></style>
