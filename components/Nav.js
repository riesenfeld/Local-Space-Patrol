app.component("navbar", {
  props: [],
  template:
    /*html*/
    `
    <nav>
        <router-link :to="{name: 'music'}" class="nav-link">Home</router-link>
        <router-link :to="{name: ''}" class="nav-link">Events</router-link>
        <router-link :to="{name: ''}" class="nav-link">Art</router-link>
        <router-link :to="{name: ''}" class="nav-link">About</router-link>
      </nav>
    `,
})
