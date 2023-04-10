<template>
  <div class="main">
    <Settings 
      :sizeFromBoard="size"
      @user-selected-size="setSizeOfBoard"
      @user-selected-difficult="setDifficult"
      @user-selected-consecutive="setConsecutive" />

    <img class="logo" alt="Vue logo" src="./assets/logo.png" />
    <h1>Remember Me on VUE 3</h1>
    <p>Remember and open all <span>green</span> cells</p>

    <Board 
      :sizeOfBoard="size" 
      :customDifficult="difficult"
      :isConsecutive="isConsecutive"
      :setNewSize="incrementSize" />
  </div>
</template>

<script>
import Settings from "./components/Settings.vue";
import Board from "./components/Board";
import { DIMENSIONS } from "./constants";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    Settings,
    Board,
  },
  setup() {
    const size = ref(0);
    const difficult = ref(0);
    const isConsecutive = ref(false)

    function setSizeOfBoard(newSize) {
      size.value = newSize;
      difficult.value = 0;
    }

    function setDifficult(customDifficult) {
      difficult.value = customDifficult;
      size.value = DIMENSIONS.find(size => size ** 2 > customDifficult * 2);
    }

    function setConsecutive() {
      isConsecutive.value = !isConsecutive.value;
    }

    function incrementSize() {
      size.value += 1;
    }

    return {
      size,
      difficult,
      isConsecutive,
      setSizeOfBoard,
      setDifficult,
      setConsecutive,
      incrementSize
    }
  }
};
</script>

<style scoped>
.main {
  text-align: center;
  color: #000;
}
.logo {
  margin-top: 4rem;
  width: 10rem;
}
h1 {
  margin-top: .5rem;
  font-size: 2.5rem;
}
p {
  margin-top: 2rem;
  font-size: 1.6rem;
  font-weight: 500;
}
p span {
  color: #41b883;
  font-weight: 700;
}
</style>
