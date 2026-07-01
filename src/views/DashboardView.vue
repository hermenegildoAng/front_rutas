<template>
  <div class="min-h-screen flex bg-gray-50 relative overflow-hidden">
    <!-- 📱 BOTÓN TIPO PESTAÑA DE FOLDER (Sólo visible en pantallas chicas) -->
    <button
      @click="menuAbierto = !menuAbierto"
      class="md:hidden fixed left-0 top-20 z-50 bg-brand text-white p-2 rounded-r-xl shadow-lg border-y border-r border-brand-dark flex items-center justify-center transition-all duration-300 hover:bg-brand-dark focus:outline-none"
    >
      <!-- La flecha rota dependiendo de si el menú está abierto o cerrado -->
      <ChevronRightIcon
        class="w-5 h-5 transform transition-transform duration-300"
        :class="{ 'rotate-180': menuAbierto }"
      />
    </button>

    <!-- FONDO OSCURO DE RESPALDO (Backdrop) al abrir el menú en móvil -->
    <div
      v-if="menuAbierto"
      @click="menuAbierto = false"
      class="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
    ></div>

    <!-- COMPONENTE SIDEBAR -->
    <!-- Le pasamos la clase dinámica para que aparezca/desaparezca en móvil -->
    <SidebarComponent
      :modelValue="vistaActual"
      :rol="rol"
      @cambiarVista="irAVista"
      class="fixed md:relative inset-y-0 left-0 z-40 transform md:transform-none transition-transform duration-300 ease-in-out"
      :class="[menuAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0']"
    />

    <!-- CONTENEDOR PRINCIPAL DERECHO -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- BARRA SUPERIOR (NAVBAR) -->
      <header
        class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10"
      >
        <!-- Añadimos un pequeño margen izquierdo en móvil para que no choque con la pestaña -->
        <h1 class="text-lg font-bold text-gray-900 capitalize pl-6 md:pl-0">
          {{ titulosVistas[vistaActual] }}
        </h1>
      </header>

      <!-- CONTENIDO DE LA PÁGINA -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <Transition name="fade-slide" mode="out-in">
          <div :key="vistaActual" class="h-full">
            <!-- VISTA: VER RUTAS -->
            <div v-if="vistaActual === 'rutas'">
              <!-- Escuchamos el evento y disparamos la función -->
              <InventarioRutasComponent @verDetalleRuta="cargarDetalleDeRuta" />
            </div>

            <!-- VISTA: CAPTURAR RUTA -->
            <div v-if="vistaActual === 'captura'" class="h-full">
              <!-- Le heredamos los datos al mapa -->
              <CapturaRutaComponent :rutaPrecargada="rutaSeleccionadaParaEditar" />
            </div>

            <!-- VISTA: ADMINISTRACIÓN DE AGNCIAS-->
            <div v-if="vistaActual === 'usuarios'">
              <AdminUsuariosComponent />
            </div>

            <!-- 🏢 VISTA: ADMINISTRACIÓN DE AGENCIAS -->
            <div v-if="vistaActual === 'agencias'">
              <!-- Le inyectamos la variable reactiva del rol de usuario -->
              <AdminAgenciasComponent :rol="rol" />
            </div>

            <div v-if="vistaActual === 'bitacora'">
              <BitacoraComponent />
            </div>

            <div
              v-if="vistaActual === 'perfil'"
              class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <p class="text-gray-600">Aquí irá el formulario para cambiar contraseña.</p>
            </div>
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import AdminUsuariosComponent from '../components/AdminUsuariosComponent.vue'
import BitacoraComponent from '../components/BitacoraComponent.vue'
import CapturaRutaComponent from '../components/CapturaRutaComponent.vue'
import AdminAgenciasComponent from '../components/AdminAgenciasComponent.vue'
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'
import InventarioRutasComponent from '../components/InventarioRutasComponent.vue'

const rol = ref(localStorage.getItem('user-rol') || 'consultor')
const vistaActual = ref('rutas')
const menuAbierto = ref(false) // Controla el Sidebar en móviles
const rutaSeleccionadaParaEditar = ref(null)

const irAVista = (nuevaVista) => {
  vistaActual.value = nuevaVista
  menuAbierto.value = false
}

const cargarDetalleDeRuta = (ruta) => {
  rutaSeleccionadaParaEditar.value = ruta
  vistaActual.value = 'captura'
}

const titulosVistas = {
  rutas: 'rutas registrdaas',
  captura: 'ingresar ruta',
  usuarios: 'usuairos',
  bitacora: 'bitacora',
  perfil: 'perfil',
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
