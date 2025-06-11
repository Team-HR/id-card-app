<template>

  <!-- <q-btn unelevated class="" label="Upload" icon="file_upload" /> -->

  <div class="q-mt-sm">
    <q-btn unelevated icon="file_upload" @click="uploadDialog = !uploadDialog"
           :disable="!selected_employee_data.employees_id">Upload Photo</q-btn>

    <!-- <input
      id="uploadPhotoInput"
      type="file"
      accept="image/jpeg"
      hidden
      @change="uploadPhoto(event)"
    /> -->

    <!-- <q-btn
      unelevated
      class=""
      label="CAM"
      icon="add_a_photo"
      @click="promptDialog"
      :disable="!selected_employee_data.employees_id"
    /> -->

    <slot name="buttons"></slot>
  </div>
  <!-- <q-btn unelevated class="" label="" icon="format_shapes" /> -->

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 1500px; text-align: center">
      <q-card-section class="q-pt-none q-ma-lg">
        <q-select v-model="selectedCamDevice" :options="camDevices" label="Device" />

        <video id="player" autoplay style="width: 1000px"></video>
        <br />
        <q-btn id="capture">Capture</q-btn>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <!-- <q-btn flat label="Save" v-close-popup /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="uploadDialog" persistent>
    <q-card style="_min-width: 1500px; text-align: center">
      <q-card-section class="q-pt-none q-ma-lg">
        <form id="uploadForm" enctype="multipart/form-data">
          <input type="file" id="fileInput" name="image" accept="image/jpeg" />
          <button type="button" @click="uploadImage()">Upload</button>
        </form>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
#photoGetterContainer {
  /* border: 1px solid grey; */
  width: 250px;
  height: 187.5px;
  margin-top: 20px;
  margin-left: 15px;

  background-color: aliceblue;
  /* cursor: pointer; */
}

#capturePhotoImg {
  /* margin-top: 20px; */
  width: 250px;
  height: 250px;
  background-color: aliceblue;
  /* cursor: pointer; */
}
</style>

<script setup>
import VueAvatar from "components/VueAvatar.vue";

