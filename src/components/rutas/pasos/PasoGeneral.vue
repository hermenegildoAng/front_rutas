<template>
  <div class="space-y-4">
    <div v-for="campo in camposGenerales" :key="campo.key">
      <label class="block text-xs font-semibold text-gray-500 mb-1">{{ campo.label }}</label>
      
      <select 
        v-if="campo.opciones" 
        v-model="modelValue[campo.key]" 
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#6b21a8]"
      >
        <option value="">Selecciona</option>
        <option v-for="op in campo.opciones" :key="op" :value="op">{{ op }}</option>
      </select>
      
      <input 
        v-else 
        v-model="modelValue[campo.key]" 
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#6b21a8]"
      />
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1">Duración (minutos)</label>
        <input
          v-model.number="modelValue.duracion_ruta"
          type="number"
          min="1"
          placeholder="Ej. 45"
          class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#6b21a8]"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1">Tarifa Base ($)</label>
        <div class="relative">
          <span class="absolute left-4 top-3.5 text-gray-400 text-sm">$</span>
          <input
            v-model.number="modelValue.tarifa_base"
            type="number"
            step="0.50"
            min="0"
            placeholder="12.00"
            class="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#6b21a8]"
          />
        </div>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-gray-500 mb-1">Divisa / Moneda</label>
      <select 
        v-model="modelValue.moneda" 
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#6b21a8]"
      >
        <option value="MXN">MXN - Peso Mexicano</option>
        
      </select>
    </div>

  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Object, required: true }
})

const camposGenerales = [
  { key: 'folio', label: 'Folio de Ruta' },
  { key: 'nombre_corto', label: 'Nombre Corto (Ej. R-10)' },
  { key: 'nombre_largo', label: 'Nombre Largo (Ej. Huamantla - Centro por Ocotlán)' },
  { key: 'agencia', label: 'Agencia / Concesionario', opciones: ['Movilidad Puebla', 'Tlaxcala Transporte', 'Ruta Urbana'] },
  { key: 'tipo_ruta', label: 'Tipo de Servicio', opciones: ['Autobús', 'combi'] },
]
</script>