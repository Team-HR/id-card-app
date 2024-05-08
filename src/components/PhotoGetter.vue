<template>
  <div id="photoGetterContainer">
    <!-- <img id="capturePhotoImg" src="~/assets/images/default-img.jpg" /> -->
    <canvas id="canvasCapture" width="250" height="187.5"></canvas>
  </div>

  <!-- <q-btn unelevated class="" label="Upload" icon="file_upload" /> -->
  <q-btn
    unelevated
    class=""
    label="CAM"
    icon="add_a_photo"
    @click="promptDialog"
  />

  <!-- <q-btn unelevated class="" label="" icon="format_shapes" /> -->

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px; text-align: center">
      <q-card-section class="q-pt-none q-ma-lg">
        <q-select
          v-model="selectedCamDevice"
          :options="camDevices"
          label="Device"
        />

        <video id="player" autoplay style="width: 250px"></video>
        <br />
        <q-btn id="capture">Capture</q-btn>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <!-- <q-btn flat label="Save" v-close-popup /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
#photoGetterContainer {
  border: 1px solid grey;
  margin-top: 20px;
  margin-left: 15px;
  width: 250px;
  height: 187.5px;
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
defineEmits(["imageCaptured"]);
defineOptions({
  name: "PhotoGetter",
  data() {
    return {
      prompt: false,
      selectedCamDevice: null,
      camDevices: [],
      player: null,
    };
  },
  watch: {
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
          // console.log("canvas.toDataURL()", canvas.toDataURL());
          const dataUrl = canvas.toDataURL();

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

      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.gotStream);
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
      // console.log(deviceInfos);
      window.deviceInfos = deviceInfos; // make available to console
      // console.log("Available input and output devices:", deviceInfos);
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

  mounted() {},
});

const props = defineProps({
  // src: {
  //   type: String,
  //   required: true,
  // },
});
</script>
