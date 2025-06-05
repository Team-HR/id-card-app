<template>
  <div style="position: relative" ref="clickBox">
    <q-btn round dense flat icon="format_shapes" @click="adjustLastName()" />
    <div class="q-pa-md" :hidden="displayModal == false" style="
        position: absolute;
        z-index: 999;
        background-color: white;
        width: 250px;
        box-shadow: 10px 10px 20px 10px;
        border-radius: 5px;
        right: 0px;
      ">
      <q-btn flat round size="sm" style="position: absolute; top: 10px; right: 60px" @click="reset()"
             icon="restart_alt"></q-btn>
      <q-btn round size="sm" style="position: absolute; top: 10px; right: 10px" @click="displayModal = !displayModal"
             icon="close"></q-btn>
      <label for="" style="font-size: 12pt">Font-size: {{ text.font_size }}px</label>
      <!-- <q-slider v-model="text.font_size" :min="8" :max="30" :step="1" /> -->
      <q-input type="number" v-model="text.font_size" :min="8" :max="60" :step="1"></q-input>

      <label for="" style="font-size: 12pt">Vertical Position: {{ text.bottom }}px</label>
      <!-- <q-slider v-model="text.bottom" :min="0" :max="300" :step="1" /> -->
      <q-input type="number" v-model="text.bottom" :min="0" :max="300" :step="1"></q-input>

      <template v-if="textFor == 'position' || textFor == 'department' || textFor == 'section'">
        <label for="" style="font-size: 12pt">Line Height: {{ text.line_height }}px</label>
        <!-- <q-slider v-model="text.line_height" :min="0" :max="238" :step="1" /> -->
        <q-input type="number" v-model="text.line_height" :min="0" :max="238" :step="1"></q-input>
      </template>

      <!-- <label for="" style="font-size: 12pt"
        >Left Position: {{ text.left }}px</label
      >
      <q-slider v-model="text.left" :min="0" :max="80" :step="1" /> -->
      <q-btn size="xs" @click="displayModal = !displayModal">Close</q-btn>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "TextFormatter",
  data: function data() {
    return {
      displayModal: false,
      // text: {
      //   font_size: this.textProps.font_size,
      //   bottom: this.textProps.bottom,
      //   left: this.textProps.left,
      // },
      text: this.textProps,
      textDefault: Object.assign({}, this.textProps),
    };
  },
  methods: {
    adjustLastName() {
      this.displayModal = !this.displayModal;
      console.log(this.textProps);
    },
    reset() {
      this.text.font_size = this.textDefault.font_size;
      this.text.bottom = this.textDefault.bottom;
      this.text.left = this.textDefault.left;
    },
  },
  mounted() {
    window.addEventListener("click", (e) => {
      if (!this.$refs.clickBox.contains(e.target)) {
        this.displayModal = false;
      }
    });
  },
});

const props = defineProps({
  textProps: {
    type: Object,
    // required: true,
  },
  textFor: {
    type: String,
  },
});
</script>
