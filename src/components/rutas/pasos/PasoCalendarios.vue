<!-- src/components/rutas/pasos/PasoCalendarios.vue -->
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between sticky top-0 z-10 bg-white/95 py-2 border-b border-gray-50">
      <h3 class="font-semibold text-gray-700">Horarios</h3>
      <button @click="agregarCalendario" class="px-3 py-2 rounded-xl bg-brand text-white text-sm hover:opacity-90 shadow-sm">+ Agregar horario</button>
    </div>
    
    <div class="space-y-5 pt-2">
      <div v-for="(cal, calIndex) in modelValue.calendarios" :key="calIndex" class="relative border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden">
        
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">{{ calIndex + 1 }}</span>
            <input v-model="cal.nombre" placeholder="Nombre del horario (ej. Entre semana)" class="text-sm font-semibold text-gray-700 bg-transparent border-b border-dashed border-gray-300 outline-none focus:border-brand px-1 py-0.5 w-48"/>
          </div>
          <button @click="eliminarCalendario(calIndex)" class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">✕ Eliminar</button>
        </div>

        <div class="px-4 pb-3 grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Fecha Inicial</label>
            <input type="date" v-model="cal.fecha_inicial" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Fecha Final</label>
            <input type="date" v-model="cal.fecha_final" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
        </div>

        <div class="px-4 pb-3">
          <label class="block text-xs font-semibold text-gray-500 mb-2">¿Qué días aplica?</label>
          <div class="flex flex-wrap gap-1">
            <button 
              v-for="dia in diasSemana" 
              :key="dia.key" 
              @click="cal[dia.key] = !cal[dia.key]"
              :class="cal[dia.key] ? 'bg-brand text-white border-brand' : 'bg-white text-gray-500 border-gray-200 hover:border-brand hover:text-brand'"
              class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-150 select-none cursor-pointer"
            >
              {{ dia.short }}
            </button>
          </div>
        </div>

        <div class="mx-4 border-t border-dashed border-gray-200 mb-3"></div>

        <!-- Bloques de Frecuencia -->
        <div class="px-4 pb-3 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-gray-500">Bloques de frecuencia</label>
            <button @click="agregarBloqueFrecuencia(calIndex)" class="text-xs px-2.5 py-1.5 rounded-lg bg-purple-50 text-brand hover:bg-brand hover:text-white transition-all font-medium">+ Agregar bloque</button>
          </div>

          <div v-if="cal.bloques.length === 0" class="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">Sin bloques de frecuencia.</div>

          <div v-for="(bloque, bloqueIndex) in cal.bloques" :key="bloqueIndex" class="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand">Bloque {{ letraBloque(bloqueIndex) }}</span>
              <button @click="eliminarBloqueFrecuencia(calIndex, bloqueIndex)" class="text-gray-300 hover:text-red-400 text-xs transition-colors">✕</button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-[10px] font-semibold text-gray-400 mb-1">Desde</label>
                <input type="time" v-model="bloque.desde" class="w-full px-2 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-purple-400"/>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-400 mb-1">Hasta</label>
                <input type="time" v-model="bloque.hasta" class="w-full px-2 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-purple-400"/>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-400 mb-1">Cada (min)</label>
                <input type="number" v-model="bloque.intervalo" min="1" placeholder="10" class="w-full px-2 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-purple-400"/>
              </div>
            </div>
            <p v-if="bloque.desde && bloque.hasta && bloque.intervalo" class="text-[10px] text-gray-400 mt-1">
              Anuncio: De {{ formatHora(bloque.desde) }} a {{ formatHora(bloque.hasta) }}, cada {{ bloque.intervalo }} min.
            </p>
          </div>
        </div>

      </div>
    </div>
    <div v-if="modelValue.calendarios.length === 0" class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">No hay horarios. Agrega uno con el botón de arriba.</div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true }
})

const diasSemana = [
  { key: 'lunes', short: 'Lu' },
  { key: 'martes', short: 'Ma' },
  { key: 'miercoles', short: 'Mi' },
  { key: 'jueves', short: 'Ju' },
  { key: 'viernes', short: 'Vi' },
  { key: 'sabado', short: 'Sá' },
  { key: 'domingo', short: 'Do' },
]

const letraBloque = (i) => String.fromCharCode(65 + i)

const formatHora = (t) => {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hora = parseInt(h)
  return `${hora % 12 || 12}:${m} ${hora >= 12 ? 'PM' : 'AM'}`
}

const agregarCalendario = () => {
  props.modelValue.calendarios.push({
    nombre: '', lunes: false, martes: false, miercoles: false,
    jueves: false, viernes: false, sabado: false, domingo: false,
    fecha_inicial: '', fecha_final: '', bloques: [],
  })
}

const eliminarCalendario = (i) => { props.modelValue.calendarios.splice(i, 1) }
const agregarBloqueFrecuencia = (ci) => { props.modelValue.calendarios[ci].bloques.push({ desde: '', hasta: '', intervalo: '' }) }
const eliminarBloqueFrecuencia = (ci, bi) => { props.modelValue.calendarios[ci].bloques.splice(bi, 1) }
</script>