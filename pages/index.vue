<template>
  <div class="page-content">
    <div class="banner" />
    <div class="about-pd2tt">
      <h2>{{ `About PD2 Tools&Tech` }}</h2>
      <p>
        PD2TT's main goal is to bring Diablo 2 tools and data into the modern
        era, with a particular focus on
        <a
          href="https://www.projectdiablo2.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Project Diablo 2</a
        >. As much as we love all of the classics like Arreat Summit and Amazon
        Basin, PD2TT feels it's time to provide a more centralized hub for
        relevant D2 information that has been integrated with the changes and
        updates in Project Diablo 2.
        <br />
        <br />
        We strive for accuracy and useability in creating tools with features
        that have never existed in the 20+ year life span of D2 and D2: LoD.
        With the continual development of the base game and amazing mod the
        Project Diablo 2 team has been crafting, we hope to give back to the
        community a one-stop shop companion tool suite to enrich the dedicated
        D2 player's experience while contributing to the longevity of an ARPG
        masterpiece.
      </p>
    </div>
    <div class="feature-spotlight">
      <h2>PD2TT Tools</h2>
      <FeatureShowcase />
    </div>
  </div>
</template>

<script>
import FeatureShowcase from "../components/feature-showcase/FeatureShowcase";
export default {
  name: "LandingPage",
  components: {
    FeatureShowcase,
  },
  head: () => ({
    title: "An unofficial tool suite for PD2",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Modern tools for D2 - An unofficial tool suite for PD2",
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.about-pd2tt {
  position: relative;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: $dark-bg;
  margin: 0 auto;

  a {
    text-decoration: none;
  }

  h2 {
    color: $uni-text;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.2rem;
    @media (max-width: 768px) {
      font-size: inherit;
    }
  }
}

.feature-spotlight {
  position: relative;
  border-radius: 0.5rem;
  background-color: $dark-bg;
  margin: 1rem auto 0 auto;

  h2 {
    margin: 0.5rem;
    color: $uni-text;
  }
}
</style>
