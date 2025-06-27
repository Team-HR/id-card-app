<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step :name="1" title="Search Personnel" icon="user" :done="step > 1">
        <q-form @submit.prevent="onSubmit(2)" class="q-gutter-sm">
          <q-select clearable class="q-mb-md" filled v-model="selected_employee_input" use-input input-debounce="0"
                    label="Select Employee" :options="selections" option-value="value" option-label="label"
                    @filter="filterFn" @clear="onClearForm()" @update:model-value="getEmployeeData()" behavior="menu">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="q-ml-xl">
            <pre class="q-ma-none">{{ selected_employee_data.position }}</pre>
            <pre class="q-ma-none">{{ selected_employee_data.position_function }}</pre>
            <pre class="q-ma-none">{{ selected_employee_data.department }}</pre>
          </div>

          <q-stepper-navigation>
            <q-btn :disable="!selected_employee_input" type="submit" color="primary" label="Continue" />
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <q-step :name="2" title="Personal Information" icon="attribution" :done="step > 2">
        <q-form @submit.prevent="onSubmit(3)" class="q-gutter-sm">
          <!-- gender -->
          <!-- <q-select class="col" filled :options="['MALE', 'FEMALE']" label="Gender"
                    v-model="selected_employee_data.gender" /> -->
          <!-- birthdate -->
          <q-input class="col" filled label="Birthdate" type="date" v-model="selected_employee_data.birthdate" />
          <!-- bloodtype -->
          <q-input class="col" filled label="Bloodtype" type="text" v-model="selected_employee_data.blood_type" />
          <!-- contact number          n/a -->
          <q-input class="col" filled label="Contact Number" type="text"
                   v-model="selected_employee_data.contact_number" />
          <q-stepper-navigation>
            <q-btn type="submit" color="primary" label="Continue" />
            <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <q-step :name="3" title="Permanent Address" icon="home" :done="step > 3">
        <q-form @submit.prevent="onSubmit(4)" class="q-gutter-sm">
          <AutocompleteInput input-label="Barangay" v-model="selected_employee_data.address_res_barangay"
                             :suggestions="addressOptions.res_barangays" />
          <div class="row">
            <AutocompleteInput class="col q-mr-sm" input-label="City/Municipality"
                               v-model="selected_employee_data.address_res_city"
                               :suggestions="addressOptions.res_citys" />

            <AutocompleteInput class="col q-mr-sm" input-label="Zipcode"
                               v-model="selected_employee_data.address_res_zip_code"
                               :suggestions="addressOptions.res_zip_codes" />
          </div>
          <AutocompleteInput class="col q-mr-sm" input-label="Province"
                             v-model="selected_employee_data.address_res_province"
                             :suggestions="addressOptions.res_provinces" />
          <q-stepper-navigation>
            <q-btn type="submit" color="primary" label="Continue" />
            <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-form>
      </q-step>


      <q-step :name="4" title="Emergency Contact Information" icon="emergency" :done="step > 4">
        <q-form @submit.prevent="onSubmit(5)" class="q-gutter-sm">
          <div class="row">
            <div class="col">
              <q-input class="q-mb-sm" filled v-model="selected_employee_data.emergency_name"
                       label="Emergency Contact Person" />
              <q-input filled v-model="selected_employee_data.emergency_number" label="Emergency Contact Number" />
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn type="submit" color="primary" label="Finish" />
            <q-btn flat @click="step = 3" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-form>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import AutocompleteInput from "src/components/AutocompleteInput.vue";
// const $q = useQuasar()

defineOptions({
  name: "FormPage",
  components: { AutocompleteInput },
  data: function data() {
    return {
      $q: useQuasar(),
      step: 1,
      departmentOptions: [],
      sectionOptions: [],
      addressOptions: [],
      selected_employee_data: {
        empno: null,
        lastName: null,
        firstName: null,
        middleName: null,
        extName: null,
        position: null,
        position_function: null,
        gender: null,
        birthdate: null,
        blood_type: null,
        contact_number: null,
        address_res_barangay: null,
        address_res_city: null,
        res_zip_codes: null,
        res_provinces: null,
        emergency_name: null,
        emergency_number: null
      },
      selected_employee_input: null,
      employees: [],
      selections: this.employees,
    };
  },
  methods: {

    onClearForm() {
      this.$router.push({ path: `/form` }).then(() => {
        window.location.reload()
      })
    },

    async getEmployeeData() {
      if (!this.selected_employee_input) return;
      await this.$api.post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
        getEmployeeData: true,
        employeeId: this.selected_employee_input.value,
      }).then(({ data }) => {
        this.selected_employee_data = data;
        console.log(this.selected_employee_data);
      })
    },

    onSubmit(step) {
      if (step == 5) {
        console.log(this.selected_employee_input.value);
        console.log(this.selected_employee_data);
        this.$api
          .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
            saveForm: true,
            selected_employee_data: this.selected_employee_data
          })
          .then(({ data }) => {
            this.$q.notify({
              progress: true,
              message: 'Form Submitted!',
              icon: 'save',
              color: 'green',
              timeout: 1500
            })
            setTimeout(() => {
              this.onClearForm()
            }, 2000)

          });
      } else
        this.step = step
    },

    onReset() {

    },
    async getOfficeNamesForAutocomplete() {
      await this.$api
        .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
          getOfficeNamesForAutocomplete: "true",
        })
        .then(({ data }) => {
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
          this.addressOptions = data;
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
    }
  },
  async created() {
    await this.getOfficeNamesForAutocomplete();
    await this.getAddressesForAutocomplete();
    await this.$api
      .post(import.meta.env.VITE_API_URL + "/id_card_backend.php", {
        getEmployeeList: "true",
      })
      .then(({ data }) => {
        this.employees = data;
        // if employee id in route params exists
        // editor is prepopulated for that employee
      })
      .catch((err) => {
        console.error(err);
      });

  },
  mounted() { },
});
</script>
