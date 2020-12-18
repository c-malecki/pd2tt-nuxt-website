<template>
  <div class="Runeword-container">
    <div class="NameImage">
      <h5 :class="itemTextClass">{{ getCurrentItem.name }}</h5>
      <div class="Runes">
        <div
          v-for="(rune, idx) in getRuneImages"
          :key="`${rune.name}-${idx}`"
          class="RuneImage"
        >
          <img :src="rune.item_image" :alt="rune.name" />
        </div>
      </div>
      <span>
        {{ getCurrentItem.rune_string }}
      </span>
      <span v-for="type in getCurrentItem.bases" :key="type" class="ItemTier">
        {{ type | rwBases }}
      </span>
    </div>
    <v-col>
      <ul>
        <li v-if="getCurrentItem.props.level_req > 0">
          Level Req: {{ getCurrentItem.props.level_req }}
        </li>
        <ul v-if="getCurrentItem.stats.length > 0" class="ItemStats">
          <li
            v-for="(stat, idx) in getCurrentItem.stats"
            :key="`${stat.code}-${idx}`"
          >
            {{ stat.display }}
          </li>
        </ul>
        <ul class="ItemStats">
          <li
            v-for="(stat, idx) in getCurrentItem.sockets"
            :key="`${stat.code}-${idx}`"
          >
            <span class="ItemTier">{{ stat.group }}:</span>
            <span>{{ stat.display }}</span>
          </li>
        </ul>
      </ul>
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "RunewordDisplay",
  filters: {
    rwBases(string) {
      if (string === "swor") {
        return "Swords";
      }
      if (string === "shie") {
        return "Shields";
      }
      if (string === "axe") {
        return "Axes";
      }
      if (string === "h2h" || string === "h2h2") {
        return "Assassin Claws";
      }
      if (string === "miss") {
        return "Missile Weapons";
      }
      if (string === "club") {
        return "Clubs";
      }
      if (string === "hamm") {
        return "Hammers";
      }
      if (string === "mele") {
        return "Melee Weapons";
      }
      if (string === "scep") {
        return "Scepters";
      }
      if (string === "staf") {
        return "Staves";
      }
      if (string === "weap") {
        return "All Weapons";
      }
      if (string === "pole") {
        return "Polearms";
      }
      if (string === "spea") {
        return "Spears";
      }
      if (string === "wand") {
        return "Wands";
      }
      if (string === "tors") {
        return "Body Armors";
      }
      if (string === "helm") {
        return "Helms";
      }
      if (string === "ashd") {
        return "Paladin Shield";
      }
    },
  },
  computed: {
    ...mapGetters("items", ["getCurrentItem", "getRunes"]),
    itemTextClass() {
      let text = "nmag";
      if (
        this.getCurrentItem.props.rarity === "uni" ||
        this.getCurrentItem.group === "runeword"
      ) {
        text = "rw-uni";
      }
      return text;
    },
    getRuneImages() {
      const { rune_string } = this.getCurrentItem;
      const split = rune_string.split(" ");
      let result = [];
      for (let i = 0; i < split.length; i++) {
        const runeObj = this.getRunes.find((obj) => obj.name === split[i]);
        result.push({
          ...runeObj,
          index: i,
        });
      }
      return result.sort((a, b) => a.index - b.index);
    },
  },
};
</script>

<style lang="scss" scoped>
.Runeword-container {
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
    align-items: center;
    .Runes {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .RuneImage {
        position: relative;
        width: 40px;
        height: 40px;
        overflow: hidden;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
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
