<template>
    <div class="login_container">
        <form @submit="submit">
            <h2>Авторизация</h2>
            <input 
                type="text" 
                placeholder="Логин" 
                v-model="login"
                :class="{
                    empty: login === ''
                }"
            >
            <input 
                type="password" 
                placeholder="Пароль" 
                v-model="password"
                :class="{
                    empty: password === ''
                }"
            >
            <button class="blue">Войти</button>
        </form>
    </div>    
</template>

<script>
    import Api from "../api";

    export default {
        name: "LoginView",

        data () {
            return {
                login: "",
                password: ""
            }
        },

        methods: {
            submit (e) {
                e.preventDefault();
                Api.account.login (this.login, this.password).then(({token, expiresIn}) => {
                    localStorage.setItem("token", token);
                    localStorage.setItem("expiresIn", expiresIn);

                    this.$router.push({path: "/"});
                });
            }
        }
    }
</script>