<template>
  <div style="position: relative; display: inline;" ref="clickBox">
    <q-btn unelevated icon="format_shapes" @click="promptDialog()" :disable="!selected_employee_data.employees_id" />
    <div class="q-pa-md" :hidden="displayModal == false" style="
        position: absolute;
        z-index: 999;
        background-color: white;
        width: 250px;
        box-shadow: 10px 19px 60px -27px;
        border-radius: 5px;
        right: -210px;
         padding-right: 20px;
      ">
      <q-btn size="xs" style="position: absolute; top: 10px; right: 10px" @click="reset()">Reset</q-btn>
      <label style="font-size: 12pt">Vertical: {{ photoFormat.top }}px</label>
      <!-- <q-slider v-model="photoFormat.top" :min="-6500" :max="3000" :step="1" /> -->
      <q-input type="number" dense v-model="photoFormat.top"></q-input>

      <label style="font-size: 12pt">Horizontal: {{ photoFormat.left }}px</label>
      <!-- <q-slider v-model="photoFormat.left" :min="-6000" :max="440" :step="1" /> -->
      <q-input type="number" dense v-model="photoFormat.left" :min="-6000" :max="440" :step="1">
        <!-- buggy left right btns -->
        <!-- <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="chevron_left"
            type="button"
            @mousedown="mousedown('left')"
            @mouseup="mouseup()"
          />
          <q-btn
            round
            dense
            flat
            icon="chevron_right"
            @mousedown="mousedown('right')"
            @mouseup="mouseup()"
          />
        </template> -->
      </q-input>

      <label style="font-size: 12pt">Scale: {{ photoFormat.scale }}px</label>
      <q-input type="number" dense v-model="photoFormat.scale" :min="0" :max="1000" :step="1"></q-input>

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
      interval: null,
      count: 0,
      horizontalDir: null,
    };
  },
  methods: {
    mousedown(hDir) {
      this.horizontalDir = hDir;
      this.increment();
      this.interval = setInterval(this.increment, 100);
    },
    mouseup() {
      clearInterval(this.interval);
    },
    increment() {
      if (this.horizontalDir == "left") {
        this.photoFormat.left += 1;
      } else {
        this.photoFormat.left -= 1;
      }
    },
    promptDialog() {
      this.displayModal = !this.displayModal;
    },
    reset() {
      this.photoFormat.top = this.photoFormatDefault.top;
      this.photoFormat.left = this.photoFormatDefault.left;
      this.photoFormat.scale = this.photoFormatDefault.scale;
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
  photoProps: {
    type: Object,
    required: true,
  },
  selected_employee_data: {
    type: Object,
  },
});
</script>
