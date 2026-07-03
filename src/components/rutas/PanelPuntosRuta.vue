<template>
  <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col max-h-[calc(100vh-280px)]">
    
    <div class="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
      <div>
        <h3 class="font-bold text-sm text-gray-800">Puntos de Ruta</h3>
        <p class="text-xs text-gray-400">{{ modelValue.length }} punto(s)</p>
      </div>
      <div class="flex gap-1">
        <button
          @click="$emit('toggle-modo', 'trazar')"
          :class="modoActivo === 'trazar' ? 'bg-brand text-white' : 'bg-purple-50 text-brand'"
          class="text-xs px-2 py-1.5 rounded-lg transition-all hover:opacity-90 font-medium select-none"
        >
          ✏️ Mapa
        </button>
        <button
          @click="agregarPuntoManual"
          class="text-xs px-2 py-1.5 rounded-lg bg-purple-50 text-brand hover:bg-brand hover:text-white transition-all font-medium select-none"
        >
          + Manual
        </button>
      </div>
    </div>

    <div v-show="listaPuntosVisible" class="flex-1 overflow-y-auto p-3 space-y-2">
      <div 
        v-for="(punto, index) in modelValue" 
        :key="index" 
        class="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-100"
      >
        <span class="w-5 h-5 rounded-full bg-brand text-white text-[10px] flex items-center justify-center font-bold shrink-0">
          {{ index + 1 }}
        </span>
        <div class="flex-1 grid grid-cols-2 gap-1">
          <input 
            v-model="punto.lat" 
            placeholder="Lat" 
            class="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-purple-400 w-full"
          />
          <input 
            v-model="punto.lng" 
            placeholder="Lng" 
            class="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-purple-400 w-full"
          />
        </div>
        <button 
          @click="eliminarPuntoRuta(index)" 
          class="text-gray-300 hover:text-red-400 transition-colors shrink-0 text-sm"
        >
          ✕
        </button>
      </div>
      
      <div v-if="modelValue.length === 0" class="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
        Sin puntos aún.
      </div>
    </div>

    <div class="p-3 border-t border-gray-100 bg-white/50 shrink-0 flex gap-2">
      <button
        @click="$emit('borrar-trazo')"
        class="py-2 px-3 rounded-xl border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors select-none"
      >
        Borrar
      </button>
      <button
        @click="listaPuntosVisible = !listaPuntosVisible"
        class="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 select-none"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2.5" 
          stroke="currentColor" 
          class="w-3.5 h-3.5 transition-transform" 
          :class="listaPuntosVisible ? 'rotate-180' : ''"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
        </svg>
        {{ listaPuntosVisible ? 'Ocultar lista' : 'Mostrar lista' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Recibe los puntos por v-model (modelValue) y el estado del modo activo desde el mapa
const props = defineProps({
  modelValue: { type: Array, required: true },
  modoActivo: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'toggle-modo', 'borrar-trazo'])

const listaPuntosVisible = ref(true)

const agregarPuntoManual = () => {
  const nuevosPuntos = [...props.modelValue, { lat: '', lng: '' }]
  emit('update:modelValue', nuevosPuntos)
}

const eliminarPuntoRuta = (index) => {
  const nuevosPuntos = [...props.modelValue]
  nuevosPuntos.splice(index, 1)
  emit('update:modelValue', nuevosPuntos)
}
</script>