<style>
table {
  border: 1px solid #aaaaaa;
  border-collapse: collapse;
}

tr,
th,
td {
  border: 1px solid #aaaaaa;
  padding: 5px;
}
</style>

<template>
  <q-page class="q-pa-md" style="background-color: #e8e8e852; position: relative">
    <q-btn color="white" text-color="black" label="Back" to="/"></q-btn>
    <q-select clearable class="q-ma-md" filled v-model="selectedDepartment" use-input input-debounce="0"
              label="Sort by Department" :options="selections" @filter="filterFn" behavior="menu"
              @update:model-value="getIdCardsDataCaptured()">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div v-if="selectedDepartment">
      <template v-for="item in rows" :key="item.id">
        <div class="deptCard">
          <h4>{{ `${item.department} (${item.alias})` }}</h4>
          <!-- <q-linear-progress size="50px" :value="item.perentageCompletion / 100" color="green" class="q-my-md">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="green"
                       :label="`${item.perentageCompletion}% (${item.totalAccomplishedEmployee}/${item.totalDepartmentEmployee})`" />
            </div>
          </q-linear-progress> -->

          <q-linear-progress size="50px" :value="item.totalAccomplishedInputs / item.totalRequiredInputs" color="green"
                             class="q-my-md">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="green"
                       :label="`${item.perentageCompletionInputs}% (${item.totalAccomplishedInputs}/${item.totalRequiredInputs})`" />
            </div>
          </q-linear-progress>

          <!-- {{ item.employees }} -->
          <q-table :rows-per-page-options="[0, 5, 10, 15]" flat :rows="item.employees" :columns="columns"
                   :row-key="(row) => row.empno" selection="multiple" v-model:selected="selected"
                   :selected-rows-label="getSelectedString" @update:selected="onUpdateSelected">
            <template v-slot:body-selection="scope">
              <!-- {{ scope.row.hasIdCard }} -->
              <q-checkbox v-model="scope.selected" @update:model-value="scope.select"
                          v-if="isRowSelectable(scope.row)"></q-checkbox>
              <div v-else style="text-align: center">
                <q-icon name="no_photography" color="grey" />
              </div>
            </template>
            <template v-slot:body-cell-full_name="props">
              <q-td :props="props">
                <!-- Customize the display here -->
                <a :href="`http://192.168.50.50:9099/#/` + props.row.employees_id" target="_blank"
                   class="text-bold text-primary">{{
                    props.row.full_name }}</a>
              </q-td>
            </template>

          </q-table>
        </div>
      </template>
    </div>
    <div v-else>
      <DashChart :data="dashChartData" />
      <!-- <template v-for="item in rows" :key="item.id">
        <div class="q-my-lg">
          <span>{{ `${item.department} (${item.alias})` }}</span>
          <q-linear-progress
            size="20px"
            :value="item.perentageCompletion / 100"
            color="green"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="green"
                :label="`${item.perentageCompletion}% (${item.totalAccomplishedEmployee}/${item.totalDepartmentEmployee})`"
              />
            </div>
          </q-linear-progress>
        </div>
      </template> -->
    </div>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <!-- <q-btn fab icon="add" color="accent" /> -->
      <q-fab v-if="countSelected > 0" v-model="fab1" :label="`Selected: ${countSelected}`" label-position="left"
             color="purple" icon="keyboard_arrow_right" direction="right">
        <q-fab-action color="primary" @click="unselectAll" icon="cancel" label="Unselect All" />
        <q-fab-action color="secondary" @click="printSelected" icon="download" label="Download Selected" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<style>
h5 {
  margin-top: 2px;
  margin-bottom: 2px;
}

.deptCard {
  border: 1px solid grey;
  margin: 30px;
  padding: 50px;
  padding-top: 20px;
  border-radius: 20px;
  background-color: white;
}

.incomplete {
  background-color: #fcff527a;
}

.complete {
  background-color: #7aff527a;
}

.nacc {
  background-color: #d6d6d67a;
}
</style>

<script setup>
import { useQuasar } from "quasar";
import DashChart from "components/dashboard/dashChart.vue";

defineOptions({
  name: "DashboardPage",
  components: { DashChart },

  data: function data() {
    return {
      dashChartData: {},
      columns: [
        {
          name: "desc",
          required: true,
          label: "ID No.",
          align: "left",
          field: (row) => row.empno,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "full_name",
          align: "left",
          label: "Name",
          field: "full_name",
          sortable: true,
        },

        {
          name: "percentageCompletion",
          align: "left",
          label: "Details Completed",
          field: "percentageCompletion",
          sortable: true,
        },

        {
          name: "created_at",
          align: "left",
          label: "Created at",
          field: "created_at",
          sortable: true,
        },
        {
          name: "updated_at",
          align: "left",
          label: "Updated at",
          field: "updated_at",
          sortable: true,
        },
        {
          name: "printed_at",
          align: "left",
          label: "Printed at",
          field: "printed_at",
          sortable: true,
        },

        // Details Completed	Created at	Updated at	Printed at
      ],
      selected: [],
      fab1: false,
      selections: [],
      departments: [],
      selectedDepartment: null,
      rows: [],
    };
  },
  methods: {
    isRowSelectable(row) {
      return row.hasIdCard && row.completionRating >= 100;
    },

    onUpdateSelected(newSelection) {
      // Filter out rows that should not be selectable
      this.selected = newSelection.filter(this.isRowSelectable);
    },

    unselectAll() {
      this.selected = [];
    },
    printSelected() {
      const employeeIds = this.selected.map((e) => e.employees_id).join(",");
      const departmentId = this.selectedDepartment.value;
      var link = document.createElement("a");
      link.href =
        import.meta.env.VITE_API_URL +
        "/id_card_print_pdf.php?employeeIds=" +
        employeeIds +
        "&departmentId=" +
        departmentId;
      link.click();
    },
    getSelectedString() {
      // return this.selected.length;
      return this.selected.length === 0
        ? ""
        : `Selected ${this.selected.length} ID${this.selected.length > 1 ? "s" : ""} `;
      // selected of ${this.rows.length}
    },

    getColorStatus(emp) {
      if (emp.created_at && !emp.printed_at) {
        return "incomplete";
      } else if (emp.created_at && emp.printed_at) {
        return "complete";
      } else return "nacc";
    },
    getIdCardsDataCaptured() {
      this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          getIdCardsDataCaptured: true,
          selectedDepartment: this.selectedDepartment,
        })
        .then(({ data }) => {
          this.rows = data.rows;
          this.dashChartData = data.dashChartData;
          // console.log("getIdCardsDataCaptured: ", data);
        });
    },

    async getDepartments() {
      this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          getDepartments: true,
        })
        .then(({ data }) => {
          // console.log("departments: ", data);
          this.departments = data;
          // this.list = data.all;
        });
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.selections = this.departments;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.selections = this.departments.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
  computed: {
    countSelected() {
      return this.selected.length;
    },
  },
  mounted() {
    this.getDepartments().then(() => {
      this.getIdCardsDataCaptured();
    });
  },
});
</script>
