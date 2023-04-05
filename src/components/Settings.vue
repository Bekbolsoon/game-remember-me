<template>
  <div class="settings">
    <div class="settings__item">
      <label for="size-of-board">Размер доски</label>
      <div class="select-size">
        <select 
          id="size-of-board" 
          v-model.number="selectedSize" 
          @change="selectSizeOfBoard(selectedSize)">
            <option 
              v-for="size in dimensions" 
              :value="size"
              :key="size">
                {{ `${size} x ${size}` }}
              </option>
        </select>
      </div>
    </div>

    <div class="settings__item">
      <label for="custom-difficult">Сложность (опционально)</label>
      <div class="input-difficult">
        <input 
          type="number" 
          id="custom-difficult" 
          v-model.number="customDifficult"
          @input="$emit('user-selected-difficult', customDifficult)"
          :min="1"
          :max="maxDifficult">
      </div>
    </div>
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
  setup(props, {emit}) {
    const dimensions = DIMENSIONS;
    const selectedSize = ref(0);
    const customDifficult = ref(null);

    watch( 
      () => props.sizeFromBoard, 
      () => {
        selectedSize.value = props.sizeFromBoard;
      }
    );

    const maxDifficult = computed( () => {
      return Math.floor((selectedSize.value ** 2) / 2)
    });

    function selectSizeOfBoard(selectedSize) {
      customDifficult.value = null;
      emit('user-selected-size', selectedSize)
    }

    return {
      dimensions,
      selectedSize,
      customDifficult,
      maxDifficult,
      selectSizeOfBoard
    }
  }
}
</script>

<style scoped>
.settings {
  background: #41b883;
  padding: 1rem;
  display: flex;
  justify-content: center;
}
.settings__item {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
.settings__item:first-child {
  margin-left: 0;
}
label {
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
  margin-right: .5rem;
}
/* Custom dropdown for select size */
.select-size {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.select-size select,
.input-difficult input {
  background-color: #fff;
  width: 8rem;
  color: #35495e;
  font-size: 1.4rem;
  padding: .5rem;
  border: 0;
  margin: 0;
  border-radius: .5rem;
  appearance: none;
}
.input-difficult input {
  width: 4rem;
}
.select-size select:focus-visible,
.input-difficult input {
  outline: none;
}

.select-size::before,
.select-size::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.select-size::after { /*  Custom dropdown arrow */
  content: "";
  height: .8em;
  width: .8rem;
  border-left: #fff .3rem solid;
  border-top: #fff .3rem solid;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-65%) rotate(225deg);
}

.select-size::before { /*  Custom dropdown arrow cover */
  width: 2.8em;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 0 3px 3px 0;
  background-color: #35495e;
}

</style>