<template>

  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-screen">
    <div class="p-6">
      <!-- Logo -->
      <div
        class="w-full h-12 bg-brand-light rounded-xl border border-brand/20 flex items-center justify-center text-brand font-semibold text-xs px-2 text-center mb-8"
      >
        <img :src="logoUrl" alt="Logo" />
      </div>

      <!-- Info de ussuario

        <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Usuario actual</p>
        <p class="text-sm font-bold text-gray-900 capitalize">{{ nombreUsuario }}</p>
        <span
          :class="claseRol"
          class="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase"
        >
          {{ rol }}
        </span>
      -->
      <div class="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">



      </div>

      <!-- menu navegacion -->
      <nav class="space-y-1">
        <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Navegación
        </p>

        <!-- ver rutas (todos rls)-->
        <button
          @click="$emit('cambiarVista', 'rutas')"
          :class="[
            modelValue === 'rutas'
              ? 'bg-brand/10 text-brand font-semibold'
              : 'text-gray-600 hover:bg-gray-50',
          ]"
          class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
        >
          <MapIcon class="w-5 h-5" />
          <span>Ver Rutas</span>
        </button>

        <!-- captura ruta (colo capt) -->
        <button
          v-if="rol === 'capturista'"
          @click="$emit('cambiarVista', 'captura')"
          :class="[
            modelValue === 'captura'
              ? 'bg-brand/10 text-brand font-semibold'
              : 'text-gray-600 hover:bg-gray-50',
          ]"
          class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
        >
          <PlusCircleIcon class="w-5 h-5" />
          <span>Capturar Ruta</span>
        </button>

        <!-- agencias (sup y cap) -->
        <button
          v-if="rol === 'super' || rol === 'capturista'"
          @click="$emit('cambiarVista', 'agencias')"
          :class="[
            modelValue === 'agencias'
              ? 'bg-brand/10 text-brand font-semibold'
              : 'text-gray-600 hover:bg-gray-50',
          ]"
          class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
        >
          <span><Building class="w-5 h-5" /></span>
          <span>Registrar Agencia</span>
        </button>

        <!-- admininistracion super -->
        <div v-if="rol === 'super'" class="pt-4 space-y-1">
          <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Administración
          </p>

          <button
            @click="$emit('cambiarVista', 'usuarios')"
            :class="[
              modelValue === 'usuarios'
                ? 'bg-brand/10 text-brand font-semibold'
                : 'text-gray-600 hover:bg-gray-50',
            ]"
            class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
          >
            <UsersIcon class="w-5 h-5" />
            <span>Control de Usuarios</span>
          </button>

          <button
            @click="$emit('cambiarVista', 'bitacora')"
            :class="[
              modelValue === 'bitacora'
                ? 'bg-brand/10 text-brand font-semibold'
                : 'text-gray-600 hover:bg-gray-50',
            ]"
            class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
          >
            <ClipboardListIcon class="w-5 h-5" />
            <span>Bitácora de Acciones</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- footer del meni -->
    <div class="p-4 border-t border-gray-100 space-y-1">
      <button
        @click="$emit('cambiarVista', 'perfil')"
        :class="[
          modelValue === 'perfil'
            ? 'bg-brand/10 text-brand font-semibold'
            : 'text-gray-600 hover:bg-gray-50',
        ]"
        class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
      >
        <UserIcon class="w-5 h-5" />
        <span>Mi Perfil</span>
      </button>

      <button
        @click="cerrarSesion"
        class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
      >
        <LogOutIcon class="w-5 h-5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import logoUrl from '@/assets/logo.jpg'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Map as MapIcon,
  PlusCircle as PlusCircleIcon,
  Users as UsersIcon,
  ClipboardList as ClipboardListIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  Building,
} from 'lucide-vue-next'


const props = defineProps({
  modelValue: String,
  rol: String,
})


defineEmits(['cambiarVista'])

const router = useRouter()

const nombreUsuario = computed(() => {
  if (props.rol === 'super') return 'Ing. Alejandro H.'
  if (props.rol === 'capturista') return 'Sria. Beatriz M.'
  return 'Consultor Externo'
})

const claseRol = computed(() => {
  if (props.rol === 'super') return 'bg-purple-100 text-purple-700'
  if (props.rol === 'capturista') return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
})

const cerrarSesion = () => {
  localStorage.removeItem('user-rol')
  router.push('/')
}
</script>
