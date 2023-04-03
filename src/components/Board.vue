<template>
  <div class="board-wrapper">
    <transition name="fade">
      <div 
        class="board"
        :style="{ width: `${sizeOfBoard * 60}px` }"
        v-if="notNextLevel">
          <BoardItem 
            v-for="field in fields" 
            :game-status="gameStatus" 
            :field="field" 
            :key="'item-' + field.id"
            @user-selected-field="selectField($event)" />
      </div>
    </transition>

    <p class="difficult">Current difficult: <b>{{ difficult }}</b></p>
    <p class="win" v-if="isWin">Поздравляем! Продолжаем играть!</p>
    <p class="fail" v-if="isFail">Вы проиграли. Попробуйте еще раз!</p>

    <button class="btn" @click="start" :disabled="!canStartGame">Старт</button>
  </div>
</template>

<script>
import { START_DIFFICULT, MAX_DIFFICULT } from '@/constants';
import BoardItem from './BoardItem';
import initGame from './composables/initGame';
import startGame from './composables/startGame';
import processGame from '@/components/composables/processGame'
import { computed, watch, ref } from 'vue';

export default { 
  name: 'Board',
  components: {
    BoardItem,
  },
  props: {
    sizeOfBoard: {
      type: Number,
      required: true,
    },
    customDifficult: {
      type: Number,
      required: false
    },
    setNewSize: {
      type: Function,
      required: true
    },
    setNewCustomDifficult: {
      type: Function,
      required: false
    }
  },
  setup(props) {
    const notNextLevel = ref(false);
    const numberOfItems = computed( () => props.sizeOfBoard ** 2);
    const maxDifficult = computed( () => props.customDifficult ? Math.floor(numberOfItems.value / 2) 
                                          : props.sizeOfBoard > 4 ? MAX_DIFFICULT : Math.floor(numberOfItems.value / 2));
    
    const { fields, difficult, gameStatus, initFields } = initGame(numberOfItems);

    const { start, canStartGame } = startGame(initFields, fields, difficult, numberOfItems, gameStatus);

    const { selectField, isWin, isFail } = processGame(fields, gameStatus, difficult, start, initFields);

    watch(difficult, (newDifficult) => {
      if (newDifficult > maxDifficult.value && props.sizeOfBoard < 10) {
        props.setNewSize();
      }
      if (newDifficult > maxDifficult.value &&  props.sizeOfBoard == 10) {
        difficult.value = maxDifficult.value;
      }
    });
    watch( 
      () => props.sizeOfBoard, 
      () => {
        notNextLevel.value = false;
        if (!props.customDifficult) {
          if (props.sizeOfBoard <= 4) difficult.value = props.sizeOfBoard - 1;
          else difficult.value = START_DIFFICULT;
        }
        initFields();
        setTimeout(() => {
          notNextLevel.value = true;
        }, 500);
      }
    );
    watch( 
      () => props.customDifficult, 
      () => {
        difficult.value = props.customDifficult;
      }
    );

    return {
      gameStatus,
      fields,
      difficult,
      start,
      canStartGame,
      selectField,
      isWin,
      isFail,
      notNextLevel
    }
  },
}
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .board-wrapper {
    margin-bottom: 100px;
  }
  .board {
    background: #eee;
    margin: 0 auto;
  }
  .btn {
    background: #42b983cc;
    color: white;
    border: none;
    border-radius: 2px;
    padding: 10px 30px;
    margin: 10px 0;
    cursor: pointer;
    outline: none;
  }
  .btn:hover {
    background: #42b983;
  }
  .btn:disabled {
    opacity: .5;
  }
  .win {
    color: #42b983;
  }
  .fail {
    color: #ff000055;
  }
</style>