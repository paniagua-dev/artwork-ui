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
            camelCase(currentCategory)
        ]"
    >
      <div
          v-for="(portfolio, index) in portfolios"
          :key="index"
          class="portfolio__item--wrapper item-in-view p-col-12 p-md-6 p-lg-4"
          :class="[camelCase(portfolio.category), 'item-page-' + page.page ]"
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
  public camelCase = camelCase;

  mounted() {
    this.updateView(0);
    if (this.allPortfolios.length < 1) {
      console.warn('The portfolios are not defined! Please define allPortfolios var.');
    }
  }

  /**
   * Fired each time the page change
   */
  public pageChanged(pageState: PageState): void {
    this.page = pageState;
    this.updateView(pageState.first);
    this.pageHasChanged = true;
  }

  /**
   * Update the view and display a set of portfolios per page
   * @param firstElementIndex: number = Slice of portfolios to display in the page
   */
  private updateView(firstElementIndex: number): void {
    this.portfolios = this.portfoliosFiltered.slice(firstElementIndex, firstElementIndex + this.page.rows);
  }

  /**
   * Display a gallery of portfolios in full screen
   * @param index: number = Index of the portfolio to display first
   */
  public displayFullscreen(index: number): void {
    this.activeIndex = index;
    this.displayGalleria = !this.displayGalleria;
  }

  public sort(category: string, filter: string): void {
    this.currentFilter = camelCase(filter) || this.currentFilter;
    this.currentCategory = camelCase(category) || this.currentCategory;
    let portfolios = this.allPortfolios;

    //Sort by current category
    if (this.currentCategory) {
      portfolios = portfolios.filter((p) => {
        return camelCase(p.category || '') === this.currentCategory;
      });
    }

    //Sort by current filter
    if (this.currentFilter) {
      portfolios = portfolios.filter((p) => {
        return camelCase(p.filter || '') === this.currentFilter;
      });
    }

    this.portfoliosFiltered = portfolios;
    this.setAsFiltered();
    this.updateView(this.page.first);
  }

  public sortByFilter(filterValue: string): void {
    if (filterValue !== this.currentFilter) {
      this.sort(this.currentCategory, filterValue);
    }
  }

  public sortByCategory(category: string): void {
    if (category !== this.currentCategory) {
      this.sort(category, this.currentFilter);
    }
  }

  /**
   * Allow to set the status of the Artwork as filtered
   */
  private setAsFiltered(): void {
    if (!this.filtered) {
      this.filtered = true;
    }
  }

}
</script>
