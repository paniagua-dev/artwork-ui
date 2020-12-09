<template>
  <template v-if="allPortfolios && allPortfolios.length > 0">
    <div class="portfolio__buttons--wrapper">
      <Button
          label="All"
          class="p-button-outlined"
          :class="{'active': 'All' === currentCategory}"
          @click="filterByCategory('All')"
      ></Button>

      <Button
          v-for="(category, index) in categories"
          :key="index"
          :label="category"
          :class="{'active': category === currentCategory}"
          @click="filterByCategory(category)"
      ></Button>
    </div>
    <div id="portfolio" class="portfolio p-grid" :class="[filtered && 'filtered', pageHasChanged && 'page-has-changed', returnCategoryId(currentCategory)]">
      <div
          v-for="(portfolio, index) in portfolios"
          :key="index"
          class="portfolio__item--wrapper item-in-view p-col-12 p-md-6 p-lg-4"
          :class="[returnCategoryId(portfolio.category), 'item-page-' + page.page ]"
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
  public currentCategory:string = '';
  public componentKey = 0;
  public displayGalleria = false;
  public activeIndex = 0;
  public filtered = false;
  public pageHasChanged = false;
  private page: PageState = {
    first: 0,
    rows: 6,
    page: 0,
    pageCount: 0,
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
    this.page = pageState;
    this.displayPortfolioPerSlice(pageState.first);
    this.pageHasChanged = true;
  }

  private displayPortfolioPerSlice(slice: number) {
    this.portfolios = this.portfoliosByCategories.slice(slice, slice + this.page.rows);
  }

  displayFullscreen(index: number) {
    this.activeIndex = index;
    this.displayGalleria = !this.displayGalleria;
  }

  filterByCategory(category: string) {
    this.filtered = true;
    this.currentCategory = category;
    category = this.returnCategoryId(category);

    if ((category) === 'all') {
      this.portfoliosByCategories = this.allPortfolios;
      this.displayPortfolioPerSlice(this.page.first);
      return;
    }

    this.portfoliosByCategories = this.allPortfolios.filter((p) => {
      return this.returnCategoryId(p.category || '') === (category);
    });

    this.displayPortfolioPerSlice(this.page.first);
  }

  returnCategoryId(category: string): string {
    return camelCase(category);
  }
}
</script>