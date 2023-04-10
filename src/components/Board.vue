<template>
  {{ isConsecutive }}
  <div class="board-wrapper">
    <transition name="fade">
      <div 
        class="board"
        :style="stylesBoard"
        v-if="notNextLevel">
          <BoardItem 
            v-for="field in fields" 
            :game-status="gameStatus" 
            :field="field" 
            :key="'item-' + field.id"
            @user-selected-field="selectField($event)" />
      </div>
    </transition>

    <p class="difficult">Текущая сложность: <span>{{ difficult }}</span></p>
    <p class="win" v-if="isWin">Поздравляем! Продолжаем играть!</p>
    <p class="fail" v-if="isFail">Вы проиграли. Попробуйте еще раз!</p>

    <button class="btn" @click="start" :disabled="!canStartGame">Старт</button>
  </div>
</template>

<script>
import { START_DIFFICULT, MAX_DIFFICULT, GAME_STATUS, GAME_SPEED } from '@/constants';
import BoardItem from './BoardItem';
import initGame from './composables/initGame';
import prepareGame from './composables/prepareGame';
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
    isConsecutive: {
      type: Boolean,
      required: true
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

    const { prepare, canStartGame } = prepareGame(initFields, fields, difficult, numberOfItems, gameStatus);

    function start() {
      prepare();
      if (props.isConsecutive) {
        gameStatus.value = GAME_STATUS.CONSECUTIVE_PREVIEW;
        const idx = fields.value
          .map((element, index) => (element.value === 1 ? index : null))
          .filter((element) => element !== null);

        const showFilledFields = () => {
          const delay = 500;
          
          idx.forEach((index, i) => {
            setTimeout(() => {
              fields.value[index].clicked = true;
              if (i === idx.length - 1) {
                setTimeout(() => {
                  idx.forEach((index) => {
                    fields.value[index].clicked = false;
                  });
                  gameStatus.value = GAME_STATUS.STARTED;
                }, delay);
              }
            }, delay * i);
          });
        };

        showFilledFields();
      } else {
        gameStatus.value = GAME_STATUS.PREVIEW;
        setTimeout(() => {
          gameStatus.value = GAME_STATUS.STARTED;
        }, GAME_SPEED.NEW_SIZE);
      }
    }

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
        }, GAME_SPEED.ANIMATION_BOARD);
      }
    );
    watch( 
      () => props.customDifficult, 
      () => {
        difficult.value = props.customDifficult;
      }
    );

    const stylesBoard = computed( () => ({
        display: 'grid',
        gridTemplateColumns: 'repeat(' +  props.sizeOfBoard  + ', 1fr)',
        gridTemplateRows: 'repeat(' +  props.sizeOfBoard  + ', 1fr)',
        // height: document.querySelector('.board').offsetWidth + 'px'
    }));

    return {
      gameStatus,
      fields,
      difficult,
      start,
      canStartGame,
      selectField,
      isWin,
      isFail,
      notNextLevel,
      stylesBoard,
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
  margin-top: 2rem;
}
.board {
  background: #eee;
  padding: 1rem;
  width: 50rem;
  height: 50rem;
  margin: 0 auto;
  grid-column-gap: .5rem;
  grid-row-gap: .5rem;
}
.difficult {
  margin-top: 2rem;
  font-size: 1.4rem;
  color: #000;
}
.difficult span {
  font-weight: 700;
  font-size: 1.6rem;
}
.btn {
  background: #41b883;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: .5rem;
  padding: 1rem 3rem;
  margin-top: 1rem;
  cursor: pointer;
  outline: none;
}
.btn:hover {
  background: #42b983;
}
.btn:disabled {
  opacity: .5;
}
.win,
.fail {
  margin-top: 1rem;
  color: #41b883;
  font-size: 1.6rem;
  font-weight: 700;
}
.fail {
  color: #ff000055;
}

@media (max-width: 500px) {
  .board {
    width: 32rem;
    height: 32rem;
  }
}
</style>