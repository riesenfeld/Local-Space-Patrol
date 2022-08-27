<template>
  <footer>
    <a
      class="footer-link email"
      href="mailto:localspacepatrolbooking@gmail.com"
    >
      <span>local</span><span>space</span><span>patrol</span><span>booking</span
      ><span><span>@</span>gmail.com</span>
    </a>
    <a
      class="footer-link bandcamp"
      href="https://localspacepatrol.bandcamp.com/"
      >Bandcamp</a
    >
  </footer>
</template>

<script>
export default {}
</script>

<style scoped>
footer {
  display: flex;
  justify-content: space-around;

  position: absolute;
  bottom: 3vh;
  width: 100%;

  font-size: 2.5vw;
}

.footer-link {
  color: rgb(228, 100, 228);
  text-shadow: 2px 2px 3px rgba(20, 20, 80, 1),
    -2px -2px 3px rgba(20, 20, 80, 1), -2px 2px 3px rgba(20, 20, 80, 1),
    2px -2px 3px rgba(20, 20, 80, 1);
}

.footer-link span {
  margin-right: 1px;
}

@media (orientation: portrait) and (max-width: 600px) {
  footer {
    font-size: 3vw;
  }
}

@media (min-aspect-ratio: 16/9) {
  footer {
    font-size: 2vw;
  }
}
</style>
