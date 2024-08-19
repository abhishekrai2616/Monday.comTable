<template>
  <div class="my-24">
    <h1 class="text-2xl mb-4 sm:w-2/3 sm:mx-auto">Monday.com</h1>
    <div v-if="user">
      <DynamicTable />
    </div>
  </div>
</template>

<script setup>
const { loginApiKey } = useRealmApp();
let user = ref(false)
onMounted(async () => {
   await loginApiKey();
   user.value=true;
});

</script>
