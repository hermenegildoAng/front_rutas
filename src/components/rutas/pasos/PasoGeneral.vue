<!-- src/components/rutas/pasos/PasoGeneral.vue -->
<template>
  <div class="space-y-4">
    <div v-for="campo in camposGenerales" :key="campo.key">
      <label class="block text-xs font-semibold text-gray-500 mb-1">{{ campo.label }}</label>
      
      <select 
        v-if="campo.opciones" 
        v-model="modelValue[campo.key]" 
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Selecciona</option>
        <option v-for="op in campo.opciones" :key="op" :value="op">{{ op }}</option>
      </select>
      
      <input 
        v-else 
        v-model="modelValue[campo.key]" 
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
    
    <div>
      <label class="block text-xs font-semibold text-gray-500 mb-1">Duración de ruta (minutos)</label>
      <input
        v-model.number="modelValue.duracion_ruta"
        type="number"
        min="1"
        placeholder="Ej. 45"
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Object, required: true }
})

const camposGenerales = [
  { key: 'folio', label: 'Folio' },
  { key: 'nombre_corto', label: 'Nombre Corto' },
  { key: 'nombre_largo', label: 'Nombre Largo' },
  { key: 'agencia', label: 'Agencia', opciones: ['Movilidad Puebla', 'Tlaxcala Transporte', 'Ruta Urbana'] },
  { key: 'tipo_ruta', label: 'Tipo Ruta', opciones: ['Autobús', 'combi'] },
]
</script>