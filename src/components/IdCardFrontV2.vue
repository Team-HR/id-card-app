<template>
  <div id="IdCardFrontV2" class="front-id" style="
      /* border: 1px solid gray; */
      background-color: white;
      width: 640px;
      height: 1014px;
      font-size: 22pt;
      position: relative;
      background-image: url('/images/REG_ID_Front_Temp.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    ">
    <div style="
        writing-mode: vertical-rl;
        text-orientation: upright;
        position: absolute;
        top: 151px;
        left: 6px;
        font-size: 26.05pt;
        color: white;
        font-weight: 500;
        text-shadow: 0px 2px 2px black;
      ">
      {{ details.employmentStatus ? `${details.employmentStatus} EMPLOYEE` : "" }}
    </div>

    <div style="
        width: 373px;
        height: 373px;
        border-radius: 100%;
        position: absolute;
        top: 160px;
        left: 159px;
        overflow: hidden;
      ">
      <template v-if="imgSrcFromServer">
        <img :hidden="imageIsLoading == 'loading'" @load="imageIsLoading = 'loaded'" :src="imgSrcFromServer"
             style="position: relative" :style="`bottom:${photoFormat.top * 2}mm; right: ${photoFormat.left * 2
              }mm; width: ${photoFormat.scale * 2.06}mm;`" />
      </template>

      <q-skeleton style="width: 250px; height: 188px" :hidden="imageIsLoading == 'loaded'"></q-skeleton>
    </div>

    <div style="
        text-align: left;
        position: absolute;
   top: 145mm;
        left: 45mm;
        font-size: 22pt;
        font-weight: 500;
      ">
      <b>EMPLOYEE NO.</b>
      {{
        details.empno
          ? `${details.empno.substr(0, 1)}-${details.empno.substr(-4, 4)}`
          : "_ - ____"
      }}
    </div>

    <div :style="`font-size:${textFormat.lastName.font_size * 2.05}px; bottom: ${textFormat.lastName.bottom * 2.15
      }px;
        left: ${textFormat.lastName.left * 2}px; `"
         style="width: 100%; text-align: left; font-weight: 500; position: absolute">
      {{ details.lastName }}{{ details.extName ? ", " + details.extName : "" }}
    </div>
    <div style="width: 100%; text-align: left; font-weight: 700; position: absolute" :style="`font-size:${textFormat.firstName.font_size * 2.05}px; bottom: ${textFormat.firstName.bottom * 2.15
      }px;
        left: ${textFormat.firstName.left * 2}px; `">
      {{ details.firstName }}
      {{ details.middleName ? details.middleName[0] + ". " : "" }}
    </div>
    <!-- position -->
    <div style="
        width: 539px;
        text-align: left;
        font-stretch: ultra-expanded;
        position: absolute;
      " :style="`font-size:${textFormat.position.font_size * 2.05}px; bottom: ${textFormat.position.bottom * 2.23
        }px;
        left: ${textFormat.position.left * 2}px; line-height: ${textFormat.position.line_height * 2
        }px;`">
      {{ details.position }}
    </div>
    <!-- textFormat.horizontalLine -->
    <div :hidden="!details.lastName" style="width: 539px;
        text-align: left; font-stretch: ultra-expanded; position: absolute;"
         :style="`bottom: ${textFormat.horizontalLine.bottom * 2.23}px; left: ${textFormat.horizontalLine.left * 2}px;`">
      <hr style="width: 90%; height: 3px; background-color: black; border: none; margin: 0;">
    </div>
    <!-- department -->
    <div style="
        width: 539px;
        text-align: left;
        font-stretch: ultra-expanded;
        position: absolute;
      " :style="`font-size:${textFormat.department.font_size * 2.05}px; bottom: ${textFormat.department.bottom * 2.23
        }px;
        left: ${textFormat.department.left * 2}px; line-height: ${textFormat.department.line_height * 2
        }px;`">
      {{ details.department }}
    </div>

    <!-- section -->
    <div style="
        width: 539px;
        text-align: left;
        font-stretch: ultra-expanded;
        position: absolute;
      " :style="`font-size:${textFormat.section.font_size * 2.05}px; bottom: ${textFormat.section.bottom * 2.23
        }px;
        left: ${textFormat.section.left * 2}px; line-height: ${textFormat.section.line_height * 2
        }px;`">
      {{ details.section }}
    </div>

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
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
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
