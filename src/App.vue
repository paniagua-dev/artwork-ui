<template>
  <div id="portfolio" class="portfolio p-grid">
    <div
      v-for="(portfolio, index) in portfolios"
      :key="index"
      class="portfolio__item--wrapper p-col-4"
      :style="portfolio.style"
    >
      <a
        :alt="portfolio.alt"
        class="portfolio__item"
        :style="{ backgroundImage: 'url(' + portfolio.src + ')' }"
        :label="portfolio.label"
        @click="displayFullscreen(index)"
      ></a>
    </div>
  </div>
  <Paginator
    :rows="page.rows"
    :totalRecords="allPortfolios.length"
    @page="pageChanged($event)"
  ></Paginator>
  <Fullscreen
      v-model:display="displayGalleria"
      :portfolios="portfolios"
      :numVisible="page.rows"
      :activeIndex="activeIndex"
  >
  </Fullscreen>
</template>

<script lang="ts">
import Fullscreen from '@/full-screen/Fullscreen.vue';
import {IPortfolio} from '@/interfaces/portfolio.interface';
import { PageState } from 'primevue/components/paginator/Paginator';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    Fullscreen
  }
})
export default class App extends Vue {
  public allPortfolios: IPortfolio[] = [
    {
      src: require('./assets/painting.jpg'),
      label: 'New painting',
      category: 'Design',
      description: 'Draw of the summer'
    },
    {
      src: require('./assets/painting_1.jpg')
    },
    {
      src: require('./assets/painting_2.jpg')
    },
    {
      src: require('./assets/painting.jpg')
    },
    {
      src: require('./assets/painting.jpg')
    },
    {
      src: require('./assets/painting.jpg')
    },
    {
      src: require('./assets/painting.jpg')
    }
  ];
  public componentKey = 0;
  public displayGalleria = false;
  public activeIndex = 0;
  private page = {
    currentPage: 0,
    rows: 6
  };
  private portfolios: IPortfolio[] = [];

  data() {
    return {
      portfolios: [],
      componentKey: 0,
      displayGalleria: false
    };
  }

  mounted() {
    this.displayPortfolioPerSlice(0);
  }

  pageChanged(pageState: PageState) {
    this.displayPortfolioPerSlice(pageState.first);
  }

  private displayPortfolioPerSlice(slice: number) {
    this.portfolios = this.allPortfolios.slice(slice, slice + this.page.rows);
  }

  displayFullscreen(index: number) {
    this.activeIndex = index;
    this.displayGalleria = !this.displayGalleria;
  }
}
</script>

<style lang="less">
body .portfolio {
  &__item {
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #333;
    height: 350px;
    position: relative;
    display: block;
    max-width: 300px;
    margin: auto;

    &:before {
      display: flex;
      justify-content: center;
      align-items: center;
      content: attr(label);
      width: 100%;
      height: 100%;
      max-width: 0;
      transition: all 0.5s;
      position: absolute;
      background-color: fade(#000, 60%);
      color: #fff;
      overflow: hidden;
      font-size: 1.8rem;
      white-space: nowrap;
    }

    &:hover {
      cursor: pointer;

      &:before {
        max-width: 100%;
      }
    }

    &--wrapper {
      padding: 0;
      margin-bottom: 40px;
      overflow: hidden;
      position: relative;
    }
  }

  &__galleria {
    .p-galleria {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-content {
        flex: 1;
        justify-content: center;
      }

      &-thumbnail {
        &-wrapper {
          margin-top: 20px;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }

        &-item {
          &-content {
            img {
              width: 100%;
              max-width: 80px;
            }
          }

          + & {
            margin-left: 10px;
          }
        }

        &-container {
          justify-content: center;
        }
      }
    }

    &--label {
      color: #fff;
      font-size: 0.8rem;
      text-align: center;
    }
  }
}
</style>
