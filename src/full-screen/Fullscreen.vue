<template>
  <Galleria
      :value="portfolios"
      :numVisible="numVisible"
      containerStyle="max-width: 50%"
      :circular="true"
      :fullScreen="true"
      :showItemNavigators="true"
      :visible="display"
      @update:visible="$emit('update:display', $event)"
      :activeIndex="activeIndex"
      :maskClass="'portfolio__galleria'"
  >
    <template #item="{item}">
      <figure>
        <div class="portfolio__galleria--image">
          <img :src="item.src" :alt="item.label" />
        </div>
        <figcaption>
          <p class="portfolio__galleria--label">
            <b>{{ item.label }}</b>
            <br/>
            {{ item.description }}
          </p>
        </figcaption>
      </figure>
    </template>
    <template #thumbnail="{item}">
      <img :src="item.src" :alt="item.label"/>
    </template>
  </Galleria>
</template>

<script lang="ts">
import {IPortfolio} from '@/interfaces/portfolio.interface';
import {PropType} from 'vue';
import {Options, Vue} from 'vue-class-component';

@Options({
  emits: ['update:display'],
  props: {
    numVisible: Number,
    portfolios: Array as PropType<IPortfolio[]>,
    display: Boolean,
    activeIndex: Number
  },
})
export default class Fullscreen extends Vue {
}
</script>
