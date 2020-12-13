<template>
  <v-row justify="center" align="center">
    <div class="Banner" />
    <div class="PlaceholderMessage">
      <p>
        Heya all. The revamp for the site is still very much in development, but
        there have already been some big improvements to the Itempedia. Plenty
        more still to come. Enjoy! :D
        <br />
        <br />
        - Meeps
      </p>
    </div>
  </v-row>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style lang="scss" scoped>
.Banner {
  position: absolute;
  width: 100%;
  height: 26rem;
  background: url(https://www.wallpaperflare.com/static/809/247/598/fantasy-art-artwork-battle-diablo-wallpaper.jpg)
    no-repeat center / cover;
  top: 0;
}

.PlaceholderMessage {
  position: relative;
  max-width: 480px;
  margin: auto;
  font-size: 1.2rem;
  top: 8rem;
  background-color: rgba(0, 0, 0, 0.8);
  p {
    padding: 1rem;
  }
}
</style>
