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
        background-color: aliceblue;
        border-radius: 100%;
        position: absolute;
        top: 80px;
        left: 81px;
      "
    >
      <img
        :src="imgSrc"
        style="width: 169px; margin: auto; border-radius: 100%"
      />
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
      {{ details.empno ? details.empno : "_ - ____" }}
    </div>

    <div
      style="
        font-size: 32pt;
        width: 100%;
        text-align: left;
        font-weight: 500;
        position: absolute;
        bottom: 119px;
        left: 40px;
      "
    >
      {{ details.lastName }}{{ details.extName ? ", " + details.extName : "" }}
    </div>
    <div
      style="
        font-size: 23pt;
        width: 100%;
        text-align: left;
        font-weight: 700;
        position: absolute;
        bottom: 95px;
        left: 40px;
      "
    >
      {{ details.firstName }}
      {{ details.middleName ? details.middleName[0] + ". " : "" }}
    </div>
    <div
      style="
        font-size: 12pt;
        width: 100%;
        text-align: left;
        /* font-weight: 500; */
        font-stretch: ultra-expanded;
        position: absolute;
        bottom: 80px;
        left: 40px;
      "
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
});

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
  imgSrc: {
    type: String,
    required: true,
  },
});
</script>
