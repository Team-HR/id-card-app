<template>
  <q-page class="q-pa-md">
    <div class="row" style="position: inherit">
      <div class="col" style="">
        <q-select
          clearable
          class="q-mb-md"
          filled
          v-model="selected_employee"
          use-input
          input-debounce="0"
          label="Search Employee"
          :options="selections"
          @filter="filterFn"
          behavior="menu"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-btn class="q-mb-md" @click="getEmployeeData()" type="button"
          >Get</q-btn
        >

        <div class="row">
          <div class="col">
            <div style="margin-left: 100px">
              <vue-avatar
                :width="200"
                :height="200"
                :rotation="rotation"
                :borderRadius="borderRadius"
                :scale="scale"
                ref="vueavatar"
                @vue-avatar-editor:image-ready="onImageReady"
              >
              </vue-avatar>
              <br />
              <label>
                Zoom : {{ scale }}x
                <br />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.02"
                  v-model="scale"
                />
              </label>
              <br />
              <button v-on:click="saveClicked">Get image</button>
              <br />
            </div>
          </div>
          <div class="col">
            <q-form
              @submit.prevent="onSubmit"
              @reset="onReset"
              class="q-gutter-sm_"
            >
              <q-input
                filled
                v-model="selected_employee_data.idNumber"
                label="ID Number *"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please enter the ID number',
                ]"
              />

              <q-input
                filled
                v-model="selected_employee_data.lastName"
                label="Last Name"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    '* Last Name should not be empty!',
                ]"
              />

              <q-input
                filled
                v-model="selected_employee_data.firstName"
                label="First Name"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    '* First Name should not be empty!',
                ]"
              />

              <div class="row">
                <div class="col">
                  <q-input
                    filled
                    v-model="selected_employee_data.middleName"
                    label="M.I."
                    hint=""
                  />
                </div>
                <div class="col q-ml-sm">
                  <q-input
                    filled
                    v-model="selected_employee_data.extName"
                    label="Name Extension"
                  />
                </div>
              </div>

              <q-input
                filled
                label="Address"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Address should not be empty!',
                ]"
              />

              <q-btn type="submit">Save</q-btn>
            </q-form>
          </div>
        </div>
      </div>
      <div class="col flex flex-center q-mt-lg" style="position: relative">
        <!-- <div style="background-color: aqua; height: 8.5cm; width: 5.4cm"></div> -->
        <IdCardFront :details="selected_employee_data" :imgSrc="imgSrc" />
        <IdCardBack :details="selected_employee_data" />
      </div>
    </div>
  </q-page>
  <q-btn
    style="position: absolute; bottom: 17px; left: 650px"
    label="Download"
    @click="downloadImage()"
  ></q-btn>
</template>

<script setup>
import VueAvatar from "vue-avatar-editor-improved/src/components/VueAvatar.vue";

import IdCardFront from "components/IdCardFront.vue";
import IdCardBack from "components/IdCardBack.vue";

import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

defineOptions({
  name: "IndexPage",
  components: {
    VueAvatar: VueAvatar,
    IdCardFront,
    IdCardBack,
  },

  data: function data() {
    return {
      selected_employee: null,
      selected_employee_data: {
        idNumber: null,
        lastName: null,
        firstName: null,
        middleName: null,
        extName: null,
        position: null,
        position_function: null,
      },
      employees: [],
      selections: this.employees,
      rotation: 0,
      scale: 1,
      borderRadius: 0,
      imgSrc: "",
    };
  },

  methods: {
    downloadImage() {
      var node1 = document.getElementById("IdCardFront");
      var node2 = document.getElementById("IdCardBack");
      htmlToImage.toJpeg(node1, { quality: 0.95 }).then((dataUrl) => {
        var link = document.createElement("a");
        link.download =
          this.selected_employee_data.lastName +
          "_" +
          this.selected_employee_data.idNumber +
          "_FRONT.jpeg";
        link.href = dataUrl;
        link.click();
      });

      htmlToImage.toJpeg(node2, { quality: 0.95 }).then((dataUrl) => {
        var link = document.createElement("a");
        link.download =
          this.selected_employee_data.lastName +
          "_" +
          this.selected_employee_data.idNumber +
          "_BACK.jpeg";
        link.href = dataUrl;
        link.click();
      });
    },
    onSubmit() {
      console.log(this.selected_employee_data);
    },
    onReset() {},
    getEmployeeData() {
      this.$api
        .post("http://localhost:8081/test.php", {
          getEmployeeData: true,
          employeeId: this.selected_employee.value,
        })
        .then(({ data }) => {
          console.log("EMPLOYEE DATA: ", data);
          this.selected_employee_data = data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.selections = this.employees;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.selections = this.employees.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    saveClicked: function saveClicked() {
      var img = this.$refs.vueavatar.getImageScaled();
      // this.$refs.image.src = img.toDataURL();
      this.imgSrc = img.toDataURL();
    },
    onImageReady: function onImageReady() {
      this.scale = 1;
      this.rotation = 0;
    },
  },

  created() {
    this.$api
      .post("http://localhost:8081/test.php", {
        getEmployeeList: "true",
      })
      .then(({ data }) => {
        console.log(data);
        this.employees = data;
      })
      .catch((err) => {
        console.error(err);
      });
  },
});
</script>
