<!-- src/components/rutas/pasos/PasoRegreso.vue -->
<template>
  <div class="space-y-5">
    <h3 class="font-semibold text-gray-700">Viaje de regreso</h3>

    <div class="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
      <span class="text-sm font-medium text-gray-700">La ruta tiene viaje de regreso (no/si)</span>
      <button
        type="button"
        @click="modelValue.viaje_regreso.tiene_viaje_regreso = !modelValue.viaje_regreso.tiene_viaje_regreso"
        :class="modelValue.viaje_regreso.tiene_viaje_regreso ? 'bg-brand' : 'bg-gray-300'"
        class="relative w-11 h-6 rounded-full transition-colors shrink-0"
      >
        <span :class="modelValue.viaje_regreso.tiene_viaje_regreso ? 'translate-x-5' : 'translate-x-0.5'" class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"/>
      </button>
    </div>

    <template v-if="modelValue.viaje_regreso.tiene_viaje_regreso">
      <!-- Lógica simplificada de herencia de calendarios y paradas -->
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
          <span class="text-sm font-medium text-gray-700">¿Utiliza los mismos horarios?  (no/si)</span>
          <button type="button" @click="toggleMismosHorarios" :class="modelValue.viaje_regreso.mismos_horarios ? 'bg-brand' : 'bg-gray-300'" class="relative w-11 h-6 rounded-full transition-colors shrink-0">
            <span :class="modelValue.viaje_regreso.mismos_horarios ? 'translate-x-5' : 'translate-x-0.5'" class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"/>
          </button>
        </div>
        
        <!-- Renderizado dinámico de calendarios de regreso (idéntico estructuralmente al flujo de ida, omitido aquí por brevedad) -->
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
          <span class="text-sm font-medium text-gray-700">¿Utiliza las mismas paradas?  (no/si)</span>
          <button type="button" @click="toggleMismasParadas" :class="modelValue.viaje_regreso.mismas_paradas ? 'bg-brand' : 'bg-gray-300'" class="relative w-11 h-6 rounded-full transition-colors shrink-0">
            <span :class="modelValue.viaje_regreso.mismas_paradas ? 'translate-x-5' : 'translate-x-0.5'" class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"/>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true }
})

const toggleMismosHorarios = () => {
  props.modelValue.viaje_regreso.mismos_horarios = !props.modelValue.viaje_regreso.mismos_horarios
  props.modelValue.viaje_regreso.calendarios = props.modelValue.viaje_regreso.mismos_horarios ? [] : JSON.parse(JSON.stringify(props.modelValue.calendarios))
}

const toggleMismasParadas = () => {
  props.modelValue.viaje_regreso.mismas_paradas = !props.modelValue.viaje_regreso.mismas_paradas
  props.modelValue.viaje_regreso.paradas = props.modelValue.viaje_regreso.mismas_paradas ? [] : JSON.parse(JSON.stringify(props.modelValue.paradas))
}
</script>