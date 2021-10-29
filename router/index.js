const routes = [
  { path: "/", name: "music", component: AudioPlayerGroup },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

app.use(router)
