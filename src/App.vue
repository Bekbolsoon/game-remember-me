<template>
  <div class="main">
    <Settings 
      :sizeFromBoard="size"
      @user-selected-size="setSizeOfBoard"
      @user-selected-difficult="setDifficult" />

    <img class="logo" alt="Vue logo" src="./assets/logo.png" />
    <h1 class="h1">Remember Me on VUE 3</h1>
    <p>Запомни и открой все зеленые клетки</p>

    <Board 
      :sizeOfBoard="size" 
      :customDifficult="difficult"
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

    function setSizeOfBoard(newSize) {
      size.value = newSize;
      difficult.value = 0;
    }

    function setDifficult(customDifficult) {
      difficult.value = customDifficult;
      size.value = DIMENSIONS.find(size => size ** 2 > customDifficult * 2);
    }

    function incrementSize() {
      size.value += 1;
    }

    return {
      size,
      difficult,
      setSizeOfBoard,
      setDifficult,
      incrementSize
    }
  }
};
</script>

<style scoped>
.main {
  text-align: center;
}
.logo {
  margin-top: 40px;
  width: 100px;
}
</style>
