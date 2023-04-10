import { FIELD, GAME_STATUS } from '@/constants';
import { ref } from 'vue';

export default function initGame(numberOfItems) {
  const difficult = ref(0);
  const fields = ref([]);
  const gameStatus = ref(GAME_STATUS.NONE);

  /* FILLING CELLS WITH BLANK VALUES */
  const initFields = () => {
    const fieldsArray = [];
    for (let i = 0; i < numberOfItems.value; i++) {
      fieldsArray.push({
        id: i,
        clicked: false,
        value: FIELD.EMPTY
      });
    }
    fields.value = fieldsArray;
  };
  
  return {
    fields,
    difficult,
    gameStatus,
    initFields,
  }
}