<template>
    <v-app id="auth">
        <v-main>
         <v-container fluid fill-height>
          <v-layout align-center justify-center>
           <v-flex xs12 sm8 md4>
            <v-card
                class="mx-auto"
                max-width="450"
                outlined
                style="padding:20px"
                elevation="5"
              >
               <v-card-title class="justify-center primary--text" style="font-size:2rem; margin-bottom:10px;">
                I-Tech
               </v-card-title>

               <v-card-text>
                <v-form
                ref="form"
                >
                      <v-text-field
                        label="Username"
                        dense
                        outlined
                        required
                        v-model="username"
                        :rules="usernameRules"
                        id="auth_username"
                      ></v-text-field>
                      <v-text-field
                        label="Password"
                        outlined
                        v-model="password"
                        type="password"
                        dense
                        :rules="passwordRules"
                        required
                         id="auth_password"
                      ></v-text-field>
                </v-form>

               </v-card-text>
                <v-card-subtitle class="error--text">
                  {{this.msgError}}
                </v-card-subtitle>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="primary"
                    @click="onClickLogin"
                    block
                    id="auth_login_button"
                    class="button"
                    :disabled="isRequested"
                  >
                    Login
                  </v-btn>
                </v-card-actions>
              </v-card>
           </v-flex>
          </v-layout>
         </v-container>
        </v-main>
    </v-app>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
export default {
  layout:'guest',
  name: 'IndexPage',
  data(){
    return{
      valid: true,
      username:'',
      msgError:'',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password:'',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      isRequested:false
    }
  },
  created(){

  },
  mounted(){
    // call api

  },
  destroyed(){
      ///

  },
  watch:{
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn","accessToken"]),
  },
  methods: {
    async onClickLogin(){
      if(this.$refs.form.validate()){
          this.isRequested = true;
          this.msgError = ''
          const isSuccess = await this.login({
            username: this.username,
            password: this.password
          });
          if(isSuccess){
             return this.$router.push({ path: "/paymentreceive" });
          }
          /// show message error
          this.msgError = 'Login Failed Username or Password invalid !!'
          this.isRequested = false;
          return;
      }
    },
    ...mapActions("auth", ["login"]),
  },
}
</script>

