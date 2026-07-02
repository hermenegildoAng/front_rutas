<template>
  <div class="relative w-full h-[calc(100vh-90px)] overflow-hidden rounded-2xl">

    <!-- MAPA -->
    <div class="absolute inset-0 z-0">
      <div class="w-full h-full bg-[#e5e3df] relative overflow-hidden">
        <div ref="mapContainer" class="w-full h-full cursor-crosshair"></div>
        <!-- OVERLAY CARGA -->
        <div v-if="mapaCargando" class="absolute inset-0 z-40 bg-white/90 flex flex-col items-center justify-center">
          <div class="w-10 h-10 border-4 border-purple-200 border-t-brand rounded-full animate-spin"/>
          <p class="text-sm mt-4 text-gray-500">Cargando mapa...</p>
        </div>
      </div>
    </div>

    <!-- INDICADOR MODO ACTIVO -->
    <div
      v-if="modoActivo"
      class="absolute bottom-6 right-6 z-40 bg-brand text-white text-xs px-4 py-2 rounded-xl shadow-lg font-medium flex items-center gap-2"
    >
      {{ modoActivo === 'trazar' ? '✏️ Click para agregar puntos de ruta' : '📍 Click para colocar parada' }}
      <button @click="activarModo(null)" class="opacity-70 hover:opacity-100">✕</button>
    </div>

    <!-- ========================= FORMULARIO IZQUIERDO ========================= -->
    <!-- Botón toggle cuando está colapsado -->
    <button
      v-if="!formularioVisible"
      @click="formularioVisible = true"
      class="absolute top-4 left-4 z-30 w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all"
      title="Mostrar formulario"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
      </svg>
    </button>

    <div
      v-if="formularioVisible"
      class="absolute top-4 left-4 z-30 w-105 max-w-[95vw] max-h-[calc(100vh-122px)] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col"
    >
      <!-- HEADER -->
      <div class="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div>
          <h2 class="font-bold text-lg text-gray-800">Crear Ruta</h2>
          <p class="text-xs text-gray-400">Paso {{ pasoActual + 1 }} de {{ pasos.length }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <button @click="anteriorPaso" :disabled="pasoActual === 0" class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm">←</button>
          <button @click="siguientePaso" :disabled="pasoActual === pasos.length - 1" class="w-9 h-9 rounded-xl bg-brand text-white hover:opacity-90 disabled:opacity-40 text-sm">→</button>
          <!-- Botón colapsar -->
          <button
            @click="formularioVisible = false"
            class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"
            title="Ocultar formulario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-5 overflow-y-auto flex-1 space-y-5">

        <!-- PASO 1: GENERAL -->
        <div v-if="pasoActual === 0" class="space-y-4">
          <div v-for="campo in camposGenerales" :key="campo.key">
            <label class="block text-xs font-semibold text-gray-500 mb-1">{{ campo.label }}</label>
            <select v-if="campo.opciones" v-model="form[campo.key]" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Selecciona</option>
              <option v-for="op in campo.opciones" :key="op" :value="op">{{ op }}</option>
            </select>
            <input v-else v-model="form[campo.key]" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Duración de ruta (minutos)</label>
            <input
              v-model.number="form.duracion_ruta"
              type="number"
              min="1"
              placeholder="Ej. 45"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <!-- PASO 2: HORARIOS -->
        <div v-if="pasoActual === 1" class="space-y-4">
          <div class="flex items-center justify-between sticky top-0 z-10 bg-white/95 py-2 border-b border-gray-50">
            <h3 class="font-semibold text-gray-700">Horarios</h3>
            <button @click="agregarCalendario" class="px-3 py-2 rounded-xl bg-brand text-white text-sm hover:opacity-90 shadow-sm">+ Agregar horario</button>
          </div>
          <div class="space-y-5 pt-2">
            <div v-for="(cal, calIndex) in form.calendarios" :key="calIndex" class="relative border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden">
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
                  <button v-for="dia in diasSemana" :key="dia.key" @click="cal[dia.key] = !cal[dia.key]"
                    :class="cal[dia.key] ? 'bg-brand text-white border-brand' : 'bg-white text-gray-500 border-gray-200 hover:border-brand hover:text-brand'"
                    class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-150 select-none cursor-pointer">
                    {{ dia.short }}
                  </button>
                </div>
              </div>
              <div class="mx-4 border-t border-dashed border-gray-200 mb-3"></div>
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
                    🕐 De {{ formatHora(bloque.desde) }} a {{ formatHora(bloque.hasta) }}, cada {{ bloque.intervalo }} min.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="form.calendarios.length === 0" class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">No hay horarios. Agrega uno con el botón de arriba.</div>
        </div>

        <!-- PASO 3: PARADAS -->
        <div v-if="pasoActual === 2" class="space-y-4">
          <div class="flex items-center justify-between sticky top-0 z-10 bg-white/95 py-2 border-b border-gray-50">
            <h3 class="font-semibold text-gray-700">Paradas</h3>
            <div class="flex gap-2">
              <button @click="activarModo('parada')" :class="modoActivo === 'parada' ? 'bg-brand text-white' : 'bg-purple-50 text-brand'"
                class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm hover:opacity-90 shadow-sm transition-all">
                <MapPin class="w-3 h-3"/> En mapa
              </button>
              <button @click="agregarParada('', '')" class="px-3 py-2 rounded-xl bg-purple-50 text-brand text-sm hover:bg-brand hover:text-white shadow-sm">+ Manual</button>
            </div>
          </div>
          <div class="space-y-4 pt-2">
            <template v-for="(parada, index) in form.paradas" :key="index">
              <div class="relative border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-4 pt-10">
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
                    <input v-model="parada.latitud" @input="actualizarMarcadoresDesdeForm" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Longitud</label>
                    <input v-model="parada.longitud" @input="actualizarMarcadoresDesdeForm" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
                  </div>
                </div>

              </div>

            </template>
          </div>
          <div v-if="form.paradas.length === 0" class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">No hay paradas. Usa "En mapa" o "+ Manual".</div>
        </div>

        <!-- PASO 4: VIAJE DE REGRESO -->
        <div v-if="pasoActual === 3" class="space-y-5">
          <h3 class="font-semibold text-gray-700">Viaje de regreso</h3>

          <div class="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <span class="text-sm font-medium text-gray-700">La ruta tiene viaje de regreso</span>
            <button
              type="button"
              @click="form.viaje_regreso.tiene_viaje_regreso = !form.viaje_regreso.tiene_viaje_regreso"
              :class="form.viaje_regreso.tiene_viaje_regreso ? 'bg-brand' : 'bg-gray-300'"
              class="relative w-11 h-6 rounded-full transition-colors shrink-0"
            >
              <span
                :class="form.viaje_regreso.tiene_viaje_regreso ? 'translate-x-5' : 'translate-x-0.5'"
                class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"
              />
            </button>
          </div>

          <template v-if="form.viaje_regreso.tiene_viaje_regreso">
            <!-- Horarios de regreso -->
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
                <span class="text-sm font-medium text-gray-700">¿Utiliza los mismos horarios?</span>
                <button
                  type="button"
                  @click="toggleMismosHorarios"
                  :class="form.viaje_regreso.mismos_horarios ? 'bg-brand' : 'bg-gray-300'"
                  class="relative w-11 h-6 rounded-full transition-colors shrink-0"
                >
                  <span
                    :class="form.viaje_regreso.mismos_horarios ? 'translate-x-5' : 'translate-x-0.5'"
                    class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  />
                </button>
              </div>

              <div v-if="!form.viaje_regreso.mismos_horarios" class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-semibold text-gray-600">Horarios de regreso</h4>
                  <button @click="agregarCalendarioRegreso" class="px-3 py-2 rounded-xl bg-brand text-white text-sm hover:opacity-90 shadow-sm">+ Agregar horario</button>
                </div>
                <div class="space-y-5">
                  <div v-for="(cal, calIndex) in form.viaje_regreso.calendarios" :key="'regreso-cal-' + calIndex" class="relative border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden">
                    <div class="flex items-center justify-between px-4 pt-4 pb-2">
                      <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">{{ calIndex + 1 }}</span>
                        <input v-model="cal.nombre" placeholder="Nombre del horario (ej. Entre semana)" class="text-sm font-semibold text-gray-700 bg-transparent border-b border-dashed border-gray-300 outline-none focus:border-brand px-1 py-0.5 w-48"/>
                      </div>
                      <button @click="eliminarCalendarioRegreso(calIndex)" class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">✕ Eliminar</button>
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
                        <button v-for="dia in diasSemana" :key="'regreso-dia-' + calIndex + '-' + dia.key" @click="cal[dia.key] = !cal[dia.key]"
                          :class="cal[dia.key] ? 'bg-brand text-white border-brand' : 'bg-white text-gray-500 border-gray-200 hover:border-brand hover:text-brand'"
                          class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-150 select-none cursor-pointer">
                          {{ dia.short }}
                        </button>
                      </div>
                    </div>
                    <div class="mx-4 border-t border-dashed border-gray-200 mb-3"></div>
                    <div class="px-4 pb-3 space-y-3">
                      <div class="flex items-center justify-between">
                        <label class="text-xs font-semibold text-gray-500">Bloques de frecuencia</label>
                        <button @click="agregarBloqueFrecuenciaRegreso(calIndex)" class="text-xs px-2.5 py-1.5 rounded-lg bg-purple-50 text-brand hover:bg-brand hover:text-white transition-all font-medium">+ Agregar bloque</button>
                      </div>
                      <div v-if="cal.bloques.length === 0" class="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">Sin bloques de frecuencia.</div>
                      <div v-for="(bloque, bloqueIndex) in cal.bloques" :key="'regreso-bloque-' + calIndex + '-' + bloqueIndex" class="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-brand">Bloque {{ letraBloque(bloqueIndex) }}</span>
                          <button @click="eliminarBloqueFrecuenciaRegreso(calIndex, bloqueIndex)" class="text-gray-300 hover:text-red-400 text-xs transition-colors">✕</button>
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
                          🕐 De {{ formatHora(bloque.desde) }} a {{ formatHora(bloque.hasta) }}, cada {{ bloque.intervalo }} min.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="form.viaje_regreso.calendarios.length === 0" class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">No hay horarios de regreso. Agrega uno con el botón de arriba.</div>
              </div>
            </div>

            <!-- Paradas de regreso -->
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
                <span class="text-sm font-medium text-gray-700">¿Utiliza las mismas paradas?</span>
                <button
                  type="button"
                  @click="toggleMismasParadas"
                  :class="form.viaje_regreso.mismas_paradas ? 'bg-brand' : 'bg-gray-300'"
                  class="relative w-11 h-6 rounded-full transition-colors shrink-0"
                >
                  <span
                    :class="form.viaje_regreso.mismas_paradas ? 'translate-x-5' : 'translate-x-0.5'"
                    class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  />
                </button>
              </div>

              <div v-if="!form.viaje_regreso.mismas_paradas" class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-semibold text-gray-600">Paradas de regreso</h4>
                  <button @click="agregarParadaRegreso('', '')" class="px-3 py-2 rounded-xl bg-purple-50 text-brand text-sm hover:bg-brand hover:text-white shadow-sm">+ Agregar parada</button>
                </div>
                <div class="space-y-4">
                  <template v-for="(parada, index) in form.viaje_regreso.paradas" :key="'regreso-parada-' + index">
                    <div class="relative border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-4 pt-10">
                      <button @click="eliminarParadaRegreso(index)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 text-sm font-medium">✕ Eliminar</button>
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
                          <input v-model="parada.latitud" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
                        </div>
                        <div>
                          <label class="block text-xs font-semibold text-gray-500 mb-1">Longitud</label>
                          <input v-model="parada.longitud" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"/>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div v-if="form.viaje_regreso.paradas.length === 0" class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">No hay paradas de regreso. Agrega una con el botón de arriba.</div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="p-5 border-t border-gray-100 bg-white/50 shrink-0">
        <button @click="handleGuardarRuta" class="w-full py-3 rounded-2xl bg-brand text-white font-semibold hover:opacity-90 shadow-md transition-opacity">Guardar Ruta</button>
      </div>
    </div>

    <!-- ========================= PANEL DERECHO ========================= -->
    <div class="absolute top-4 right-14 mr-8 z-20 w-72 flex flex-col gap-2">

      <!-- CARGADOR DE ARCHIVO —  -->
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-800">Cargar archivo de ruta</h3>
          <span class="text-[10px] text-gray-400 font-mono">.geojson .json .gpx .kml</span>
        </div>

        <!-- Input-file oculto -->
        <input ref="inputArchivo" type="file" class="hidden" accept=".geojson,.json,.gpx,.kml" @change="onArchivoSeleccionado"/>

        <button
          @click="inputArchivo.click()"
          class="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand text-sm text-gray-500 hover:text-brand transition-all flex items-center justify-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
          </svg>
          Cargar archivo
        </button>

        <!-- Preview del archivo seleccionado -->
        <div v-if="archivoSeleccionado" class="rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2"
          :class="archivoValido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'">
          <div class="flex items-center gap-2 min-w-0">
            <!-- Ícono archivo -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0" :class="archivoValido ? 'text-green-500' : 'text-red-400'">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
            <span class="text-xs font-medium truncate" :class="archivoValido ? 'text-green-700' : 'text-red-600'">
              {{ archivoSeleccionado.name }}
            </span>
          </div>
          <!-- Tooltip extensión inválida -->
          <div v-if="!archivoValido" class="flex items-center gap-1 shrink-0">
            <span class="text-[10px] text-red-500 font-semibold whitespace-nowrap">Extensión inválida</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-red-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
          </div>
          <button v-if="!archivoValido" @click="limpiarArchivo" class="text-red-300 hover:text-red-500 text-xs shrink-0">✕</button>
        </div>

        <!-- Botón procesar — solo si válido -->
        <button
          v-if="archivoSeleccionado && archivoValido"
          @click="procesarArchivo"
          :disabled="archivoCargando"
          class="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <svg v-if="archivoCargando" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"/>
          </svg>
          {{ archivoCargando ? 'Procesando...' : 'Cargar' }}
        </button>

        <!-- Resultado de carga -->
        <Transition name="slide-left">
          <div
            v-if="archivoResultado"
            class="rounded-xl px-3 py-2.5 flex items-center justify-between gap-2"
            :class="archivoResultado.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span v-if="archivoResultado.ok" class="text-green-500 shrink-0">✓</span>
              <span v-else class="text-red-400 shrink-0">✕</span>
              <span class="text-xs font-medium truncate" :class="archivoResultado.ok ? 'text-green-700' : 'text-red-600'">
                {{ archivoResultado.mensaje }}
              </span>
            </div>
            <button @click="archivoResultado = null" class="text-gray-300 hover:text-gray-500 shrink-0 text-xs">✕</button>
          </div>
        </Transition>
      </div>

      <!-- PANEL PUNTOS DE RUTA -->
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col max-h-[calc(100vh-280px)]">
        <!-- Header siempre visible -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 class="font-bold text-sm text-gray-800">Puntos de Ruta</h3>
            <p class="text-xs text-gray-400">{{ puntosRuta.length }} punto(s)</p>
          </div>
          <div class="flex gap-1">
            <button
              @click="activarModo('trazar')"
              :class="modoActivo === 'trazar' ? 'bg-brand text-white' : 'bg-purple-50 text-brand'"
              class="text-xs px-2 py-1.5 rounded-lg transition-all hover:opacity-90 font-medium"
            >✏️ Mapa</button>
            <button
              @click="agregarPuntoManual"
              class="text-xs px-2 py-1.5 rounded-lg bg-purple-50 text-brand hover:bg-brand hover:text-white transition-all font-medium"
            >+ Manual</button>
          </div>
        </div>

        <!-- Lista colapsable -->
        <div v-show="listaPuntosVisible" class="flex-1 overflow-y-auto p-3 space-y-2">
          <div v-for="(punto, index) in puntosRuta" :key="index" class="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-100">
            <span class="w-5 h-5 rounded-full bg-brand text-white text-[10px] flex items-center justify-center font-bold shrink-0">{{ index + 1 }}</span>
            <div class="flex-1 grid grid-cols-2 gap-1">
              <input v-model="punto.lat" placeholder="Lat" class="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-purple-400 w-full"/>
              <input v-model="punto.lng" placeholder="Lng" class="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-purple-400 w-full"/>
            </div>
            <button @click="eliminarPuntoRuta(index)" class="text-gray-300 hover:text-red-400 transition-colors shrink-0 text-sm">✕</button>
          </div>
          <div v-if="puntosRuta.length === 0" class="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">Sin puntos aún.</div>
        </div>

        <!-- Footer: toggle lista + borrar -->
        <div class="p-3 border-t border-gray-100 bg-white/50 shrink-0 flex gap-2">
          <button
            @click="borrarTrazo"
            class="py-2 px-3 rounded-xl border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
          >Borrar</button>
          <button
            @click="listaPuntosVisible = !listaPuntosVisible"
            class="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 transition-transform" :class="listaPuntosVisible ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
            </svg>
            {{ listaPuntosVisible ? 'Ocultar lista' : 'Mostrar lista' }}
          </button>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-vue-next'

// ========================= LEAFLET ICONS =========================
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const iconoParada = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7c3aed" width="32" height="32">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.512 3.5-7.327a8 8 0 10-16 0c0 2.815 1.556 5.314 3.5 7.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
  </svg>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// ========================= STATE =========================
const mapContainer = ref(null)
let map = null
const mapaCargando = ref(true)

const pasoActual = ref(0)
const pasos = ['general', 'calendarios', 'paradas', 'viaje_regreso']
const modoActivo = ref(null)

// UI toggles
const formularioVisible = ref(true)
const listaPuntosVisible = ref(true)

// Capas mapa
let polylineRuta = null
let marcadoresParadas = []
let marcadoresPuntos = []

const puntosRuta = ref([])

// Archivo
const inputArchivo = ref(null)
const archivoSeleccionado = ref(null)
const archivoValido = ref(false)
const archivoCargando = ref(false)
const archivoResultado = ref(null)
const EXTENSIONES_VALIDAS = ['.geojson', '.json', '.gpx', '.kml']

// ========================= FORM =========================
const form = ref({
  folio: '',
  nombre_corto: '',
  nombre_largo: '',
  agencia: '',
  tipo_ruta: '',
  duracion_ruta: null,
  calendarios: [],
  paradas: [],
  viaje_regreso: {
    tiene_viaje_regreso: false,
    mismos_horarios: true,
    calendarios: [],
    mismas_paradas: true,
    paradas: [],
  },
})

const camposGenerales = [
  { key: 'folio', label: 'Folio' },
  { key: 'nombre_corto', label: 'Nombre Corto' },
  { key: 'nombre_largo', label: 'Nombre Largo' },
  { key: 'agencia', label: 'Agencia', opciones: ['Movilidad Puebla', 'Tlaxcala Transporte', 'Ruta Urbana'] },
  { key: 'tipo_ruta', label: 'Tipo Ruta', opciones: ['Autobús', 'combi',] },

]

const diasSemana = [
  { key: 'lunes',    short: 'Lu' },
  { key: 'martes',   short: 'Ma' },
  { key: 'miercoles',short: 'Mi' },
  { key: 'jueves',   short: 'Ju' },
  { key: 'viernes',  short: 'Vi' },
  { key: 'sabado',   short: 'Sá' },
  { key: 'domingo',  short: 'Do' },
]

// ========================= HELPERS =========================
const letraBloque = (i) => String.fromCharCode(65 + i)

const formatHora = (t) => {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hora = parseInt(h)
  return `${hora % 12 || 12}:${m} ${hora >= 12 ? 'PM' : 'AM'}`
}

// ========================= WATCHES =========================
watch(puntosRuta, () => { redibujarRuta() }, { deep: true })

// ========================= PASOS =========================
const siguientePaso = () => { if (pasoActual.value < pasos.length - 1) pasoActual.value++ }
const anteriorPaso  = () => { if (pasoActual.value > 0) pasoActual.value-- }

// ========================= MODO =========================
const activarModo = (modo) => {
  modoActivo.value = modoActivo.value === modo ? null : modo
  if (map) map.getContainer().style.cursor = modoActivo.value ? 'crosshair' : 'grab'
}

// ========================= MAPA =========================
onMounted(() => {
  map = L.map(mapContainer.value, { zoomControl: false }).setView([19.3139, -98.2404], 13)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    if (modoActivo.value === 'trazar') {
      puntosRuta.value.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
    } else if (modoActivo.value === 'parada') {
      agregarParada(lat.toFixed(6), lng.toFixed(6))
      pasoActual.value = 2
    }
  })

  setTimeout(() => { mapaCargando.value = false }, 1000)
})

