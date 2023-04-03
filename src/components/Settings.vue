<template>
  <div class="settings">
    <label for="size-of-board">Choose size of board</label>
    <select 
      id="size-of-board" 
      v-model.number="selectedSize" 
      @change="$emit('user-selected-size', selectedSize)">
        <option 
          v-for="size in dimensions" 
          :value="size"
          :key="size">
            {{ size }}
          </option>
    </select>

    <label for="custom-difficult">Your custom difficult</label>
    <input 
      type="number" 
      id="custom-difficult" 
      v-model.number="customDifficult"
      @input="$emit('user-selected-difficult', customDifficult)"
      :min="1"
      :max="maxDifficult">
  </div>
</template>

<script>
import { DIMENSIONS } from '@/constants';
import { ref, watch, computed } from 'vue';

export default {
  name: 'Settings',
  emits: ['user-selected-size', 'user-selected-difficult'],
  components: {},
  props: {
    sizeFromBoard: {
      type: Number,
      required: false
    }
  },
  setup(props) {
    const dimensions = DIMENSIONS;
    const selectedSize = ref(0);
    const customDifficult = ref(0);

    watch( 
      () => props.sizeFromBoard, 
      () => {
        selectedSize.value = props.sizeFromBoard;
      }
    );

    const maxDifficult = computed( () => {
      return Math.floor((selectedSize.value ** 2) / 2)
    });

    return {
      dimensions,
      selectedSize,
      customDifficult,
      maxDifficult
    }
  }
}
</script>

<style scoped>
  .settings {
    background: #42b983cc;
  }
</style>