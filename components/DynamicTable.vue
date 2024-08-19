<template>
  <div>
    <div class="overflow-x-auto sm:w-2/3 sm:mx-auto">
      <div class="relative">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="sticky left-0 min-w-[120px] s:min-w-[200px] h-8 font-normal bg-gray-50"></th>
              <th class="s:min-w-[150px] min-w-[120px] h-8 font-normal">Urgency</th>
              <th class="s:min-w-[80px] min-w-[120px] h-8 font-normal">Requester</th>
              <th class="s:min-w-[80px] min-w-[120px] h-8 font-normal">Solved By</th>
              <th class="s:min-w-[150px] min-w-[120px] h-8 font-normal">Status</th>
              <th class="s:min-w-[150px] min-w-[120px] h-8 font-normal">Timeline</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <template v-if="row.Task !== 'Add Row'">
                <td class="sticky left-0 bg-gray-50 h-8 min-w-[200px]">
                  <div class="grid grid-cols-[1fr_20fr_1fr]">
                    <div class="bg-blue-400 w-1 h-9">

                    </div>
                    <div 
                      contenteditable="true" 
                      @blur="updateTask(rowIndex, $event)"
                      @keypress.enter.stop="updateTask(rowIndex, $event)"
                      class="outline-none cursor-text pl-5 min-w-[100px] max-w-[150px] h-8 pt-1 truncate text-ellipsis"
                      :data-placeholder="'Task Name'"
                    >{{ row?.Task || '' }}</div>
                    <button @click="openMessagePopup(rowIndex)" class="cursor-pointer">
                      <span class="text-blue-500">🗨️</span> 
                    </button>
                  </div>
                </td>
                <td class="border relative h-8 bg-gray-50">
                  <button
                    class="w-full h-9 text-left cursor-pointer text-center"
                    @click="toggleUrgencyPopup(rowIndex)"
                    :class="{
                      'bg-red-500 text-white': row.urgency === 'Urgent',
                      'bg-purple-500 text-white': row.urgency === 'Normal',
                      'bg-green-500 text-white': row.urgency === 'Low',
                    }"
                  >
                    {{ row?.urgency || '' }}
                  </button>
                  <div v-if="isUrgencyPopupVisible(rowIndex)" class="absolute left-0 z-10 w-full bg-white">
                    <ul class="p-2">
                      <li 
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        @click="setUrgency(rowIndex, 'Urgent')"
                      >
                        Urgent
                      </li>
                      <li 
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        @click="setUrgency(rowIndex, 'Normal')"
                      >
                        Normal
                      </li>
                      <li 
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        @click="setUrgency(rowIndex, 'Low')"
                      >
                        Low
                      </li>
                    </ul>
                  </div>
                </td>
                <td class="bg-gray-50 h-8 border">
                  <div class="flex items-center justify-center h-full">
                    <img 
                      v-if="row.requester && validateEmail(row.requester)" 
                      src="https://via.placeholder.com/40" 
                      alt="Requester Profile" 
                      class="w-8 h-8 rounded-full cursor-pointer"
                      @click="openEmailPopup(rowIndex, 'requester')"
                    />
                    <div 
                      v-else
                      class="min-h-[2rem] px-2 py-1 outline-none cursor-pointer focus:bg-gray-100" 
                      @click="openEmailPopup(rowIndex, 'requester')"
                      :data-placeholder="'Requester Email'"
                    >
                      {{ row.requester ? 'User Profile' : '   +   ' }}
                    </div>
                  </div>
                </td>
                <td class="bg-gray-50 h-8 border">
                  <div class="flex items-center justify-center h-8">
                    <img 
                      v-if="row.solvedBy && validateEmail(row.solvedBy)" 
                      src="https://via.placeholder.com/40" 
                      alt="Solved By Profile" 
                      class="w-8 h-8 rounded-full cursor-pointer"
                      @click="openEmailPopup(rowIndex, 'solvedBy')"
                    />
                    <div 
                      v-else
                      class="min-h-[2rem] px-2 py-1 outline-none cursor-pointer focus:bg-gray-100" 
                      @click="openEmailPopup(rowIndex, 'solvedBy')"
                      :data-placeholder="'Solved By Email'"
                    >
                      {{ row.solvedBy ? 'User Profile' : '   +   ' }}
                    </div>
                  </div>
                </td>
                <td class="border relative h-8 bg-gray-50">
                  <button
                    class="w-full h-9 text-left cursor-pointer text-center"
                    @click="toggleStatusPopup(rowIndex)"
                    :class="{
                      'bg-red-500 text-white': row.status === 'Pending',
                      'bg-purple-500 text-white': row.status === 'Working',
                      'bg-green-500 text-white': row.status === 'Done',
                    }"
                  >
                    {{ row.status || '' }}
                  </button>
                  <div v-if="isStatusPopupVisible(rowIndex)" class="absolute left-0 z-10 w-full bg-white">
                    <ul class="p-2">
                      <li 
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        @click="setStatus(rowIndex, 'Pending')"
                      >
                        Pending
                      </li>
                      <li 
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        @click="setStatus(rowIndex, 'Working')"
                      >
                        Working
                      </li>
                      <li 
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        @click="setStatus(rowIndex, 'Done')"
                      >
                        Done
                      </li>
                    </ul>
                  </div>
                </td>
                <td class="border relative h-8 bg-gray-50">
                  <input 
                    type="date" 
                    v-model="row.timeline" 
                    @blur="updateTimeline($event,rowIndex)"
                    class="w-full bg-gray-50 rounded px-4"
                    :class="{'text-transparent': !row.timeline,'text-black': row.timeline}"
                    required
                  />
                </td>
                <td class="bg-gray-50 h-8 min-w-24 border text-center">
                  <button @click="removeRow(rowIndex)" class="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 6h18v2H3V6zm2 2h14l-1 14H6L5 8zm7-7c-1.104 0-2 .896-2 2H6v2h12V3h-4c0-1.104-.896-2-2-2zm0 2c.553 0 1-.447 1-1s-.447-1-1-1-1 .447-1 1 .447 1 1 1z"/>
                    </svg>
                  </button>
                </td>
              </template>
              <template v-else>
                <td class="sticky left-0 bg-white border h-8 min-w-[200px]">
                    <div class="flex">
                    <div class="bg-blue-400 w-1 h-8">

                    </div>
                    <button @click="addRow" class="rounded h-8 font-extralight text-slate-400 pl-5">+ Add</button>
                  </div>
                </td>
                <td colspan="5" class="border"></td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Popup for Requester and Solved By Emails -->
    <div v-if="emailPopupVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-lg font-semibold mb-4">
          {{ emailPopupType === 'requester' ? 'Enter Requester Email' : 'Enter Solved By Email' }}
        </h3>
        <input 
          type="text" 
          v-model="currentEmail" 
          @input="validateCurrentEmail" 
          class="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Enter email"
        />
        <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
        <div class="flex justify-end mt-4">
          <button @click="closeEmailPopup" class="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
          <button @click="saveEmail" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
        </div>
      </div>
    </div>
