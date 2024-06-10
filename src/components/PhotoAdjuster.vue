<template>
  <div style="position: relative; display: inline" ref="clickBox">
    <q-btn
      unelevated
      icon="format_shapes"
      @click="promptDialog()"
      :disable="!selected_employee_data.employees_id"
    />
    <div
      class="q-pa-md"
      :hidden="displayModal == false"
      style="
        position: absolute;
        z-index: 999;
        background-color: white;
        width: 250px;
        box-shadow: 10px 19px 60px -27px;
        border-radius: 5px;
        right: -210px;
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
      <!-- <q-slider v-model="photoFormat.top" :min="-6500" :max="3000" :step="1" /> -->
      <q-input type="number" dense v-model="photoFormat.top"></q-input>

      <label for="" style="font-size: 12pt"
        >Horizontal: {{ photoFormat.left }}px</label
      >
      <!-- <q-slider v-model="photoFormat.left" :min="-6000" :max="440" :step="1" /> -->
      <q-input type="number" dense v-model="photoFormat.left">
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="chevron_left"
            @mousedown="photoFormat.left += 1"
          />
          <q-btn
            round
            dense
            flat
            icon="chevron_right"
            @click="photoFormat.left -= 1"
          />
        </template>
      </q-input>

      <label for="" style="font-size: 12pt"
        >Scale: {{ photoFormat.scale }}px</label
      >
      <!-- <q-slider
        v-model="photoFormat.scale"
        :min="0"
        :max="0.15"
        :step="0.001"
      /> -->
      <q-input
        type="number"
        dense
        v-model="photoFormat.scale"
        :min="0"
        :max="0.15"
        :step="0.001"
      ></q-input>

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
  selected_employee_data: {
    type: Object,
  },
});
</script>
