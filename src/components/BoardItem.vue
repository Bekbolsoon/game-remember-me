<template>
  <span 
    :class="getBoardItemClasses"
    @click="selectField(field.id)">
    {{ `${field.value}` }}
  </span>
</template>

<script>
import { FIELD, GAME_STATUS } from '@/constants';
import { computed } from 'vue'

export default {
  name: 'BoardItem',
  emits: ['user-selected-field'],
  props: {
    field: {
      type: Object,
      required: true,
    },
    gameStatus: {
      type: Number,
      required: false,
      default: GAME_STATUS.NONE,
    }
  },
  setup(props, {emit}) {
    const getBoardItemClasses = computed( () => {
      let classes = 'item';

      if (props.field.value === FIELD.FILLED && props.gameStatus === GAME_STATUS.PREVIEW
          || props.field.clicked && props.field.value === FIELD.FILLED) {
        classes += ' active'
      }
      if (props.field.clicked && props.field.value === FIELD.EMPTY) {
        classes += ' error'
      }

      return classes;
    });

    function selectField(id) {
      if (props.gameStatus === GAME_STATUS.STARTED) {
        emit('user-selected-field', id);
      }
    }

    return {
      getBoardItemClasses,
      selectField
    }
  }
}
</script>

<style scoped>
  .item {
    position: relative;
    width: 50px;
    height: 50px;
    background: #ccc;
    margin: 5px;
    display: inline-block;
    cursor: pointer;
    
    transition: .4s;
    transform-style: preserve-3d;
  }
  .item.active {
    background: #42b983cc;
    transform: rotateX(180deg);
  }
  .item.error {
    background: #ff000055;
    transform: rotateX(180deg);
  }
</style>