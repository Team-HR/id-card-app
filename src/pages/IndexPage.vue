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
    <!-- disable overflow-y to edit pre prendered ID -->
    <!-- <div style="width: 100%; height: 751px; overflow-y: hidden"> -->
    <div>
      <div class="row" style="position: inherit">
        <div class="col-6" style="">
          <q-select clearable class="q-mb-md" filled v-model="selected_employee_input" use-input input-debounce="0"
                    label="Select Employee" :options="selections" option-value="value" option-label="label"
                    @filter="filterFn" @clear="onClearForm()" @update:model-value="getEmployeeData()" behavior="menu">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="flex justify-left; q-mb-md">
            <q-btn label="Dashboard" to="dashboard"></q-btn>
            <div class="q-px-md">
              <PhotoGetter @imageCaptured="saveImageCaptured" :selected_employee_data="selected_employee_data">
                <template v-slot:buttons>
                  <PhotoAdjuster :photoProps="photoFormat" :selected_employee_data="selected_employee_data" />
                </template>
              </PhotoGetter>
            </div>
          </div>

          <!-- <q-btn class="q-mb-md" @click="getEmployeeData()" type="button"
          >Get</q-btn
        > -->

          <div class="row justify-end">
            <!-- <div class="col">
              <div style="margin-left: 30px">
                <PhotoGetter @imageCaptured="saveImageCaptured" :selected_employee_data="selected_employee_data">
                  <template v-slot:buttons>
                    <PhotoAdjuster :photoProps="photoFormat" :selected_employee_data="selected_employee_data" />
                  </template>
                </PhotoGetter>
              </div>
            </div> -->
            <div class="col-10">
              <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-sm_">
                <q-input :disable="!selected_employee_input" dense filled v-model="selected_employee_data.empno"
                         label="ID Number *" hint="" lazy-rules :rules="[
                          (val) => (val && val.length > 0) || 'Please enter the ID number',
                        ]" />

                <div class="row">
                  <q-input :disable="!selected_employee_input" class="col" dense filled
                           v-model="selected_employee_data.lastName" label="Last Name" hint="" lazy-rules :rules="[
                            (val) =>
                              (val && val.length > 0) || '* Last Name should not be empty!',
                          ]">
                    <template v-slot:append>
                      <TextFormatter :textProps="textFormat.lastName" textFor="lastName" />
                    </template>
                  </q-input>

                  <q-input :disable="!selected_employee_input" class="col q-ml-sm" dense filled
                           v-model="selected_employee_data.firstName" label="First Name" hint="" lazy-rules :rules="[
                            (val) =>
                              (val && val.length > 0) || '* First Name should not be empty!',
                          ]">
                    <template v-slot:append>
                      <!-- <q-btn round dense flat icon="format_shapes" /> -->
                      <TextFormatter :textProps="textFormat.firstName" textFor="firstName" />
                    </template>
                  </q-input>
                </div>
                <div class="row">
                  <div class="col">
                    <q-input :disable="!selected_employee_input" dense filled
                             v-model="selected_employee_data.middleName" label="Middle Name" hint="" />
                  </div>
                  <div class="col q-ml-sm">
                    <q-input :disable="!selected_employee_input" dense filled v-model="selected_employee_data.extName"
                             label="Name Extension" />
                  </div>
                </div>

                <!-- Position -->
                <!-- :disable="!selected_employee_input" -->
                <q-input :disable="!selected_employee_input" class="col" dense filled
                         v-model="selected_employee_data.position" label="Position" hint="" lazy-rules :rules="[
                          (val) => (val && val.length > 0) || '* Position should not be empty!',
                        ]" type="textarea" autogrow @keyup.enter.prevent>
                  <template v-slot:append>
                    <TextFormatter :textProps="textFormat.position" textFor="position" />
                    <TextFormatter :textProps="textFormat.horizontalLine" textFor="horizontalLine"
                                   customIcon="vertical_align_center" />
                  </template>
                </q-input>

                <!-- Section -->
                <!-- <AutocompleteInput input-label="Section" :suggestions="sectionOptions"
                             :input-selected="selected_employee_data.section" /> -->
                <AutocompleteInput :isDisabled="!selected_employee_input" input-label="Section"
                                   v-model="selected_employee_data.section" :suggestions="sectionOptions">
                  <template #append>
                    <TextFormatter :textProps="textFormat.section" textFor="section" />
                  </template>
                </AutocompleteInput>
                <!-- 
                <q-input :disable="!selected_employee_input" class="col" dense filled
                         v-model="selected_employee_data.section" label="Section">
                  <template v-slot:append>
                    <TextFormatter :textProps="textFormat.section" textFor="section" />
                  </template>
                </q-input> -->

                <!-- Department -->
                <AutocompleteInput :isDisabled="!selected_employee_input" input-label="Department"
                                   v-model="selected_employee_data.department" :suggestions="departmentOptions">
                  <template #append>
                    <TextFormatter :textProps="textFormat.department" textFor="department" />
                  </template>
                </AutocompleteInput>
                <!-- 
                <q-input :disable="!selected_employee_input" class="col" dense filled
                         v-model="selected_employee_data.department" label="Department" hint="" lazy-rules :rules="[
                          (val) => (val && val.length > 0) || '* Department should not be empty!',
                        ]">
                  <template v-slot:append>
                    <TextFormatter :textProps="textFormat.department" textFor="department" />
                  </template>
                </q-input> -->


                <!-- <q-input :disable="!selected_employee_input" dense filled
                         v-model="selected_employee_data.address_res_barangay" label="Barangay" hint="" lazy-rules
                         :rules="[
                          (val) => (val && val.length > 0) || '* Field should not be empty!',
                        ]" /> -->

                <AutocompleteInput :isDisabled="!selected_employee_input" input-label="Barangay"
                                   v-model="selected_employee_data.address_res_barangay"
                                   :suggestions="addressOptions.res_barangays" />

                <div class="row">
                  <!-- <q-input class="col q-mr-sm" :disable="!selected_employee_input" dense filled
                           v-model="selected_employee_data.address_res_city" label="City/Municipality" hint=""
                           lazy-rules :rules="[
                            (val) => (val && val.length > 0) || '* Field should not be empty!',
                          ]" /> -->

                  <AutocompleteInput class="col q-mr-sm" :isDisabled="!selected_employee_input"
                                     input-label="City/Municipality" v-model="selected_employee_data.address_res_city"
                                     :suggestions="addressOptions.res_citys" />


                  <!-- <q-input class="col" :disable="!selected_employee_input" dense filled
                           v-model="selected_employee_data.address_res_zip_code" label="Zipcode" hint="" lazy-rules
                           :rules="[
                            (val) => (val && val.length > 0) || '* Field should not be empty!',
                          ]" /> -->

                  <AutocompleteInput class="col q-mr-sm" :isDisabled="!selected_employee_input" input-label="Zipcode"
                                     v-model="selected_employee_data.address_res_zip_code"
                                     :suggestions="addressOptions.res_zip_codes" />

                </div>

                <!-- <q-input :disable="!selected_employee_input" dense filled
                         v-model="selected_employee_data.address_res_province" label="Province" hint="" lazy-rules
                         :rules="[
                          (val) => (val && val.length > 0) || '* Field should not be empty!',
                        ]" /> -->


                <AutocompleteInput class="col q-mr-sm" :isDisabled="!selected_employee_input" input-label="Province"
                                   v-model="selected_employee_data.address_res_province"
                                   :suggestions="addressOptions.res_provinces" />

                <div class="row">
                  <q-select :disable="!selected_employee_input" class="col" dense outlined
                            v-model="selected_employee_data.gender" :options="['MALE', 'FEMALE']" label="Gender" />
                  <q-input :disable="!selected_employee_input" class="col q-ml-sm" dense filled
                           v-model="selected_employee_data.birthdate" label="Birthdate" type="date" />
                </div>

                <!-- <q-input
                :disable="!selected_employee_input"
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
                  <q-input :disable="!selected_employee_input" class="col" dense filled
                           v-model="selected_employee_data.blood_type" label="Blood Type" hint="" lazy-rules :rules="[
                            (val) => (val && val.length > 0) || '* Field should not be empty!',
                          ]" />

                  <q-input :disable="!selected_employee_input" class="col q-ml-sm" dense filled
                           v-model="selected_employee_data.contact_number" label="Contact Number" hint="" />
                </div>

                <q-input :disable="!selected_employee_input" dense filled
                         v-model="selected_employee_data.emergency_name" label="Emergency Contact Person" hint=""
                         lazy-rules :rules="[
                          (val) => (val && val.length > 0) || '* Field should not be empty!',
                        ]" />

                <q-input :disable="!selected_employee_input" dense filled
                         v-model="selected_employee_data.emergency_number" label="Emergency Contact Number" hint="" />

                <div class="row">
                  <div class="col">
                    <q-input :disable="!selected_employee_input" dense filled
                             v-model="selected_employee_data.date_issued" label="Date Issued" type="date" />
                  </div>
                  <div class="col q-ml-sm">
                    <q-input :disable="!selected_employee_input" dense filled
                             v-model="selected_employee_data.date_expire" label="Valid Until" type="date" />
                  </div>
                </div>

                <div class="q-mt-sm"></div>
                <q-btn :disable="!selected_employee_input" class="q-mr-sm" type="submit">Save</q-btn>
                <q-btn :disable="!selected_employee_input" label="Download" @click="downloadImage()"></q-btn>

                <!-- <q-btn
                  :disable="!selected_employee_input"
                  class="q-ml-sm"
                  label="Download as PDF"
                  @click="downloadAsPdf()"
                ></q-btn> -->
              </q-form>
            </div>
          </div>
        </div>
        <div id="cardFrontAndBack" class="flex" style="position: relative">
          <!-- <div style="background-color: aqua; height: 8.5cm; width: 5.4cm"></div> -->
          <IdCardFront style="transform: scale(0.5); position: absolute" :details="selected_employee_data"
                       :timestamp="timestamp" :textFormat="textFormat" :photoFormat="photoFormat" />
          <IdCardBack :details="selected_employee_data" @onPenDataSave="savePendata" />
        </div>
      </div>
      <!-- <video id="player" autoplay></video>
    <button id="capture">Capture</button>
    <canvas id="canvas" width="320" height="240"></canvas> -->
      <!-- <br /> -->
      <div style="
          margin-bottom: 10px;
          width: 100%;
          height: 100px;
          background-color: green;
          color: wheat;
          text-align: center;
        ">
        <h1>PRE-RENDERED</h1>
      </div>

      <div class="flex flex-center">
        <IdCardFrontV2 :details="selected_employee_data" :timestamp="timestamp" :textFormat="textFormat"
                       :photoFormat="photoFormat" />
        <IdCardBackV2 :details="selected_employee_data" @onPenDataSave="savePendata" />
      </div>
    </div>

    <q-dialog v-model="showLoading" persistent>
      <q-card class="q-pa-md flex flex-center" style="">
        <q-spinner-dots size="50" color="green" />
        <div class=" q-ml-lg"> Saving please wait...</div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";

