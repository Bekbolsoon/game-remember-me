import { FIELD, GAME_SPEED, GAME_STATUS } from "@/constants";
import { computed } from "vue";

export default function processGame(fields, gameStatus, difficult, start, initFields) {
  const selectField = (id) => {
    const index = fields.value.findIndex((field) => {
      return field.id === id;
    });

    if (!fields.value[index].clicked) {
      fields.value[index].clicked = true;
      checkGame();
    }
  }

  const checkGame = () => {
    // loss check
    const errorIndex = fields.value.findIndex((field) => {
      return field.clicked && field.value === FIELD.EMPTY;
    });
    if (errorIndex > -1) {
      setGameOver();
      return;
    }

    // win check
    const notFoundItemIndex = fields.value.findIndex((field) => {
      return !field.clicked && field.value === FIELD.FILLED;
    });
    if (notFoundItemIndex === -1) {
      setWin();
    }
  }

  /* win/lose actions */
  const setGameOver = () => {
    gameStatus.value = GAME_STATUS.FAIL;
  }
  const setWin = () => {
    gameStatus.value = GAME_STATUS.WIN;

    setTimeout( () => {
      initFields();
      gameStatus.value = GAME_STATUS.STARTED;

      setTimeout(() => {
        difficult.value++;
        // start();
      }, GAME_SPEED.NEW_DIFFICULT);
    }, GAME_SPEED.NEW_SIZE);
  }

  /* for drawing information about win/loss */
  const isWin = computed(() => {
    return gameStatus.value === GAME_STATUS.WIN;
  });
  const isFail = computed(() => {
    return gameStatus.value === GAME_STATUS.FAIL;
  });

  return {
    selectField,
    isWin,
    isFail
  }
}