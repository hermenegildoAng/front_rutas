<template>
  <div class="space-y-6">
    <!-- CONTENEDOR PRINCIPAL -->
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <!-- Encabezado con Filtros Visuales (Para que se vea más pro) -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4"
      >
        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider text-brand">
            Registro Histórico de Operaciones
          </h3>
          <p class="text-xs text-gray-400 mt-0.5">
            Monitoreo de acciones de personal en tiempo real
          </p>
        </div>

        <!-- Filtros estéticos (no funcionales por ahora, sólo diseño) -->
        <div class="flex gap-2">
          <select
            class="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option>Todos los roles</option>
            <option>Súper Usuario</option>
            <option>Capturista</option>
          </select>
          <select
            class="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option>Todas las acciones</option>
            <option>Exportación</option>
            <option>Creación</option>
            <option>Modificación</option>
          </select>
        </div>
      </div>

      <!-- DISEÑO DE LÍNEA DE TIEMPO (TIMELINE) -->
      <div class="mt-8 relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
        <div
          v-for="registro in logs"
          :key="registro.id"
          class="relative pl-6 transition-all hover:translate-x-1 duration-200"
        >
          <!-- Puntito indicador en la línea de tiempo con color según la acción -->
          <span
            :class="colorIndicador(registro.accionTipo)"
            class="absolute -left-[7px] top-1.5 block w-3 h-3 rounded-full ring-4 ring-white"
          ></span>

          <!-- Tarjeta del registro -->
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100"
          >
            <div class="space-y-1">
              <!-- Acción principal -->
              <p class="text-sm text-gray-900 font-medium">
                <span class="font-bold text-gray-950">{{ registro.usuario }}</span>
                {{ registro.descripcion }}
              </p>

              <!-- Detalles extras opcionales (Ruta afectada, ID, etc) -->
              <p
                v-if="registro.detalles"
                class="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-100 inline-block"
              >
                {{ registro.detalles }}
              </p>
            </div>

            <!-- Fecha y Hora a la derecha -->
            <div class="text-left sm:text-right shrink-0">
              <span class="text-xs font-semibold text-gray-400 block">{{ registro.fecha }}</span>
              <span class="text-[11px] text-gray-400 block">{{ registro.hora }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock Data: Historial simulado detallando acciones del Súper y Capturistas
const logs = ref([
  {
    id: 1,
    usuario: 'Ing. Alejandro H. (Súper)',
    descripcion:
      'exportó la ruta "Línea 1 - Troncal Centro" al formato final de Google Maps (GTFS/KML).',
    detalles: 'Archivo generado: ruta_l1_troncal_20260518.json',
    accionTipo: 'exportar',
    fecha: '18/May/2026',
    hora: '16:45',
  },
  {
    id: 2,
    usuario: 'Sria. Beatriz M. (Capturista)',
    descripcion: 'finalizó y guardó el trazado de una nueva ruta en el mapa.',
    detalles: 'Ruta: R-25 Margaritas - Vía Alterna',
    accionTipo: 'crear',
    fecha: '18/May/2026',
    hora: '15:20',
  },
  {
    id: 3,
    usuario: 'Ing. Alejandro H. (Súper)',
    descripcion:
      'desactivó el acceso al sistema al usuario "Mtra. Elena Ruiz" por baja administrativa.',
    detalles: 'ID Usuario afectado: #0482',
    accionTipo: 'eliminar',
    fecha: '18/May/2026',
    hora: '11:10',
  },
  {
    id: 4,
    usuario: 'Lic. Fernando G. (Capturista)',
    descripcion: 'modificó los horarios y agregando 3 paradas manuales en la ruta existente.',
    detalles: 'Ruta: Circuito Periférico Sur',
    accionTipo: 'editar',
    fecha: '17/May/2026',
    hora: '18:02',
  },
  {
    id: 5,
    usuario: 'Ing. Alejandro H. (Súper)',
    descripcion: 'creó y dio de alta un nuevo usuario capturista en la plataforma.',
    detalles: 'Nuevo usuario: Lic. Fernando G. (fernando.cap2@gob.mx)',
    accionTipo: 'crear',
    fecha: '17/May/2026',
    hora: '09:30',
  },
])

// Función para asignar colores al puntito de la línea de tiempo según la gravedad o tipo de acción
const colorIndicador = (tipo) => {
  if (tipo === 'crear') return 'bg-blue-500' // Azul para cosas nuevas
  if (tipo === 'exportar') return 'bg-purple-600' // Morado (nuestro color) para exportaciones
  if (tipo === 'editar') return 'bg-amber-500' // Amarillo para modificaciones
  if (tipo === 'eliminar') return 'bg-red-500' // Rojo para bajas o desactivaciones
  return 'bg-gray-400'
}
</script>
