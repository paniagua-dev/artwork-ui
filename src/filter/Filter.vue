<template>
  <div class="portfolio__filter--wrapper">
    <div class="portfolio__filter__select--wrapper" v-if="selections && selections.length > 0">
      <label v-if="!!filterLabel">{{ filterLabel }}</label>
      <Dropdown
          :options="suggestions"
          @change="select($event)"
          v-model="model"
      />
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
  </div>
</template>

<script lang="ts">
import {get} from 'lodash';
import {PropType} from 'vue';
import {Options, Vue} from 'vue-class-component';

@Options({
  emits: ['filtered-by-button', 'filtered-by-selection'],
  props: {
    filterLabel: String,
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
  public suggestions: string[] = [];
  public model = '';

  filter(btn: string): void {
    this.currentBtnActive = btn;
    this.$emit('filtered-by-button', btn);
  }

  select(selection: { originalEvent: Event, value: any }) {
    this.$emit('filtered-by-selection', selection.value);
  }

  mounted() {
    this.suggestions = get(this.$props, 'selections');
    this.suggestions.unshift('All years');
    this.model = 'All years';
  }
}
</script>
