import { createRouter, createWebHistory } from "vue-router";

import MainView from "@/views/MainView.vue";
import LoginView from "@/views/LoginView.vue";

const router = createRouter (
    {
        history: createWebHistory(),
        routes: [
            {
                path: "/",
                name: "Main",
                component: MainView
            },
            {
                path: "/login",
                name: "Login",
                component: LoginView
            }
        ]
    }
)

export default router;