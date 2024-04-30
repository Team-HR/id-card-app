<style>
.q-field {
  padding-bottom: 8px;
}

.q-field__bottom {
  /* margin: 0px !important;
  padding: 0px !important; */
  display: none !important;
  /* background-color: red; */
}
</style>
<template>
  <q-page class="q-pa-md" style="position: relative">
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
          @clear="onClearForm()"
          @update:model-value="getEmployeeData()"
          behavior="menu"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- <q-btn class="q-mb-md" @click="getEmployeeData()" type="button"
          >Get</q-btn
        > -->

        <div class="row">
          <div class="col">
            <div style="margin-left: 30px">
              <vue-avatar
                image=""
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
          <div class="col-7">
            <q-form
              @submit.prevent="onSubmit"
              @reset="onReset"
              class="q-gutter-sm_"
            >
              <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.empno"
                label="ID Number *"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please enter the ID number',
                ]"
              />
              <div class="row">
                <q-input
                  :disable="!selected_employee"
                  class="col"
                  dense
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
                >
                  <template v-slot:append>
                    <q-btn round dense flat icon="format_shapes" />
                  </template>
                </q-input>
                <!-- 
                <q-input
                  bottom-slots
                  v-model="text"
                  label="Label"
                  counter
                  maxlength="12"
                  :dense="dense"
                >
                  <template v-slot:before>
                    <q-icon name="event" />
                  </template>

                  <template v-slot:hint> Field hint </template>

                  <template v-slot:append>
                    <q-btn round dense flat icon="add" />
                  </template>
                </q-input> -->

                <q-input
                  :disable="!selected_employee"
                  class="col q-ml-sm"
                  dense
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
                >
                  <template v-slot:append>
                    <q-btn round dense flat icon="format_shapes" />
                  </template>
                </q-input>
              </div>
              <div class="row">
                <div class="col">
                  <q-input
                    :disable="!selected_employee"
                    dense
                    filled
                    v-model="selected_employee_data.middleName"
                    label="Middle Name"
                    hint=""
                  />
                </div>
                <div class="col q-ml-sm">
                  <q-input
                    :disable="!selected_employee"
                    dense
                    filled
                    v-model="selected_employee_data.extName"
                    label="Name Extension"
                  />
                </div>
              </div>

              <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.address_res_barangay"
                label="Barangay"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Field should not be empty!',
                ]"
              />

              <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.address_res_city"
                label="City/Municipality"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Field should not be empty!',
                ]"
              />

              <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.address_res_province"
                label="Province"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Field should not be empty!',
                ]"
              />

              <div class="row">
                <q-select
                  :disable="!selected_employee"
                  class="col"
                  dense
                  outlined
                  v-model="selected_employee_data.gender"
                  :options="['MALE', 'FEMALE']"
                  label="Gender"
                />
                <q-input
                  :disable="!selected_employee"
                  class="col q-ml-sm"
                  dense
                  filled
                  v-model="selected_employee_data.birthdate"
                  label="Birthdate"
                  type="date"
                />
              </div>

              <!-- <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.address"
                label="Address"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Address should not be empty!',
                ]"
              /> -->

              <div class="row">
                <q-input
                  :disable="!selected_employee"
                  class="col"
                  dense
                  filled
                  v-model="selected_employee_data.blood_type"
                  label="Blood Type"
                  hint=""
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || '* Field should not be empty!',
                  ]"
                />

                <q-input
                  :disable="!selected_employee"
                  class="col q-ml-sm"
                  dense
                  filled
                  v-model="selected_employee_data.contact_number"
                  label="Contact Number"
                  hint=""
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || '* Field should not be empty!',
                  ]"
                />
              </div>

              <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.emergency_name"
                label="Emergency Contact Person"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Field should not be empty!',
                ]"
              />

              <q-input
                :disable="!selected_employee"
                dense
                filled
                v-model="selected_employee_data.emergency_number"
                label="Emergency Contact Number"
                hint=""
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || '* Field should not be empty!',
                ]"
              />

              <div class="q-mt-sm"></div>
              <q-btn :disable="!selected_employee" class="q-mr-sm" type="submit"
                >Save</q-btn
              >
              <q-btn
                :disable="!selected_employee"
                label="Download"
                @click="downloadImage()"
              ></q-btn>
            </q-form>
          </div>
        </div>
      </div>
      <div
        id="cardFrontAndBack"
        class="col flex flex-center q-mt-lg"
        style="position: relative"
      >
        <!-- <div style="background-color: aqua; height: 8.5cm; width: 5.4cm"></div> -->
        <IdCardFront :details="selected_employee_data" :imgSrc="imgSrc" />
        <IdCardBack :details="selected_employee_data" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";

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
        empno: null,
        lastName: null,
        firstName: null,
        middleName: null,
        extName: null,
        position: null,
        position_function: null,
        address: null,
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
      // canvasWidth: 204, canvasHeight: 324
      // canvasWidth: 204, canvasHeight: 324
      var node1 = document.getElementById("IdCardFront");
      var node2 = document.getElementById("IdCardBack");
      htmlToImage.toJpeg(node1, { quality: 1 }).then((dataUrl) => {
        var link = document.createElement("a");
        link.download =
          this.selected_employee_data.lastName +
          "_" +
          this.selected_employee_data.empno +
          "_FRONT.jpeg";
        link.href = dataUrl;
        link.click();
      });

      htmlToImage.toJpeg(node2, { quality: 1 }).then((dataUrl) => {
        var link = document.createElement("a");
        link.download =
          this.selected_employee_data.lastName +
          "_" +
          this.selected_employee_data.empno +
          "_BACK.jpeg";
        link.href = dataUrl;
        link.click();
      });
    },
    onClearForm() {
      window.location.reload();
      // console.log("clear");
      // this.selected_employee_data = {};
      // vue-avatar-editor-improved
      // console.log(this.$refs.vueavatar.resetImage());
      // console.log((this.$refs.vueavatar.image = "#"));
    },
    onSubmit() {
      // console.log(this.selected_employee_data);
      this.$api
        .post("http://localhost:8081/test.php", {
          saveEmployeeData: true,
          selected_employee_data: this.selected_employee_data,
        })
        .then(({ data }) => {
          console.log("SAVED DATA: ", data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    onReset() {},
    getEmployeeData() {
      if (!this.selected_employee) return;
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
      // console.log(this.imgSrc);
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
