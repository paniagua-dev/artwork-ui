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
        @click="displayGalleria = !displayGalleria"
      ></a>
    </div>
  </div>
  <Paginator
    :rows="page.rows"
    :totalRecords="allPortfolios.length"
    @page="isPageChanged($event)"
  ></Paginator>
  <Galleria
    :value="allPortfolios"
    :numVisible="page.rows"
    containerStyle="max-width: 50%"
    :circular="true"
    :fullScreen="true"
    :showItemNavigators="true"
    v-model:visible="displayGalleria"
    :maskClass="'portfolio__galleria'"
  >
    <template #item="slotProps">
      <figure>
        <img :src="slotProps.item.src" :alt="slotProps.item.label" />
        <figcaption class="portfolio__galleria--label">
          <p>
            <b>{{ slotProps.item.label }}</b>
            <br />
            {{ slotProps.item.description }}
          </p>
        </figcaption>
      </figure>
    </template>
    <template #thumbnail="slotProps">
      <img :src="slotProps.item.src" :alt="slotProps.item.label" />
    </template>
  </Galleria>
</template>

<script lang="ts">
declare const lightGallery: any;
import Paginator, { PageState } from 'primevue/components/paginator/Paginator';
import { Options, Vue } from 'vue-class-component';

interface IPortfolio {
  src: string;
  label?: string;
  category?: string;
  description?: string;
}

@Options({
  components: { Paginator }
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

  isPageChanged(pageState: PageState) {
    this.displayPortfolioPerSlice(pageState.first);
  }

  private displayPortfolioPerSlice(slice: number) {
    this.portfolios = this.allPortfolios.slice(slice, slice + this.page.rows);
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
      padding: 0 40px 0 0;
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
