<template>
  <div class="settings">
    <div class="settings__item">
      <label for="size-of-board">Размер доски</label>
      <div class="select-size">
        <select
          id="size-of-board"
          v-model.number="selectedSize"
          @change="selectSizeOfBoard(selectedSize)"
        >
          <option v-for="size in dimensions" :value="size" :key="size">
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
          :max="maxDifficult"
        />
      </div>
    </div>

    <div class="settings__item">
      <label class="toggle" for="appearCheckbox">
        Последовательное появление
        <input 
          type="checkbox" 
          v-model="isConsecutive"
          @change="$emit('user-selected-consecutive')"
          class="toggle__input" 
          id="appearCheckbox" />
        <span class="toggle-track">
          <span class="toggle-indicator">
            <span class="checkMark">
              <svg
                viewBox="0 0 24 24"
                id="ghq-svg-check"
                role="presentation"
                aria-hidden="true"
              >
                <path
                  d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"
                ></path>
              </svg>
            </span>
          </span>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { DIMENSIONS } from "@/constants";
import { ref, watch, computed } from "vue";

export default {
  name: "Settings",
  emits: [
    "user-selected-size",
    "user-selected-difficult",
    "user-selected-consecutive",
  ],
  components: {},
  props: {
    sizeFromBoard: {
      type: Number,
      required: false,
    },
  },
  setup(props, { emit }) {
    const dimensions = DIMENSIONS;
    const selectedSize = ref(0);
    const customDifficult = ref(null);
    const isConsecutive = ref(false);

    watch(
      () => props.sizeFromBoard,
      () => {
        selectedSize.value = props.sizeFromBoard;
      }
    );

    const maxDifficult = computed(() => {
      return Math.floor(selectedSize.value ** 2 / 2);
    });

    function selectSizeOfBoard(selectedSize) {
      customDifficult.value = null;
      emit("user-selected-size", selectedSize);
    }

    return {
      isConsecutive,
      dimensions,
      selectedSize,
      customDifficult,
      maxDifficult,
      selectSizeOfBoard,
    };
  },
};
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
  margin-right: 0.5rem;
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
  padding: 0.5rem;
  border: 0;
  margin: 0;
  border-radius: 0.5rem;
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

  /*  Custom dropdown arrow */
.select-size::after {
  content: "";
  height: 0.8em;
  width: 0.8rem;
  border-left: #fff 0.3rem solid;
  border-top: #fff 0.3rem solid;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-65%) rotate(225deg);
}

  /*  Custom dropdown arrow cover */
.select-size::before {
  width: 2.8em;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 0 0.5rem 0.5rem 0;
  background-color: #35495e;
}

/* Custom checkbox input */
.toggle {
  align-items: center;
  border-radius: 10rem;
  display: flex;
}
.toggle:last-of-type {
  margin: 0;
}
.toggle__input {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
.toggle-track {
  background: #fff;
  border: .1rem solid  #fff;
  border-radius: 10rem;
  cursor: pointer;
  display: flex;
  height: 2rem;
  margin-left: .5rem;
  position: relative;
  width: 3.8rem;
  transition: 1s;
}
.toggle-indicator {
  align-items: center;
  background: #41b883;
  border-radius: 50%;
  display: flex;
  width: 1.4rem;
  height: 1.4rem;
  justify-content: center;
  left: .2rem;
  outline: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 1s;
}
.checkMark {
  fill: #fff;
  height: 1rem;
  width: 1rem;
  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 1s ease-in-out;
}
.toggle__input:checked + .toggle-track .toggle-indicator {
  background: #fff;
  left: inherit;
  right: 0.2rem;
  /* transform: translateX(48%) translateY(-50%); */
}
.toggle__input:checked + .toggle-track{
  background: #41b883;
}
.toggle__input:checked + .toggle-track .toggle-indicator .checkMark {
  opacity: 1;
  transform: translateY(-50%);
  transition: opacity 1s ease-in-out;
  fill: #41b883;
}
@media (max-width: 750px) {
  .settings {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .settings__item {
    margin-top: 1rem;
  }
  .settings__item:first-child {
    margin-top: 0;
  }
}
</style>
