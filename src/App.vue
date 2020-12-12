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
    this.displayPortfoliosPerSlice(0);
    if (this.allPortfolios.length < 1) {
      console.warn('The portfolios are not defined! Please define allPortfolios var.');
    }
  }
  /**
   * Fired each time the page change
   */
  public pageChanged(pageState: PageState): void {
    this.page = pageState;
    this.displayPortfoliosPerSlice(pageState.first);
    this.pageHasChanged = true;
  }

  /**
   * Update the view and display a set of portfolios per page
   * @param slice: number = Slice of portfolios to display in the page
   */
  private displayPortfoliosPerSlice(slice: number): void {
    this.portfolios = this.portfoliosFiltered.slice(slice, slice + this.page.rows);
  }

  /**
   * Display a gallery of portfolios in full screen
   * @param index: number = Index of the portfolio to display first
   */
  public displayFullscreen(index: number): void {
    this.activeIndex = index;
    this.displayGalleria = !this.displayGalleria;
  }

  /**
   * Update the view with the selected category
   * @param category: string = name of the category to display
   */
  public sortByCategory(category: string): void {
    this.setAsFiltered();
    this.currentCategory = category;
    category = this.returnCategoryId(category);

    if ((category) === 'all') {
      this.portfoliosFiltered = this.allPortfolios;
      this.displayPortfoliosPerSlice(this.page.first);
      return;
    }

    if (this.currentFilter) {
      this.filter(this.allPortfolios, this.currentFilter);
      this.portfoliosFiltered = this.portfoliosFiltered.filter((p) => {
        return this.returnCategoryId(p.category || '') === category;
      });
      this.displayPortfoliosPerSlice(this.page.first);
      return;
    }

    this.portfoliosFiltered = this.allPortfolios.filter((p) => {
      return this.returnCategoryId(p.category || '') === category;
    });

    this.displayPortfoliosPerSlice(this.page.first);
  }

  /**
   * Update the view with the selected filter
   * @param filterValue: string = name of the filter to display
   */
  public sortByFilter(filterValue: string): void {
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
      this.displayPortfoliosPerSlice(this.page.first);
    }
  }

  public returnCategoryId(category: string): string {
    return camelCase(category);
  }

  /**
   * Allow to set the status of the Artwork as filtered
   */
  private setAsFiltered(): void {
    if (!this.filtered) {
      this.filtered = true;
    }
  }

  private filter(portfolios: IPortfolio[], filterBy: string): void {
    this.portfoliosFiltered = portfolios.filter((p) => p.filter === filterBy);
  }

}
</script>