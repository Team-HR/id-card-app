<template>
  <!-- <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-ma-sm q-gutter-sm" style="min-width: 800px;">
      <q-input dense filled v-model="selected_employee_data.empno" label="ID Number *" />
      <div class="row">
        <q-input class="col" dense filled v-model="selected_employee_data.lastName" label="Last Name" />
        <q-input class="col q-ml-sm" dense filled v-model="selected_employee_data.firstName" label="First Name" />
      </div>
      <div class="row">
        <div class="col">
          <q-input dense filled v-model="selected_employee_data.middleName" label="Middle Name" />
        </div>
        <div class="col q-ml-sm">
          <q-input dense filled v-model="selected_employee_data.extName" label="Name Extension" />
        </div>
      </div>

   <q-input dense filled v-model="selected_employee_data.empno" label="ID Number *" />

      <q-input class="col" dense filled v-model="selected_employee_data.position" label="Position" type="textarea"
               autogrow @keyup.enter.prevent />

      <AutocompleteInput input-label="Section" v-model="selected_employee_data.section" :suggestions="sectionOptions" />
      <AutocompleteInput input-label="Department" v-model="selected_employee_data.department"
                         :suggestions="departmentOptions" />






      <AutocompleteInput input-label="Barangay" v-model="selected_employee_data.address_res_barangay"
                         :suggestions="addressOptions.res_barangays" />
      <div class="row">
        <AutocompleteInput class="col q-mr-sm" input-label="City/Municipality"
                           v-model="selected_employee_data.address_res_city" :suggestions="addressOptions.res_citys" />

        <AutocompleteInput class="col q-mr-sm" input-label="Zipcode"
                           v-model="selected_employee_data.address_res_zip_code"
                           :suggestions="addressOptions.res_zip_codes" />
      </div>
      <AutocompleteInput class="col q-mr-sm" input-label="Province"
                         v-model="selected_employee_data.address_res_province"
                         :suggestions="addressOptions.res_provinces" />








      <div class="row">
        <q-select class="col" dense outlined v-model="selected_employee_data.gender" :options="['MALE', 'FEMALE']"
                  label="Gender" />
        <q-input class="col q-ml-sm" dense filled v-model="selected_employee_data.birthdate" label="Birthdate"
                 type="date" />
      </div>

      <div class="row">
        <q-input class="col" dense filled v-model="selected_employee_data.blood_type" label="Blood Type" />
        <q-input class="col q-ml-sm" dense filled v-model="selected_employee_data.contact_number"
                 label="Contact Number" />
      </div>
      <q-input dense filled v-model="selected_employee_data.emergency_name" label="Emergency Contact Person" />
      <q-input dense filled v-model="selected_employee_data.emergency_number" label="Emergency Contact Number" />
      <div class="q-mt-sm"></div>
      <q-btn class="q-mr-sm" type="submit">Save</q-btn>
      <q-btn label="Download"></q-btn>

    </q-form>
 -->
  <div class="q-pa-md">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step :name="1" title="Search Personnel" icon="user" :done="step > 1">
        <q-form @submit.prevent="onSubmit(2)" class="q-gutter-sm">
          <!-- <div class="row">
            <q-input class="col-4" filled v-model="selected_employee_data.lastName" label="Last Name" />
            <q-input class="col-4 q-ml-sm" filled v-model="selected_employee_data.firstName" label="First Name" />
          </div>
          <div class="row">
            <div class="col-4">
              <q-input filled v-model="selected_employee_data.middleName" label="Middle Name" />
            </div>
            <div class="col-2 q-ml-sm">
              <q-input filled v-model="selected_employee_data.extName" label="Name Extension" />
            </div>
          </div> -->
          <q-select clearable class="q-mb-md" filled v-model="selected_employee_input" use-input input-debounce="0"
                    label="Select Employee" :options="selections" option-value="value" option-label="label"
                    @filter="filterFn" @clear="onClearForm()" @update:model-value="getEmployeeData()" behavior="menu">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-stepper-navigation>
            <q-btn type="submit" color="primary" label="Continue" />
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <q-step :name="2" title="Employment Information" icon="work_outline" :done="step > 2">
        <q-form @submit.prevent="onSubmit(3)" class="q-gutter-sm">
          <!-- <q-input dense filled v-model="selected_employee_data.empno" label="ID Number *" /> -->
          <q-input class="col" filled v-model="selected_employee_data.position" label="Position" type="textarea"
                   autogrow @keyup.enter.prevent />

          <AutocompleteInput input-label="Section" v-model="selected_employee_data.section"
                             :suggestions="sectionOptions" />
          <AutocompleteInput input-label="Department" v-model="selected_employee_data.department"
                             :suggestions="departmentOptions" />

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


      <q-step :name="4" title="Emergency Contact Information" icon="emergency">
        <q-form @submit.prevent="onSubmit(4)" class="q-gutter-sm">
          <div class="row">
            <div class="col-4">
              <q-input class="q-mb-sm" filled v-model="selected_employee_data.emergency_name"
                       label="Emergency Contact Person" />
              <q-input filled v-model="selected_employee_data.emergency_number" label="Emergency Contact Number" />
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn color="primary" label="Finish" />
            <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-form>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import AutocompleteInput from "src/components/AutocompleteInput.vue";


defineOptions({
  name: "FormPage",
  components: { AutocompleteInput },
  data: function data() {
    return {
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
        address: null,
      },
      selected_employee_input: null,
      employees: [],
      selections: this.employees,
    };
  },
  methods: {
    onSubmit(step) {
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
        if (this.id) {
          const itemByValue = this.employees.find(item => item.value == this.id);
          this.selected_employee_input = itemByValue
          this.getEmployeeData();
        }
      })
      .catch((err) => {
        console.error(err);
      });

  },
  mounted() { },
});
</script>