defineEmits(["imageCaptured"]);
defineOptions({
  name: "PhotoGetter",
  components: {
    VueAvatar: VueAvatar,
  },
  data() {
    return {
      imageIsLoading: "loaded",
      uploadDialog: false,
      prompt: false,
      selectedCamDevice: null,
      camDevices: [],
      player: null,
      rotation: 0,
      scale: 1,
      borderRadius: 0,
      imgSrc: null,
    };
  },
  watch: {
    "selected_employee_data.employees_id"(val) {
      if (val) {
        this.imageIsLoading = "loading";

        this.$nextTick(() => {
          this.getPhoto().then(() => {
            // if (!this.$refs.uploadedPhotoRef.src) {
            //   this.imageIsLoading = null;
            // }
          });
        });
      }
      // this.$nextTick(() => {
      //   const canvas = document.getElementById("canvasCapture");
      //   const ctx = canvas.getContext("2d");
      //   const image = document.getElementById("defaultImg");
      //   ctx.drawImage(image, 10, 10, canvas.width, canvas.height);
      // });
    },
    prompt(val, oldValue) {
      if (!val) {
        if (window.stream) {
          window.stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      }
    },
    selectedCamDevice(val) {
      this.getStream();
    },
  },
  methods: {
    imageLoaded() {
      // alert("image has loaded");
      this.imageIsLoading = "loaded";
      // console.log();
    },
    async getPhoto() {
      await this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          getPhoto: true,
          employees_id: this.selected_employee_data.employees_id,
        })
        .then(({ data }) => {
          this.$refs.uploadedPhotoRef.src = data;
          // console.log("this.$refs.uploadedPhotoRef.src = data;", data);
          if (!data) {
            this.imageIsLoading = "loaded";
            // alert();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    uploadImage() {
      this.imageIsLoading = "loading";
      var form = document.getElementById("uploadForm");
      var formData = new FormData(form);

      formData.append("employees_id", this.selected_employee_data.employees_id);
      this.$api
        .post(import.meta.env.VITE_API_URL + "/id_photo_upload.php", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(({ data }) => {
          this.getPhoto();
          this.$emit("imageCaptured", formData);
          this.uploadDialog = !this.uploadDialog;
          this.imageIsLoading = "loaded";
        })
        .catch((err) => {
          console.error(err);
        });
    },

    saveClicked: function saveClicked() {
      var img = this.$refs.vueavatar.getImageScaled();
      // this.$refs.image.src = img.toDataURL();
      const imgDataUrl = img.toDataURL("image/jpeg", 1.0);

      const uploadedPhoto = document.getElementById("uploadedPhoto");
      uploadedPhoto.src = imgDataUrl;
      const canvas = document.getElementById("canvasCapture");
      const context = canvas.getContext("2d");
      context.drawImage(uploadedPhoto, 0, 0, canvas.width, canvas.height);

      this.$emit("imageCaptured", imgDataUrl);
      this.uploadDialog = !this.uploadDialog;
    },
    onImageReady: function onImageReady() {
      this.scale = 1;
      this.rotation = 0;
    },

    uploadPhoto(event) {
      const uploadPhotoInput = document.getElementById("uploadPhotoInput");
      var uploadedPhoto = document.getElementById("uploadedPhoto");

      if (uploadPhotoInput.files && uploadPhotoInput.files[0]) {
        uploadedPhoto.onload = () => {
          URL.revokeObjectURL(uploadedPhoto.src); // no longer needed, free memory

          const uploadedPhotoEditor = document.getElementById("uploadedPhotoEditor");
          const canvas = document.getElementById("canvasCapture");
          // canvas.style.width = uploadedPhotoEditor.style.width;
          // canvas.style.height = uploadedPhotoEditor.style.height;
          const context = canvas.getContext("2d");

          context.drawImage(
            uploadedPhoto,
            0,
            0,
            uploadedPhoto.width,
            uploadedPhoto.height,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
          this.$emit("imageCaptured", dataUrl);
        };

        uploadedPhoto.src = URL.createObjectURL(uploadPhotoInput.files[0]); // set src to blob url
      }
    },

    promptDialog() {
      this.camDevices = [];
      this.getDevices().then(this.gotDevices);
      this.prompt = !this.prompt;

      // this.getStream();

      this.$nextTick(() => {
        this.player = document.getElementById("player");
        const canvas = document.getElementById("canvasCapture");
        const context = canvas.getContext("2d");
        const captureButton = document.getElementById("capture");
        const constraints = {
          video: true,
        };

        captureButton.addEventListener("click", () => {
          // Draw the video frame to the canvas.
          context.drawImage(this.player, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 1.0);

          const uploadedPhoto = document.getElementById("uploadedPhoto");
          uploadedPhoto.src = dataUrl;

          this.prompt = !this.prompt;
          this.$emit("imageCaptured", dataUrl);

          // Stop all video streams.
          if (window.stream) {
            window.stream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        });

        // Attach the video stream to the video element and autoplay.
        // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        //   this.player.srcObject = stream;
        // });

        this.getStream();
      });
    },

    getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      const videoSource = this.selectedCamDevice.value;
      const constraints = {
        video: { deviceId: videoSource ? { exact: videoSource } : undefined },
      };

      return navigator.mediaDevices.getUserMedia(constraints).then(this.gotStream);
      // .catch(handleError);
    },

    gotStream(stream) {
      window.stream = stream; // make stream available to console

      // videoSelect.selectedIndex = [...videoSelect.options].findIndex(
      //   (option) => option.text === stream.getVideoTracks()[0].label
      // );

      this.player.srcObject = stream;
    },

    async getDevices() {
      // AFAICT in Safari this only gets default devices until gUM is called :/
      return await navigator.mediaDevices.enumerateDevices();
    },

    async gotDevices(deviceInfos) {
      window.deviceInfos = deviceInfos; // make available to console
      for (const deviceInfo of deviceInfos) {
        const option = { label: "", value: "" };
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "videoinput") {
          option.label = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
          // videoSelect.appendChild(option);
          this.camDevices.push(option);
        }
      }

      if (this.selectedCamDevice == null) {
        this.selectedCamDevice = this.camDevices[0];
      }
    },
  },

  created() { },
});

const props = defineProps({
  selected_employee_data: {
    type: Object,
  },
});
</script>
