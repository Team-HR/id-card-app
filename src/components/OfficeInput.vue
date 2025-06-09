<template>
  <div>
    <q-input :disable="isDisabled" v-model="search" :label="inputLabel" debounce="300" @update:model-value="onInput"
             @focus="showSuggestions = true" @blur="hideSuggestions" filled>
      <template #append>
        <slot name="append" />
      </template>
    </q-input>

    <q-list v-if="showSuggestions && filteredSuggestions.length" class="bg-white shadow-2 rounded-b"
            style="max-height: 200px; overflow: auto;">
      <q-item v-for="(item, index) in filteredSuggestions" :key="index" clickable
              @mousedown.prevent="selectSuggestion(item)">
        <q-item-section>{{ item }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isDisabled: Boolean,
  modelValue: String,
  inputLabel: String,
  suggestions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const search = ref(props.modelValue || '')
const showSuggestions = ref(false)
const filteredSuggestions = ref([])

watch(() => props.modelValue, val => {
  if (val !== search.value) {
    search.value = val
    filterSuggestions(val)
  }
})

function onInput(val) {
  search.value = val
  emit('update:modelValue', val)
  filterSuggestions(val)
}

function filterSuggestions(val) {
  if (!val) {
    filteredSuggestions.value = []
    return
  }
  const term = val.toLowerCase()
  filteredSuggestions.value = props.suggestions.filter(item =>
    item.toLowerCase().includes(term)
  )
}

function selectSuggestion(item) {
  search.value = item
  emit('update:modelValue', item)
  showSuggestions.value = false
}

function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>
