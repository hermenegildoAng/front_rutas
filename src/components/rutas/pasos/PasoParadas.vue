<!-- src/components/rutas/pasos/PasoParadas.vue -->
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between sticky top-0 z-10 bg-white/95 py-2 border-b border-gray-50">
      <h3 class="font-semibold text-gray-700">Paradas</h3>
      <div class="flex gap-2">
        <button 
          @click="$emit('toggle-modo', 'parada')" 
          :class="modoActivo === 'parada' ? 'bg-brand text-white' : 'bg-purple-50 text-brand'"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm hover:opacity-90 shadow-sm transition-all select-none"
        >
          <MapPin class="w-3 h-3"/> En mapa
        </button>
        <button @click="agregarParadaManual" class="px-3 py-2 rounded-xl bg-purple-50 text-brand text-sm hover:bg-brand hover:text-white shadow-sm select-none">+ Manual</button>
      </div>
    </div>

    <div class="space-y-4 pt-2">
      <div v-for="(parada, index) in modelValue.paradas" :key="index" class="relative border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-4 pt-10">
        <button @click="eliminarParada(index)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 text-sm font-medium">✕ Eliminar</button>
        
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">{{ parada.orden_parada }}</span>
          <h4 class="font-semibold text-sm text-gray-700">Parada #{{ parada.orden_parada }}</h4>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">Folio Parada</label>
          <input v-model="parada.folio_parada" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">Nombre Parada</label>
          <input v-model="parada.nombre_parada" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Latitud</label>
            <input v-model="parada.latitud" @input="$emit('actualizar-mapa')" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Longitud</label>
            <input v-model="parada.longitud" @input="$emit('actualizar-mapa')" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="modelValue.paradas.length === 0" class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">No hay paradas. Usa "En mapa" o "+ Manual".</div>
  </div>
</template>

<script setup>
import { MapPin } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Object, required: true },
  modoActivo: { type: String, default: null }
})

const emit = defineEmits(['toggle-modo', 'actualizar-mapa'])

const agregarParadaManual = () => {
  const orden = props.modelValue.paradas.length + 1
  props.modelValue.paradas.push({ folio_parada: '', nombre_parada: `Parada ${orden}`, latitud: '', longitud: '', orden_parada: orden })
}

const eliminarParada = (index) => {
  props.modelValue.paradas.splice(index, 1)
  props.modelValue.paradas.forEach((p, i) => { p.orden_parada = i + 1 })
  emit('actualizar-mapa')
}
</script>