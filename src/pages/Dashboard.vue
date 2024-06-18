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
  <q-page
    class="q-pa-md"
    style="background-color: #e8e8e852; position: relative"
  >
    <q-btn color="white" text-color="black" label="Back" to="/"></q-btn>

    <q-select
      clearable
      class="q-ma-md"
      filled
      v-model="selectedDepartment"
      use-input
      input-debounce="0"
      label="Sort by Department"
      :options="selections"
      @filter="filterFn"
      behavior="menu"
      @update:model-value="getIdCardsDataCaptured()"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>

    <template v-for="item in items" :key="item.id">
      <div class="deptCard">
        <h5>{{ `${item.department} (${item.alias})` }}</h5>
        <table style="margin-top: 10px">
          <thead>
            <tr>
              <th>ID#</th>
              <th>Name</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th>Printed at</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="emp in item.employees"
              :key="emp.id"
              :class="getColorStatus(emp)"
            >
              <td>{{ emp.empno }}</td>
              <td>{{ emp.full_name }}</td>
              <td>{{ emp.created_at }}</td>
              <td>{{ emp.updated_at }}</td>
              <td>{{ emp.printed_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
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

defineOptions({
  name: "DashboardPage",
  components: {},

  data: function data() {
    return {
      departments: [],
      selections: [],
      selectedDepartment: null,
      items: [],
    };
  },
  methods: {
    getColorStatus(emp) {
      if (emp.created_at && !emp.printed_at) {
        return "incomplete";
      } else if (emp.created_at && emp.printed_at) {
        return "complete";
      } else return "nacc";
    },
    getIdCardsDataCaptured() {
      this.$api
        .post("http://192.168.50.50:8081/id_card_backend.php", {
          getIdCardsDataCaptured: true,
          selectedDepartment: this.selectedDepartment,
        })
        .then(({ data }) => {
          console.log(data);
          this.items = data;
        });
    },

    async getDepartments() {
      this.$api
        .post("http://192.168.50.50:8081/id_card_backend.php", {
          getDepartments: true,
        })
        .then(({ data }) => {
          console.log("departments: ", data);
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
  created() {},
  mounted() {
    this.getDepartments().then(() => {
      this.getIdCardsDataCaptured();
    });
  },
});
</script>
