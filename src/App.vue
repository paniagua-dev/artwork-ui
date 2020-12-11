<template>
  <template v-if="allPortfolios && allPortfolios.length > 0">
    <Filter
        :buttons="categories"
        @filtered-by-button="sortByCategory($event)"
        :selections="filters"
        @filtered-by-selection="sortByFilter($event)"
    ></Filter>
    <div
        id="portfolio"
        class="portfolio p-grid"
        :class="[
            filtered && 'filtered',
            pageHasChanged && 'page-has-changed',
            returnCategoryId(currentCategory)
        ]"
    >
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
        :totalRecords="portfoliosFiltered.length"
        @page="pageChanged($event)"
    ></Paginator>
    <Fullscreen
        v-model:display="displayGalleria"
        :portfolios="portfoliosFiltered"
        :numVisible="page.rows"
        :activeIndex="activeIndex"
    >
    </Fullscreen>
  </template>
</template>

<script lang="ts">
declare const artworks: { works: IPortfolio[], categories: string[], filters?: string[] };
import Filter from '@/filter/Filter.vue';
import Fullscreen from '@/full-screen/Fullscreen.vue';
import {IPortfolio} from '@/interfaces/portfolio.interface';
import {camelCase} from 'lodash';
import {PageState} from 'primevue/components/paginator/Paginator';
import {Options, Vue} from 'vue-class-component';
import './App.less';

@Options({
  components: {
    Fullscreen,
    Filter,
  },
})
export default class App extends Vue {
  public allPortfolios: IPortfolio[] = artworks.works || [];
  public portfoliosFiltered: IPortfolio[] = artworks.works || [];
  public filters = artworks.filters;
  public categories = artworks.categories;
  public currentCategory: string = '';
  public currentFilter: string = '';
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
    this.portfolios = this.portfoliosFiltered.slice(slice, slice + this.page.rows);
  }

  displayFullscreen(index: number) {
    this.activeIndex = index;
    this.displayGalleria = !this.displayGalleria;
  }

  sortByCategory(category: string) {
    this.setAsFiltered();
    this.currentCategory = category;
    category = this.returnCategoryId(category);

    if ((category) === 'all') {
      this.portfoliosFiltered = this.allPortfolios;
      this.displayPortfolioPerSlice(this.page.first);
      return;
    }

    if (this.currentFilter) {
      this.filter(this.allPortfolios, this.currentFilter);
      this.portfoliosFiltered = this.portfoliosFiltered.filter((p) => {
        return this.returnCategoryId(p.category || '') === category;
      });
      this.displayPortfolioPerSlice(this.page.first);
      return;
    }

    this.portfoliosFiltered = this.allPortfolios.filter((p) => {
      return this.returnCategoryId(p.category || '') === category;
    });

    this.displayPortfolioPerSlice(this.page.first);
  }

  sortByFilter(filterValue: string) {
    if (filterValue !== this.currentFilter) {
      this.currentFilter = filterValue;
      const updateViewByFilter = () => {
        if (this.currentCategory && this.currentCategory !== 'all') {
          this.sortByCategory(this.currentCategory);
          if (filterValue !== '') {
            this.filter(this.portfoliosFiltered, filterValue);
          }
          return;
        }
        this.portfoliosFiltered = this.allPortfolios;
      };

      updateViewByFilter();
      this.setAsFiltered();
      this.displayPortfolioPerSlice(this.page.first);
    }
  }

  returnCategoryId(category: string): string {
    return camelCase(category);
  }

  private setAsFiltered() {
    if (!this.filtered) {
      this.filtered = true;
    }
  }

  private filter(portfolios: IPortfolio[], filterBy: string) {
    this.portfoliosFiltered = portfolios.filter((p) => p.filter === filterBy);
  }

}
</script>