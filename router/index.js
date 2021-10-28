const routes = [{ path: "/", name: "music", component: AudioPlayerGroup }]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

app.use(router)
