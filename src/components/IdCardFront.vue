<template>
  <div
    class="q-ma-sm"
    style="
      border: 1px solid gray;
      background-color: aqua;
      height: 12.75cm;
      width: 8.1cm;
      font-size: 7pt;
      position: relative;
      background-image: url('/images/lgu_id_front.jpg');
      background-position: center;
      background-size: contain;
    "
  >
    <div
      style="
        width: 116px;
        height: 116px;
        background-color: aliceblue;
        border-radius: 100%;
        position: relative;
        top: 162px;
        left: 97px;
      "
    >
      <img
        :src="imgSrc"
        style="width: 116px; margin: auto; border-radius: 100%"
      />
    </div>

    <div
      style="
        margin-top: 10px;
        width: 100%;
        text-align: center;
        position: relative;
        top: 173px;
        left: 21px;
      "
    >
      {{ details.idNumber ? details.idNumber : "_ - ____" }}
    </div>

    <div
      style="
        margin-top: 10px;
        /* margin-bottom: 0px !important;
              padding-bottom: 0px !important; */
        margin-left: 20px;
        font-size: 32pt;
        width: 100%;
        text-align: left;
        line-height: 0.6;
        font-weight: 500;
      "
    >
      {{ details.lastName }}
    </div>
    <div
      style="
        margin-top: 0px !important;
        padding: 0px !important;
        margin-left: 20px;
        font-size: 16pt;
        width: 100%;
        text-align: left;
        font-weight: 500;
      "
    >
      {{ details.firstName }}
      {{ details.middleName }}
    </div>
    <div
      style="
        margin-top: 0px !important;
        padding: 0px !important;
        margin-left: 20px;
        font-size: 10pt;
        width: 100%;
        text-align: left;
        font-weight: 500;
        font-stretch: ultra-expanded;
      "
    >
      {{ details.position }}
    </div>
    <div
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
    </div>
  </div>
</template>

<style>
.detail {
  margin-left: 10px;
}
</style>

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