onBeforeUnmount(() => { if (map) map.remove() })

// ========================= RUTA =========================
const redibujarRuta = () => {
  if (polylineRuta) { map.removeLayer(polylineRuta); polylineRuta = null }
  marcadoresPuntos.forEach((m) => map.removeLayer(m))
  marcadoresPuntos = []

  const coords = puntosRuta.value
    .filter((p) => p.lat !== '' && p.lng !== '' && !isNaN(parseFloat(p.lat)) && !isNaN(parseFloat(p.lng)))
    .map((p) => [parseFloat(p.lat), parseFloat(p.lng)])

  if (coords.length < 2) return

  polylineRuta = L.polyline(coords, { color: '#7c3aed', weight: 4, opacity: 0.85, lineJoin: 'round', lineCap: 'round' }).addTo(map)

  coords.forEach(([lat, lng], i) => {
    const m = L.circleMarker([lat, lng], { radius: 5, fillColor: '#7c3aed', color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map)
    m.bindTooltip(`Punto ${i + 1}`, { permanent: false, direction: 'top' })
    marcadoresPuntos.push(m)
  })
}

const borrarTrazo = () => {
  if (polylineRuta) { map.removeLayer(polylineRuta); polylineRuta = null }
  marcadoresPuntos.forEach((m) => map.removeLayer(m))
  marcadoresPuntos = []
  puntosRuta.value = []
  modoActivo.value = null
  if (map) map.getContainer().style.cursor = 'grab'
}

const agregarPuntoManual  = () => { puntosRuta.value.push({ lat: '', lng: '' }) }
const eliminarPuntoRuta   = (i) => { puntosRuta.value.splice(i, 1) }

// ========================= PARADAS =========================
const limpiarTodosLosMarcadoresParada = () => {
  marcadoresParadas.forEach((m) => { if (m) map.removeLayer(m) })
  marcadoresParadas = []
}

const redibujarTodosLosMarcadoresParadas = () => {
  limpiarTodosLosMarcadoresParada()
  form.value.paradas.forEach((parada, i) => {
    const lat = parseFloat(parada.latitud)
    const lng = parseFloat(parada.longitud)
    if (!isNaN(lat) && !isNaN(lng)) {
      const marcador = L.marker([lat, lng], { icon: iconoParada }).addTo(map)
        .bindPopup(`<b>${parada.nombre_parada || 'Parada ' + (i + 1)}</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
      marcadoresParadas[i] = marcador
    }
  })
}

const agregarParada = (lat = '', lng = '') => {
  const orden = form.value.paradas.length + 1
  form.value.paradas.push({ folio_parada: '', nombre_parada: `Parada ${orden}`, latitud: lat, longitud: lng, orden_parada: orden })

  if (lat && lng) { redibujarTodosLosMarcadoresParadas(); map.panTo([parseFloat(lat), parseFloat(lng)]) }
}

const eliminarParada = (index) => {
  form.value.paradas.splice(index, 1)

  form.value.paradas.forEach((p, i) => { p.orden_parada = i + 1 })
  redibujarTodosLosMarcadoresParadas()
}

const actualizarMarcadoresDesdeForm = () => { redibujarTodosLosMarcadoresParadas() }

// ========================= CALENDARIOS =========================
const nuevoCalendario = () => ({
  nombre: '', lunes: false, martes: false, miercoles: false,
  jueves: false, viernes: false, sabado: false, domingo: false,
  fecha_inicial: '', fecha_final: '', bloques: [],
})
const nuevoBloque = () => ({ desde: '', hasta: '', intervalo: '' })

const agregarCalendario        = ()              => { form.value.calendarios.push(nuevoCalendario()) }
const eliminarCalendario       = (i)             => { form.value.calendarios.splice(i, 1) }
const agregarBloqueFrecuencia  = (ci)            => { form.value.calendarios[ci].bloques.push(nuevoBloque()) }
const eliminarBloqueFrecuencia = (ci, bi)        => { form.value.calendarios[ci].bloques.splice(bi, 1) }

const clonarCalendarios = (calendarios) => JSON.parse(JSON.stringify(calendarios))
const clonarParadas = (paradas) => paradas.map((p) => ({ ...p }))

const toggleMismosHorarios = () => {
  const regreso = form.value.viaje_regreso
  regreso.mismos_horarios = !regreso.mismos_horarios
  if (!regreso.mismos_horarios && regreso.calendarios.length === 0) {
    regreso.calendarios = clonarCalendarios(form.value.calendarios)
  }
}

const toggleMismasParadas = () => {
  const regreso = form.value.viaje_regreso
  regreso.mismas_paradas = !regreso.mismas_paradas
  if (!regreso.mismas_paradas && regreso.paradas.length === 0) {
    regreso.paradas = clonarParadas(form.value.paradas)
  }
}

const agregarCalendarioRegreso        = ()       => { form.value.viaje_regreso.calendarios.push(nuevoCalendario()) }
const eliminarCalendarioRegreso       = (i)      => { form.value.viaje_regreso.calendarios.splice(i, 1) }
const agregarBloqueFrecuenciaRegreso  = (ci)     => { form.value.viaje_regreso.calendarios[ci].bloques.push(nuevoBloque()) }
const eliminarBloqueFrecuenciaRegreso = (ci, bi) => { form.value.viaje_regreso.calendarios[ci].bloques.splice(bi, 1) }

const agregarParadaRegreso = (lat = '', lng = '') => {
  const orden = form.value.viaje_regreso.paradas.length + 1
  form.value.viaje_regreso.paradas.push({
    folio_parada: '',
    nombre_parada: `Parada ${orden}`,
    latitud: lat,
    longitud: lng,
    orden_parada: orden,
  })
}

const eliminarParadaRegreso = (index) => {
  form.value.viaje_regreso.paradas.splice(index, 1)
  form.value.viaje_regreso.paradas.forEach((p, i) => { p.orden_parada = i + 1 })
}

// ========================= ARCHIVO =========================
const validarExtension = (nombreArchivo) => {
  const ext = '.' + nombreArchivo.split('.').pop().toLowerCase()
  return EXTENSIONES_VALIDAS.includes(ext)
}

const onArchivoSeleccionado = (e) => {
  const archivo = e.target.files[0]
  if (!archivo) return
  archivoSeleccionado.value = archivo
  archivoValido.value = validarExtension(archivo.name)
  archivoResultado.value = null
  e.target.value = ''
}

const limpiarArchivo = () => {
  archivoSeleccionado.value = null
  archivoValido.value = false
  archivoResultado.value = null
}



// Extrae array de [lat, lng] desde GeoJSON/JSON
const parsearGeoJSON = (texto) => {
  const datos = JSON.parse(texto)
  const puntos = []

  const procesarGeometria = (geom) => {
    if (!geom) return
    if (geom.type === 'LineString') {
      geom.coordinates.forEach(([lng, lat]) => puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) }))
    } else if (geom.type === 'MultiLineString') {
      geom.coordinates.forEach(linea => linea.forEach(([lng, lat]) => puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })))
    } else if (geom.type === 'Point') {
      const [lng, lat] = geom.coordinates
      puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
    } else if (geom.type === 'GeometryCollection') {
      geom.geometries.forEach(procesarGeometria)
    }
  }

  if (datos.type === 'FeatureCollection') {
    datos.features.forEach(f => procesarGeometria(f.geometry))
  } else if (datos.type === 'Feature') {
    procesarGeometria(datos.geometry)
  } else if (datos.geometry) {
    procesarGeometria(datos.geometry)
  } else {
    procesarGeometria(datos)
  }

  // ── Fallback: JSON con estructura custom ──────────────────────

  if (puntos.length === 0) {
    const buscarEnObjeto = (obj) => {
      if (!obj || typeof obj !== 'object') return
      if (Array.isArray(obj)) {
        // ¿Es un array de puntos con lat+lon?
        if (obj.length > 0 && obj[0].lat !== undefined) {
          const clave = obj[0].lon !== undefined ? 'lon' : 'lng'
          obj.forEach(p => {
            const lat = parseFloat(p.lat)
            const lng = parseFloat(p[clave])
            if (!isNaN(lat) && !isNaN(lng))
              puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
          })
        } else {
          obj.forEach(buscarEnObjeto)
        }
      } else {
        Object.values(obj).forEach(buscarEnObjeto)
      }
    }
    buscarEnObjeto(datos)
  }

  return puntos
}


// Extrae puntos de GPX
const parsearGPX = (texto) => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(texto, 'application/xml')
  const puntos = []

  // Track points
  const trkpts = xml.querySelectorAll('trkpt')
  trkpts.forEach(pt => {
    const lat = parseFloat(pt.getAttribute('lat'))
    const lng = parseFloat(pt.getAttribute('lon'))
    if (!isNaN(lat) && !isNaN(lng)) puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
  })

  //buscar waypoints
  if (puntos.length === 0) {
    const wpts = xml.querySelectorAll('wpt')
    wpts.forEach(pt => {
      const lat = parseFloat(pt.getAttribute('lat'))
      const lng = parseFloat(pt.getAttribute('lon'))
      if (!isNaN(lat) && !isNaN(lng)) puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
    })
  }

  // Route points como fallback
  if (puntos.length === 0) {
    const rtepts = xml.querySelectorAll('rtept')
    rtepts.forEach(pt => {
      const lat = parseFloat(pt.getAttribute('lat'))
      const lng = parseFloat(pt.getAttribute('lon'))
      if (!isNaN(lat) && !isNaN(lng)) puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
    })
  }

  return puntos
}

// Extrae puntos de KML
const parsearKML = (texto) => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(texto, 'application/xml')
  const puntos = []

  // LineString coordinates
  const lineStrings = xml.querySelectorAll('LineString coordinates')
  lineStrings.forEach(node => {
    node.textContent.trim().split(/\s+/).forEach(par => {
      const partes = par.split(',')
      if (partes.length >= 2) {
        const lng = parseFloat(partes[0])
        const lat = parseFloat(partes[1])
        if (!isNaN(lat) && !isNaN(lng)) puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
      }
    })
  })

  // Point coordinates
  if (puntos.length === 0) {
    const pointCoords = xml.querySelectorAll('Point coordinates')
    pointCoords.forEach(node => {
      const partes = node.textContent.trim().split(',')
      if (partes.length >= 2) {
        const lng = parseFloat(partes[0])
        const lat = parseFloat(partes[1])
        if (!isNaN(lat) && !isNaN(lng)) puntos.push({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
      }
    })
  }

  return puntos
}

const procesarArchivo = async () => {
  if (!archivoSeleccionado.value || !archivoValido.value) return

  archivoCargando.value = true
  archivoResultado.value = null

  try {
    const texto = await archivoSeleccionado.value.text()
    const ext = '.' + archivoSeleccionado.value.name.split('.').pop().toLowerCase()

    let puntos = []

    if (ext === '.geojson' || ext === '.json') {
      puntos = parsearGeoJSON(texto)
    } else if (ext === '.gpx') {
      puntos = parsearGPX(texto)
    } else if (ext === '.kml') {
      puntos = parsearKML(texto)
    }

    if (puntos.length === 0) {
      archivoResultado.value = { ok: false, mensaje: 'No se encontraron puntos en el archivo.' }
      return
    }

    // Cargar en puntosRuta
    puntosRuta.value = puntos

    // Fit mapa a los puntos cargados
    const coords = puntos.map(p => [parseFloat(p.lat), parseFloat(p.lng)])
    map.fitBounds(L.latLngBounds(coords), { padding: [32, 32] })

    archivoResultado.value = { ok: true, mensaje: `${puntos.length} puntos cargados correctamente.` }
    limpiarArchivo()

  } catch (err) {
    console.error('Error parseando archivo:', err)
    archivoResultado.value = { ok: false, mensaje: 'Error al leer el archivo. Verifica que sea válido.' }
  } finally {
    archivoCargando.value = false
  }
}

// ========================= GUARDAR =========================
const handleGuardarRuta = () => {
  const { viaje_regreso, ...restoForm } = form.value

  const payload = {
    ...restoForm,
    geometria_linea: puntosRuta.value.filter((p) => p.lat && p.lng),
    viaje_regreso: viaje_regreso.tiene_viaje_regreso
      ? {
          tiene_viaje_regreso: true,
          mismos_horarios: viaje_regreso.mismos_horarios,
          calendarios: viaje_regreso.mismos_horarios
            ? form.value.calendarios
            : viaje_regreso.calendarios,
          mismas_paradas: viaje_regreso.mismas_paradas,
          paradas: viaje_regreso.mismas_paradas
            ? form.value.paradas
            : viaje_regreso.paradas,
        }
      : {
          tiene_viaje_regreso: false,
        },
  }

  console.log(payload)
  alert('ejemplo guardar')
}
</script>