import IdCardFront from "components/IdCardFront.vue";
import IdCardFrontV2 from "components/IdCardFrontV2.vue";
import IdCardBack from "components/IdCardBack.vue";
import IdCardBackV2 from "components/IdCardBackV2.vue";
import PhotoGetter from "components/PhotoGetter.vue";
import PhotoAdjuster from "components/PhotoAdjuster.vue";


import TextFormatter from "components/TextFormatter.vue";
import AutocompleteInput from "src/components/AutocompleteInput.vue";

import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

// const $q = useQuasar();

defineOptions({
  name: "IndexPage",
  components: {
    IdCardFront,
    IdCardFrontV2,
    IdCardBack,
    IdCardBackV2,
    PhotoGetter,
    PhotoAdjuster,
    TextFormatter,
    AutocompleteInput
  },

  data: function data() {
    return {
      id: null,
      showLoading: false,
      departmentOptions: [],
      sectionOptions: [],
      addressOptions: [],
      // photoFormat: {
      //   top: 1897, //-14,
      //   left: 2924, //-58,
      //   scale: 0.071, //1.5,
      // },
      $q: useQuasar(),
      photoFormat: {
        top: 3,
        left: 17,
        scale: 84, //will be the scale
      },
      textFormat: {
        position: {
          font_size: 17,
          bottom: 102,
          left: 40,
          line_height: 20,
        },
        horizontalLine: {
          bottom: 100,
          left: 40,
        },
        section: {
          font_size: 18,
          bottom: 80,
          left: 40,
          line_height: 20,
        },
        department: {
          font_size: 18,
          bottom: 58,
          left: 40,
          line_height: 66,
        },
        lastName: {
          font_size: 40,
          bottom: 140,
          left: 40,
        },
        firstName: {
          font_size: 24,
          bottom: 124,
          left: 40,
        },
      },
      selected_employee_input: null, //{ label: "VALENCIAS, FRANZ JOSHUA ALCAZAR", value: "9" },
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
      selected_employee_image_data: null,
      employees: [],
      selections: this.employees,
      timestamp: 0,
    };
  },

  methods: {
    saveImageCaptured(formData) {
      this.timestamp = new Date().valueOf();
    },

    savePendata(data) {
      this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          savePendata: true,
          m_penData: data,
          employees_id: this.selected_employee_data.employees_id,
        })
        .then(({ data }) => { })
        .catch((err) => {
          console.error(err);
        });
    },
    adjustLastName() {
      // console.log("adjust lastname");
    },

    downloadAsPdf() {
      var node1 = document.getElementById("IdCardFront");
      var node2 = document.getElementById("IdCardBack");
      htmlToImage.toJpeg(node1, { quality: 1 }).then((dataUrl) => {
        this.$api
          .post(
            import.meta.env.VITE_API_URL + "/id_card_upload.php",
            {
              employees_id: this.selected_employee_data.employees_id,
              side: "front",
              image: dataUrl,
            },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then(() => {
            htmlToImage.toJpeg(node2, { quality: 1 }).then((dataUrl) => {
              this.$api
                .post(
                  import.meta.env.VITE_API_URL + "/id_card_upload.php",
                  {
                    employees_id: this.selected_employee_data.employees_id,
                    side: "back",
                    image: dataUrl,
                  },
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
                )
                .then(() => {
                  var link = document.createElement("a");
                  link.href =
                    import.meta.env.VITE_API_URL +
                    "/id_card_print_pdf.php?employee_id=" +
                    this.selected_employee_data.employees_id;
                  link.click();
                });
            });
          });
      });
    },

    async setImageData() {
      var node1 = document.getElementById("IdCardFrontV2");
      var node2 = document.getElementById("IdCardBackV2");

      var frontDataUrl = "";
      var backDataUrl = "";

      await htmlToImage.toJpeg(node1, { quality: 1 }).then((dataUrl) => {
        frontDataUrl = dataUrl;
      });

      await htmlToImage.toJpeg(node2, { quality: 1 }).then((dataUrl) => {
        backDataUrl = dataUrl;
      });

      // this.selected_employee_data.imageData = {
      //   front: frontImageData,
      //   back: backImageData,
      // };
      // return {
      //   front: frontImageData,
      //   back: backImageData,
      // };

      this.selected_employee_image_data = { frontDataUrl, backDataUrl };
    },

    downloadImage() {
      // canvasWidth: 204, canvasHeight: 324
      var node1 = document.getElementById("IdCardFrontV2");
      var node2 = document.getElementById("IdCardBackV2");
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

      this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          tagAsPrinted: true,
          selected_employee_data: this.selected_employee_data,
        })
        .catch((err) => {
          console.error(err);
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
    async onSubmit() {
      await this.setImageData(); // set front and back id image data to selected_employee_data
      this.showLoading = true;
      this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          saveEmployeeData: true,
          selected_employee_data: this.selected_employee_data,
          selected_employee_image_data: this.selected_employee_image_data,
          textFormat: this.textFormat,
          photoFormat: this.photoFormat,
        })
        .then(({ data }) => {
          // console.log("Save changes");
          this.saveNotify()
          this.getEmployeeData();
          setTimeout(() => {
            this.showLoading = false;
          }, 1000);
        });

    },
    onReset() { },
    async getEmployeeData() {
      // alert(JSON.stringify(this.selected_employee_input))
      // return false;
      if (!this.selected_employee_input) return;
      await this.$api.post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
        getEmployeeData: true,
        employeeId: this.selected_employee_input.value,
      })
        .then(({ data }) => {
          // console.log("getEmployeeData: ", data);
          this.selected_employee_data = data;
          if (data.text_formatting) {
            // font_size": 17, "bottom": 83, "left": 40, "line_height": 20
            this.textFormat.position.font_size = data?.text_formatting?.position?.font_size ?? this.textFormat.position.font_size;
            this.textFormat.position.bottom = data?.text_formatting?.position?.bottom ?? this.textFormat.position.bottom;
            this.textFormat.position.line_height = data?.text_formatting?.position?.line_height ?? this.textFormat.position.line_height;

            this.textFormat.horizontalLine.bottom = data?.text_formatting?.horizontalLine?.bottom ?? this.textFormat.horizontalLine.bottom;

            this.textFormat.department.font_size = data?.text_formatting?.department?.font_size ?? this.textFormat.department.font_size;
            this.textFormat.department.bottom = data?.text_formatting?.department?.bottom ?? this.textFormat.department.bottom;
            this.textFormat.department.line_height = data?.text_formatting?.department?.line_height ?? this.textFormat.department.line_height;

            this.textFormat.section.font_size = data?.text_formatting?.section?.font_size ?? this.textFormat.section.font_size;
            this.textFormat.section.bottom = data?.text_formatting?.section?.bottom ?? this.textFormat.section.bottom;
            this.textFormat.section.line_height = data?.text_formatting?.section?.line_height ?? this.textFormat.section.line_height;

            this.textFormat.lastName.font_size = data?.text_formatting?.lastName?.font_size ?? this.textFormat.lastName.font_size;
            this.textFormat.lastName.bottom = data?.text_formatting?.lastName?.bottom ?? this.textFormat.lastName.bottom;

            this.textFormat.firstName.font_size = data?.text_formatting?.firstName?.font_size ?? this.textFormat.firstName.font_size;
            this.textFormat.firstName.bottom = data?.text_formatting?.firstName?.bottom ?? this.textFormat.firstName.bottom;

          }

          if (data.photo_formatting) {
            this.photoFormat.top = data?.photo_formatting?.top ?? this.photoFormat.top;
            this.photoFormat.left = data?.photo_formatting?.left ?? this.photoFormat.left;
            this.photoFormat.scale = data?.photo_formatting?.scale ?? this.photoFormat.scale;

          }
        })
        .catch((err) => {
          console.error(err);
        });
      // console.log("this.getEmployeeData:", this.selected_employee_data);
    },
    saveNotify() {
      this.$q.notify({
        message: 'Saved changes!',
        color: 'green',
        icon: 'save'
      })
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

    async getOfficeNamesForAutocomplete() {
      await this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          getOfficeNamesForAutocomplete: "true",
        })
        .then(({ data }) => {
          // console.log("getOfficeNamesForAutocomplete:", data);
          this.departmentOptions = data.departments
          this.sectionOptions = data.sections
        })
    },

    async getAddressesForAutocomplete() {
      await this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          getAddressesForAutocomplete: "true",
        })
        .then(({ data }) => {
          console.log("getAddressesForAutocomplete:", data);
          this.addressOptions = data;
        })
    }


  },


  watch: {
    '$route.params.id'(newId) {
      this.id = newId;
      // Optional: handle changes here
      // console.log(this.id);
      // this.$router.push({ path: `/${newId}` });
      if (this.id) {
        console.log('getEmployeeData');

      } else {
        console.log('change none');
      }
    },
  },
  async created() {
    this.id = this.$route.params.id;
    await this.$api
      .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
        getEmployeeList: "true",
      })
      .then(({ data }) => {
        this.employees = data;
      })
      .catch((err) => {
        console.error(err);
      });

    await this.getOfficeNamesForAutocomplete();
    await this.getAddressesForAutocomplete();
  },

  mounted() {
    this.getEmployeeData();

    // const player = document.getElementById("player");
    // const canvas = document.getElementById("canvas");
    // const context = canvas.getContext("2d");
    // const captureButton = document.getElementById("capture");
    // const constraints = {
    //   video: true,
    // };
    // captureButton.addEventListener("click", () => {
    //   // Draw the video frame to the canvas.
    //   context.drawImage(player, 0, 0, canvas.width, canvas.height);
    // });
    // console.log(
    //   "enumerate camera devices ",
    //   navigator.mediaDevices.enumerateDevices()
    // );
    // // Attach the video stream to the video element and autoplay.
    // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    //   player.srcObject = stream;
    // });
  },
});
</script>
