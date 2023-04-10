import { FIELD, GAME_STATUS } from '@/constants';
import { computed } from 'vue';

export default function prepareGame(initFields, fields, difficult, numberOfItems, gameStatus) {  
  const prepare = () => {
    initFields();
    if (gameStatus.value !== GAME_STATUS.TRANSITION) {
      fillFields();
    }
  };

  /* Filling fields with the desired values */
  const fillFields = () => {
    for (let i = 0; i < difficult.value; i++) {
      const index = rand(0, numberOfItems.value);
      if (fields.value[index].value !== FIELD.FILLED) {
        fields.value[index].value = FIELD.FILLED;
      } else {
        i--;
      }
    }
  };

  /* Calculation of random index (used to fill out the card) */
  const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /* Ability to press a button 'Start' */
  const canStartGame = computed( () => {
    return gameStatus.value !== GAME_STATUS.PREVIEW 
      && gameStatus.value !== GAME_STATUS.CONSECUTIVE_PREVIEW
      && gameStatus.value !== GAME_STATUS.WIN;
  });
  
  return {
    prepare,
    canStartGame,
  }
}