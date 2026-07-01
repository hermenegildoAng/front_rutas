<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- 📋 COLUMNA IZQUIERDA: FORMULARIO DE REGISTRO -->
    <!-- Ponemos el v-if aquí afuera para que desaparezca por completo el contenedor entero si es admin -->
    <div
      v-if="rol !== 'super'"
      class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 h-fit"
    >
      <div>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider text-brand">
          Nueva Agencia GTFS
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">Identificación oficial de la empresa operadora</p>
      </div>

      <form @submit.prevent="agregarAgencia" class="space-y-4">
        <!-- agency_id -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1"
            >ID de la Agencia (agency_id)</label
          >
          <input
            v-model="nuevaAgencia.agency_id"
            type="text"
            placeholder="Ej. JAL-TRANSIT"
            class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-gray-900 font-mono"
            required
          />
        </div>

        <!-- agency_name -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1"
            >Nombre Público (agency_name)</label
          >
          <input
            v-model="nuevaAgencia.agency_name"
            type="text"
            placeholder="Ej. Alianza de Camioneros S.A."
            class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-gray-900"
            required
          />
        </div>

        <!-- agency_url -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1"
            >Sitio Web (agency_url)</label
          >
          <input
            v-model="nuevaAgencia.agency_url"
            type="url"
            placeholder="https://www.tuagencia.com"
            class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-gray-900"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- agency_timezone -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Zona Horaria</label>
            <select
              v-model="nuevaAgencia.agency_timezone"
              class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-gray-900 text-xs"
            >
              <option value="America/Mexico_City">CDMX (Central)</option>
              <option value="America/Monterrey">Monterrey</option>
              <option value="America/Tijuana">Tijuana</option>
              <option value="America/Bogota">Bogotá</option>
            </select>
          </div>

          <!-- agency_lang -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Idioma (lang)</label>
            <select
              v-model="nuevaAgencia.agency_lang"
              class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-gray-900 text-xs"
            >
              <option value="es">Español (es)</option>
              <option value="en">English (en)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-sm pt-2"
        >
          + Registrar Operadora
        </button>
      </form>
    </div>

    <!-- 📊 COLUMNA DERECHA: LISTADO DE AGENCIAS -->
    <div
      :class="[
        'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 w-full',
        rol && rol.toLowerCase() === 'super' ? 'lg:col-span-3' : 'lg:col-span-2',
      ]"
    >
      <div>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-700">
          Operadoras Activas
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">Agencias enlazables al motor de rutas generales</p>
      </div>

      <!-- 💡 Asegúrate de que este div tenga la clase w-full -->
      <div class="overflow-x-auto border border-gray-100 rounded-xl w-full">
        <table class="w-full text-left border-collapse table-auto">
          <thead>
            <tr
              class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider"
            >
              <th class="py-3 px-4">ID / Nombre</th>
              <th class="py-3 px-4">URL</th>
              <th class="py-3 px-4">Zona horaria / lenguaje</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
            <tr
              v-for="agencia in agencias"
              :key="agencia.agency_id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 px-4 whitespace-nowrap">
                <span
                  class="font-mono font-bold text-brand bg-purple-50 px-1.5 py-0.5 rounded text-[10px] block w-fit mb-0.5"
                  >{{ agencia.agency_id }}</span
                >
                <span class="font-bold text-gray-900 text-sm">{{ agencia.agency_name }}</span>
              </td>
              <td class="py-3 px-4 text-blue-600 hover:underline font-medium break-all">
                <a :href="agencia.agency_url" target="_blank">{{ agencia.agency_url }}</a>
              </td>
              <td class="py-3 px-4 text-gray-500 space-y-0.5 whitespace-nowrap">
                <div>🌐 {{ agencia.agency_timezone }}</div>
                <div class="text-[10px] uppercase font-bold text-gray-400">
                  Idioma: {{ agencia.agency_lang }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 👇 Recibimos el rol actual desde el Dashboard
defineProps({
  rol: String,
})

const agencias = ref([
  {
    agency_id: 'GDA-URBANO-01',
    agency_name: 'Sutusa de Occidente',
    agency_url: 'https://www.sutusa-transit.mx',
    agency_timezone: 'America/Mexico_City',
    agency_lang: 'es',
  },
  {
    agency_id: 'METROBUS-OAX',
    agency_name: 'CityBus Colectivos',
    agency_url: 'https://www.citybus-oaxaca.gob.mx',
    agency_timezone: 'America/Mexico_City',
    agency_lang: 'es',
  },
])

const nuevaAgencia = ref({
  agency_id: '',
  agency_name: '',
  agency_url: '',
  agency_timezone: 'America/Mexico_City',
  agency_lang: 'es',
})

const agregarAgencia = () => {
  agencias.value.push({ ...nuevaAgencia.value })
  nuevaAgencia.value = {
    agency_id: '',
    agency_name: '',
    agency_url: '',
    agency_timezone: 'America/Mexico_City',
    agency_lang: 'es',
  }
}
</script>
