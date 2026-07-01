<template>
  <div class="space-y-6">
    <!-- encabezao y botones -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
    >
      <div>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider text-brand">
          Rutas Registradas en el Sistema
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">Inventario general</p>
      </div>

      <div class="w-full sm:w-64">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          class="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-gray-900"
        />
      </div>
    </div>




    <!-- contendor -->
    <div class="space-y-4">
      <!-- tabla normal -->
      <div
        class="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider"
            >
              <th class="py-3 px-6">Código / Nombre</th>
              <th class="py-3 px-6">Tipo</th>
              <th class="py-3 px-6">Paradas</th>
              <th class="py-3 px-6">Horario / Frecuencia</th>
              <th class="py-3 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="ruta in rutas" :key="ruta.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6">
                <div class="font-bold text-brand">{{ ruta.codigo }}</div>
                <div class="font-medium text-gray-900 text-xs">{{ ruta.nombre }}</div>
              </td>

              <td class="py-4 px-6 text-xs text-gray-600 font-medium">
                {{ ruta.tipo }}
              </td>

              <td class="py-4 px-6">
                <span
                  class="inline-flex items-center space-x-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium"
                >
                  <MapPinIcon class="w-3 h-3 text-brand" />
                  <span>{{ ruta.paradas }} paradas</span>
                </span>
              </td>

              <td class="py-4 px-6 text-xs text-gray-500">
                <div>🕒 {{ ruta.horario }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Cada {{ ruta.frecuencia }} mins</div>
              </td>

              <!-- accion botones tabla -->
              <td class="py-4 px-6 text-right space-x-2">
                <button
                  @click="$emit('verDetalleRuta', ruta)"
                  class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
                >
                  Ver Detalles
                </button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- cards para fon -->
      <div class="block md:hidden grid grid-cols-1 gap-4">
        <div
          v-for="ruta in rutas"
          :key="'ruta-card-' + ruta.id"
          class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3"
        >
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-extrabold text-brand block uppercase tracking-wide">{{
                ruta.codigo
              }}</span>
              <span class="font-bold text-gray-900 text-sm block mt-0.5">{{ ruta.nombre }}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
              {{ ruta.tipo }}
            </span>
          </div>

          <div
            class="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100"
          >
            <div>
              <span class="text-[10px] text-gray-400 block font-medium">Horario:</span>
              <span>🕒 {{ ruta.horario }}</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-400 block font-medium">Intervalo:</span>
              <span>⏱️ {{ ruta.frecuencia }} mins</span>
            </div>
          </div>

          <!--  accion botones -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-50 gap-2">
            <button
              @click="$emit('verDetalleRuta', ruta)"
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all"
            >
              Ver Detalles
            </button>


          </div>
        </div>
      </div>
    </div>

    <!-- NOTIFICACInnnn -->
    <Transition name="toast">
      <div
        v-if="mostrarToast"
        class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-800 flex items-center space-x-3 z-50"
      >
        <span class="text-green-400 font-bold">🎉</span>
        <div class="text-xs">
          <p class="font-bold">Archivo {{ archivoDescargado }} generado</p>
          <p class="text-gray-400 text-[10px]">Listo para cargar en Google Maps Engine / GTFS</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin as MapPinIcon } from 'lucide-vue-next'

const mostrarToast = ref(false)
const archivoDescargado = ref('')


const rutas = ref([
  {
    id: 1,
    codigo: 'R-01 TRONCAL',
    nombre: 'Centro Histórico - Central de Autobuses',
    tipo: 'Colectivo Urbano',
    paradas: 14,
    horario: '05:30 - 22:30',
    frecuencia: 8,
  },
  {
    id: 2,
    codigo: 'R-12 LINEA B',
    nombre: 'Circuito Periférico Norte - Hospitales',
    tipo: 'Metrobus / BRT',
    paradas: 22,
    horario: '06:00 - 23:00',
    frecuencia: 5,
  },
  {
    id: 3,
    codigo: 'R-25 MARGARITAS',
    nombre: 'Colonia Las Flores - Vía Alterna Express',
    tipo: 'Colectivo Urbano',
    paradas: 9,
    horario: '06:00 - 21:30',
    frecuencia: 12,
  },
  {
    id: 4,
    codigo: 'R-INT-04',
    nombre: 'Zona Metropolitana - Parque Industrial',
    tipo: 'Troncal Intermunicipal',
    paradas: 31,
    horario: '05:00 - 23:30',
    frecuencia: 10,
  },
])


/*
const simularExportacion = (codigoRuta) => {
  archivoDescargado.value = `${codigoRuta.toLowerCase().replace(' ', '_')}_gtfs.json`
  mostrarToast.value = true

  // Ocultar la notificación flotante automáticamente a los 3.5 segundos
  setTimeout(() => {
    mostrarToast.value = false
  }, 3500)
}*/
</script>

<style scoped>

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}


</style>
