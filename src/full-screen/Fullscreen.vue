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
        <img :src="item.src" :alt="item.label"/>
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

<style lang="less">
body .portfolio {
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
