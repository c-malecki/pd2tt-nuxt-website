<template>
  <div class="MiscItem-container">
    <div class="NameImage">
      <h5 :class="itemTextClass">{{ getCurrentItem.name }}</h5>
      <span v-if="getCurrentItem.props.rarity !== `nmag`" class="ItemTier">{{
        getCurrentItem.base_name
      }}</span>
      <div class="ImageContainer">
        <img :src="getCurrentItem.image" :alt="getCurrentItem.name" />
      </div>
    </div>
    <v-col>
      <ul>
        <li v-if="getCurrentItem.props.level_req > 0">
          Level Req: {{ getCurrentItem.props.level_req }}
        </li>
        <ul v-if="getCurrentItem.stats.length > 0" class="ItemStats">
          <li v-for="stat in getCurrentItem.stats" :key="stat.code">
            {{ stat.display }}
          </li>
        </ul>
      </ul>
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "MiscItemDisplay",
  filters: {
    itemTier(val) {
      let string = "Normal";
      if (val === "exc") {
        string = "Exceptional";
      } else if (val === "elt") {
        string = "Elite";
      }
      return string;
    },
  },
  computed: {
    ...mapGetters("items", ["getCurrentItem"]),
    itemTextClass() {
      let text = "nmag";
      if (this.getCurrentItem.props.rarity === "uni") {
        text = "rw-uni";
      }
      return text;
    },
  },
};
</script>

<style lang="scss" scoped>
.MiscItem-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $dark-bg;
  h5 {
    text-align: center;
    width: 100%;
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
  .NameImage {
    display: flex;
    flex-direction: column;
    .ImageContainer {
      width: 150px;
      height: 150px;
      overflow: hidden;
    }
    span {
      text-align: center;
    }
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  ul {
    list-style: none;
    padding-left: 0;

    li {
      text-align: center;
    }
  }

  .ItemTier {
    color: $gray-text;
  }

  .ItemStats {
    color: $mag-text;
  }

  .nmag {
    color: #ffffff;
  }

  .rw-uni {
    color: $uni-text;
  }
}
</style>
