<template>
  <div class="FeatureShowcase-container">
    <nuxt-link
      v-for="(feat, idx) in features"
      :key="`${feat.title}-${idx}`"
      class="feature-item"
      :to="feat.link"
    >
      <h3>{{ feat.title }}</h3>
      <div class="feature-content">
        <v-img :src="feat.img" width="200" height="200" />
        <p class="feature-description">
          {{ feat.desc }}
        </p>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: "FeatureShowcase",
  data: () => ({
    features: [
      {
        title: "Itempedia",
        link: "/itempedia",
        img: "/itempedia-splash.png",
        desc: `Need to find an item with a specific property, see the stats for upgrading a unique,
        or figure out the ideal base for your next runeword? The Itempedia is the perfect tool for quickly searching,
        filtering, and viewing all items in Project Diablo 2.`,
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.FeatureShowcase-container {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  .feature-item {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin: 0.5rem;
    max-width: 500px;
    background-color: $ui-bg;
    text-decoration: none;
    @media (max-width: 480px) {
      margin: 0.5rem 0;
      text-align: center;
    }

    h3 {
      color: $uni-text;
      margin-bottom: 0.5rem;
    }

    .feature-content {
      display: flex;
      flex-direction: row;
      @media (max-width: 480px) {
        flex-direction: column;
        align-items: center;
      }

      p {
        margin-left: 0.5rem;
        @media (max-width: 480px) {
          margin-left: 0;
          margin-bottom: 0;
          margin-top: 0.5rem;
        }
      }
    }
  }
}
</style>