<!-- Popup for Messages -->
<div v-if="messagePopupVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-full">
    <!-- Editable Task Name -->
    <div 
      contenteditable="true" 
      @blur="updateTaskInPopup"
      @keypress.enter.stop="updateTaskInPopup"
      class="text-lg font-semibold mb-4 whitespace-pre-wrap break-words outline-none border border-gray-300 p-2"
      :data-placeholder="'Task Name'"
    >
      {{ rows[currentRowIndex]?.Task || 'Task' }}
    </div>
    
    <!-- Message Input and List -->
    <div class="mb-4">
      <textarea
        v-model="newMessage"
        placeholder="Add a message"
        class="w-full p-2 border border-gray-300 rounded"
      ></textarea>
      <div class="mt-2">
        <ul>
          <li v-for="(msg, index) in rows[currentRowIndex]?.messages || []" :key="index" class="p-2 border-b">
            {{ msg }}
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Buttons -->
    <div class="flex justify-end mt-4">
      <button @click="closeMessagePopup" class="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
      <button @click="() => saveMessage(currentRowIndex)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
    </div>
  </div>
</div>


  </div>

</template>

<script setup>
import { useRealmApp } from '../composables/dynamicTables';

const rows = ref([
  { Task: 'Add Row', urgency: '', requester: '', solvedBy: '', status: '', timeline: '', messages: [] }
]);

const showPopupUrgency = ref(null);
const showPopupStatus = ref(null);
const emailPopupVisible = ref(false);
const emailPopupType = ref('');
const currentRowIndex = ref(null);
const currentEmail = ref('');
const emailError = ref('');
const messagePopupVisible = ref(false);
const newMessage = ref('');

const { addDocument, updateDocument, findDocuments, deleteDocument} = useRealmApp();
const dbName = 'todo';
const collectionName = 'todos';

const fetchRows = async () => {
  const dbRows = await findDocuments(dbName, collectionName,{});
  rows.value = [...dbRows, { Task: 'Add Row', urgency: '', requester: '', solvedBy: '', status: '', timeline: '', messages: [] }];
};
fetchRows();

