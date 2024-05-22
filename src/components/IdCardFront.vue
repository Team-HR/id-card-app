<template>
  <div
    id="IdCardFront"
    class="front-id"
    style="
      /* border: 1px solid gray; */
      background-color: aqua;
      height: 12.75cm;
      width: 8.1cm;
      font-size: 7pt;
      position: relative;
      background-image: url('/images/lgu_id_front.png');
      background-position: center;
      background-size: contain;
    "
  >
    <div
      style="
        writing-mode: vertical-rl;
        text-orientation: upright;
        position: absolute;
        top: 75px;
        left: 5px;
        font-size: 12pt;
        color: white;
        font-weight: 500;
        text-shadow: 0px 2px 2px black;
      "
    >
      {{
        details.employmentStatus ? `${details.employmentStatus} EMPLOYEE` : ""
      }}
    </div>

    <div
      style="
        width: 169px;
        height: 168px;
        /* background-color: aliceblue; */
        border-radius: 100%;
        position: absolute;
        top: 80px;
        left: 81px;
        border: 1px solid #058040;
        border-radius: 100%;
        overflow: hidden;
      "
    >
      <img
        :hidden="imageIsLoading == 'loading'"
        @load="imageIsLoading = 'loaded'"
        :src="imgSrcFromServer"
        style="position: relative"
        :style="`bottom:${photoFormat.top}px; right: ${photoFormat.left}px; transform: scale(${photoFormat.scale})`"
      />

      <q-skeleton
        style="width: 250px; height: 188px"
        :hidden="imageIsLoading == 'loaded'"
      ></q-skeleton>
    </div>

    <div
      style="
        text-align: left;
        position: absolute;
        top: 260px;
        left: 172px;
        font-size: 13pt;
        font-weight: 500;
      "
    >
      {{
        details.empno
          ? `${details.empno.substr(0, 1)}-${details.empno.substr(-4, 4)}`
          : "_ - ____"
      }}
    </div>

    <div
      :style="`font-size:${textFormat.lastName.font_size}px; bottom: ${textFormat.lastName.bottom}px;
        left: ${textFormat.lastName.left}px; `"
      style="
        width: 100%;
        text-align: left;
        font-weight: 500;
        position: absolute;
      "
    >
      {{ details.lastName }}{{ details.extName ? ", " + details.extName : "" }}
    </div>
    <div
      style="
        width: 100%;
        text-align: left;
        font-weight: 700;
        position: absolute;
      "
      :style="`font-size:${textFormat.firstName.font_size}px; bottom: ${textFormat.firstName.bottom}px;
        left: ${textFormat.firstName.left}px; `"
    >
      {{ details.firstName }}
      {{ details.middleName ? details.middleName[0] + ". " : "" }}
    </div>
    <div
      style="
        width: 258px;
        text-align: left;
        font-stretch: ultra-expanded;
        position: absolute;
      "
      :style="`font-size:${textFormat.position.font_size}px; bottom: ${textFormat.position.bottom}px;
        left: ${textFormat.position.left}px; line-height: ${textFormat.position.line_height}px;`"
    >
      {{ details.position }}
    </div>
    <!-- <div
      style="
        margin-top: 0px !important;
        padding: 0px !important;
        margin-left: 20px;
        font-size: 10pt;
        width: 100%;
        text-align: left;
        font-weight: 500;
      "
    >
      {{ details.position_function }}
    </div> -->
  </div>
</template>

<script setup>
defineOptions({
  name: "IdCardFront",
  data() {
    return {
      imageIsLoading: "loaded",
      imgSrcFromServer: null,
    };
  },
  watch: {
    "details.employees_id"(newValue, oldValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.getPhoto();
        });
      }
    },
    timestamp(newValue) {
      if (newValue) {
        this.imageIsLoading = "loading";
        this.$nextTick(() => {
          this.getPhoto();
        });
      }
    },
  },
  methods: {
    getPhoto() {
      this.imageIsLoading = "loading";
      this.imgSrcFromServer = "#";
      this.$api
        .post("http://192.168.50.50:8081/test.php", {
          getPhoto: true,
          employees_id: this.details.employees_id,
        })
        .then(({ data }) => {
          this.imgSrcFromServer = data;
          this.imageIsLoading = "loaded";
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
});

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  textFormat: {
    type: Object,
    required: true,
  },
  photoFormat: {
    type: Object,
    required: true,
  },
});
</script>
