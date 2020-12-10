<template>
  <div class="portfolio__filter__select--wrapper" v-if="selections && selections.length > 0">
    <Autocomplete
        v-model="model"
        :suggestions="suggestions"
        @complete="search($event)"
        :minLength="2"
        @item-select="select($event)"
        :dropdown="true"/>
  </div>
  <div class="portfolio__filter__buttons--wrapper">
    <Button
        label="All"
        class="p-button-outlined"
        :class="{'active': 'All' === currentBtnActive}"
        @click="filter('All')"
        v-if="activeAllButton"
    ></Button>

    <Button
        v-for="(btn, index) in buttons"
        :key="index"
        :label="btn"
        :class="{'active': btn === currentBtnActive}"
        @click="filter(btn)"
    ></Button>
  </div>
</template>

<script lang="ts">
import {get} from 'lodash';
import {PropType} from 'vue';
import {Options, Vue} from 'vue-class-component';

@Options({
  emits: ['filtered-by-button', 'filtered-by-selection'],
  props: {
    buttons: Array as PropType<string[]>,
    activeAllButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    selections: {
      type: Array as () => string[],
      default: [],
      required: false,
    },
  },
})
export default class Filter extends Vue {
  public currentBtnActive = '';
  public model = '';
  public suggestions: string[] = [];

  filter(btn: string): void {
    this.currentBtnActive = btn;
    this.$emit('filtered-by-button', btn);
  }

  search(input: { originalEvent: Event, query: string }) {
    let search: string[] = [];
    this.getSelections().forEach((selection: string) => {
      (selection.indexOf(input.query) >= 0) && search.push(selection);
    });
    this.suggestions = (search.length > 0) ? search : this.getSelections();
  }

  getSelections() {
    return get(this.$props, 'selections');
  }

  select(selection: {originalEvent: Event, value: any}) {
    this.$emit('filtered-by-selection', selection.value);
  }

  mounted() {
    this.suggestions = this.getSelections();
  }
}
</script>