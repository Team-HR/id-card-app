<template>
  <div style="position: relative" ref="clickBox" class="flex">
    <q-btn round dense flat icon="format_shapes" @click="promptDialog()" />
    <div
      class="q-pa-md"
      :hidden="displayModal == false"
      style="
        position: absolute;
        z-index: 999;
        background-color: white;
        width: 250px;
        box-shadow: 10px 10px 20px 10px;
        border-radius: 5px;
        right: 0px;
      "
    >
      <q-btn
        size="xs"
        style="position: absolute; top: 10px; right: 10px"
        @click="reset()"
        >Reset</q-btn
      >
      <label for="" style="font-size: 12pt"
        >Vertical: {{ photoFormat.top }}px</label
      >
      <q-slider v-model="photoFormat.top" :min="-28" :max="0" :step="1" />

      <label for="" style="font-size: 12pt"
        >Horizontal: {{ photoFormat.left }}px</label
      >
      <q-slider v-model="photoFormat.left" :min="-116" :max="0" :step="1" />

      <label for="" style="font-size: 12pt"
        >Scale: {{ photoFormat.scale }}px</label
      >
      <q-slider v-model="photoFormat.scale" :min="0" :max="3" :step="0.01" />

      <q-btn size="xs" @click="displayModal = !displayModal">Close</q-btn>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "PhotoAdjuster",
  data: function data() {
    return {
      displayModal: false,
      photoFormat: this.photoProps,
      photoFormatDefault: Object.assign({}, this.photoProps),
    };
  },
  methods: {
    promptDialog() {
      this.displayModal = !this.displayModal;
    },
    reset() {
      this.photoFormat.top = this.photoFormatDefault.top;
      this.photoFormat.left = this.photoFormatDefault.left;
      this.photoFormat.scale = this.photoFormatDefault.scale;
    },
  },
});

const props = defineProps({
  photoProps: {
    type: Object,
    required: true,
  },
});
</script>
