<template>
  <template v-if="allPortfolios && allPortfolios.length > 0">
    <div class="portfolio__buttons--wrapper">
      <Button
          label="All"
          class="p-button-outlined"
          @click="filterByCategory('All')"
      ></Button>

      <Button
          v-for="(category, index) in categories"
          :key="index"
          :label="category"
          class="p-button-outlined"
          :class="{'p-button-active': category === currentCategory}"
          @click="filterByCategory(category)"
      ></Button>
    </div>
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
        :totalRecords="portfoliosByCategories.length"
        @page="pageChanged($event)"
    ></Paginator>
    <Fullscreen
        v-model:display="displayGalleria"
        :portfolios="portfoliosByCategories"
        :numVisible="page.rows"
        :activeIndex="activeIndex"
    >
    </Fullscreen>
  </template>
</template>

<script lang="ts">
declare const artworks: { works: IPortfolio[], categories: string[] };
import Fullscreen from '@/full-screen/Fullscreen.vue';
import {IPortfolio} from '@/interfaces/portfolio.interface';
import {camelCase} from 'lodash';
import {PageState} from 'primevue/components/paginator/Paginator';
import {Options, Vue} from 'vue-class-component';
import './App.less';

@Options({
  components: {
    Fullscreen,
  },
})
export default class App extends Vue {
  public allPortfolios: IPortfolio[] = artworks.works || [];
  public portfoliosByCategories: IPortfolio[] = artworks.works || [];
  public categories = artworks.categories;
  public currentCategory = 'all';
  public componentKey = 0;
  public displayGalleria = false;
  public activeIndex = 0;
  private page = {
    currentPage: 0,
    rows: 6,
  };
  private portfolios: IPortfolio[] = [];

  data() {
    return {
      portfolios: [],
      componentKey: 0,
      displayGalleria: false,
    };
  }

  mounted() {
    this.displayPortfolioPerSlice(0);
    if (this.allPortfolios.length < 1) {
      console.warn('The portfolios are not defined! Please define allPortfolios var.');
    }
  }

  pageChanged(pageState: PageState) {
    this.page.currentPage = pageState.first;
    this.displayPortfolioPerSlice(pageState.first);
  }

  private displayPortfolioPerSlice(slice: number) {
    this.portfolios = this.portfoliosByCategories.slice(slice, slice + this.page.rows);
  }

  displayFullscreen(index: number) {
    this.activeIndex = index;
    this.displayGalleria = !this.displayGalleria;
  }

  filterByCategory(category: string) {
    this.currentCategory = category;
    category = camelCase(category);

    if ((category) === 'all') {

      this.portfoliosByCategories = this.allPortfolios;
      this.displayPortfolioPerSlice(this.page.currentPage);
      return;
    }

    const currentPortfolios = this.allPortfolios.filter((p) => {
      return camelCase(p.category) === (category);
    });

    this.portfolios =  currentPortfolios;
    this.portfoliosByCategories =  currentPortfolios;
  }
}
</script>