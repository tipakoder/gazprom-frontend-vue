import { createRouter, createWebHistory } from "vue-router";

import MainView from "@/views/MainView.vue";

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
                component: {template: "Mama"}
            }
        ]
    }
)

export default router;