const addRow = async () => {
  const newRow = { Task: `Task ${rows.value.length}`, urgency: '', requester: '', solvedBy: '', status: '', timeline: '', messages: [] };
  const insertedId = await addDocument(dbName, collectionName, newRow);
  newRow._id = insertedId;
  rows.value.push(newRow);
  const lastIndex = rows.value.length - 1;
  const secondLastIndex = rows.value.length - 2;
  [rows.value[secondLastIndex], rows.value[lastIndex]] = [rows.value[lastIndex], rows.value[secondLastIndex]];
};

const updateCell = async (rowIndex, key, event) => {
  const updatedValue = event.target.innerText;
  const row = rows.value[rowIndex];
  row[key] = updatedValue;

  const query = { _id: row._id };
  const update = { [key]: updatedValue };

  await updateDocument(dbName, collectionName, query, update);
};

const updateTaskInPopup = async (event) => {
  const taskName = event.target.innerText.trim();
  if (taskName) {
    const row = rows.value[currentRowIndex.value];
    row.Task = taskName;

    const query = { _id: row._id };
    const update = { Task: taskName };

    await updateDocument(dbName, collectionName, query, update);
  }
};

const toggleUrgencyPopup = (rowIndex) => {
  showPopupUrgency.value = showPopupUrgency.value === rowIndex ? null : rowIndex;
};

const isUrgencyPopupVisible = (rowIndex) => {
  return showPopupUrgency.value === rowIndex;
};

const setUrgency = async (rowIndex, urgency) => {
  const row = rows.value[rowIndex];
  row.urgency = urgency;

  const query = { _id: row._id };
  const update = { urgency };

  await updateDocument(dbName, collectionName, query, update);
  showPopupUrgency.value = null;
};

const toggleStatusPopup = (rowIndex) => {
  showPopupStatus.value = showPopupStatus.value === rowIndex ? null : rowIndex;
};

// Check if status popup should be visible
const isStatusPopupVisible = (rowIndex) => {
  return showPopupStatus.value === rowIndex;
};

// Set status value and sync with MongoDB
const setStatus = async (rowIndex, status) => {
  const row = rows.value[rowIndex];
  row.status = status;

  const query = { _id: row._id };
  const update = { status };

  await updateDocument(dbName, collectionName, query, update);
  showPopupStatus.value = null;
};

const openMessagePopup = (rowIndex) => {
  currentRowIndex.value = rowIndex;
  messagePopupVisible.value = true;
};

const closeMessagePopup = () => {
  messagePopupVisible.value = false;
  newMessage.value = ''; 
};

const saveMessage = async (rowIndex) => {
  if (newMessage.value.trim()) {
    const row = rows.value[rowIndex];
    row.messages.push(newMessage.value.trim());

    const query = { _id: row._id };
    const update = { messages: row.messages };

    await updateDocument(dbName, collectionName, query, update);
    newMessage.value = ''; 
    closeMessagePopup();
  }
};

const openEmailPopup = (rowIndex, type) => {
  currentRowIndex.value = rowIndex;
  emailPopupType.value = type;
  currentEmail.value = type === 'requester' ? rows.value[rowIndex].requester || '' : rows.value[rowIndex].solvedBy || '';
  emailPopupVisible.value = true;
};

const closeEmailPopup = () => {
  emailPopupVisible.value = false;
  emailError.value = '';
};

const saveEmail = async () => {
  if (validateEmail(currentEmail.value)) {
    const row = rows.value[currentRowIndex.value];
    if (emailPopupType.value === 'requester') {
      row.requester = currentEmail.value;
    } else {
      row.solvedBy = currentEmail.value;
    }

    const query = { _id: row._id };
    const update = { [emailPopupType.value]: currentEmail.value };

    await updateDocument(dbName, collectionName, query, update);
    emailPopupVisible.value = false;
  } else {
    emailError.value = 'Invalid email address';
  }
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const updateTimeline = async (event,index) => {
  const row = rows.value[index];
  const updatedValue = event.target.value;
  console.log(row)
  try {
    await useRealmApp().updateDocument(dbName, collectionName, { _id: row._id }, { timeline: updatedValue });
  } catch (error) {
    console.error("Error updating database:", error);
  }
};

const removeRow = async (index) => {
  const row = rows.value[index];
  console.log(row)
  if (row._id) {
    const query = { _id: row._id };
    console.log(query);
    await deleteDocument(dbName, collectionName, query);
  }
  rows.value.splice(index, 1);
};
</script>
