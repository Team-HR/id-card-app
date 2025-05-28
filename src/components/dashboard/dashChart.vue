<template>
  <div>
    <div v-if="isLoading">
      <div class="flex flex-center">
        <q-circular-progress indeterminate size="90px" :thickness="0.2" color="green" center-color="blue-3"
                             track-color="transparent" class="q-ma-md" />
      </div>
      <div class="flex flex-center">Charting...</div>
    </div>

    <div class="flex">
      <div style="width: 45%;">
        <canvas id="overallDepartmentChart1"></canvas>
      </div>

      <div style="width: 55%; ">
        <canvas id="overallDepartmentChart2"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { ref, onMounted } from "vue";

const _dashChart1 = ref(null);
const _dashChart2 = ref(null);
const isLoading = ref(true);

defineOptions({
  name: "DashChart",
});

const props = defineProps({
  data: Object,
});

function createChart() {
  console.log("props: ", props.data);
  const ctx1 = document.getElementById("overallDepartmentChart1");
  const ctx2 = document.getElementById("overallDepartmentChart2");
  if (_dashChart1.value || _dashChart2.value) {
    _dashChart1.value.destroy();
    _dashChart2.value.destroy();
  }
  _dashChart1.value = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: props.data.labels.slice(0, 15),
      datasets: [
        {
          label: "% of Employees Completed Inputs",
          data: props.data.values.slice(0, 15),
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  _dashChart2.value = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: props.data.labels.slice(15, 33),
      datasets: [
        {
          label: "% of Employees Completed Inputs",
          data: props.data.values.slice(15, 33),
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  isLoading.value = false
}


onMounted(() => {
  // await createChart()
  isLoading.value = true
  setTimeout(() => {
    createChart()
  }, 1000);
});
</script>
