<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <!-- CONTENEDOR PRINCIPAL CON ANIMACIÓN DE ENTRADA -->
    <!-- animate-fade-in-up es una simulación visual; usamos transiciones nativas de Tailwind -->
    <div
      class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-700 ease-out translate-y-0 opacity-100"
    >
      <!-- ESPACIO PARA EL LOGO (RECUADRO ESTÉTICO) -->
      <div class="flex flex-col items-center justify-center">
        <div
          class="w-100 h-16 rounded-xl flex items-center justify-center font-medium text-sm text-center px-4 mb-2"
        >
          <img src="/logo3.png" alt="" />
        </div>
        <h2 class="mt-4 text-center text-2xl font-bold text-gray-900">mapear rutas</h2>
        <p class="mt-2 text-center text-sm text-gray-500">
          Sistema de generación de rutas para Google Maps
        </p>
      </div>

      <!-- FORMULARIO VISUAL -->
      <form class="mt-8 space-y-6" @submit.prevent="manejarLogin">
        <div class="rounded-md space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@gmel"
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-sm"
              v-model="correo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-sm"
              v-model="password"
            />
          </div>
        </div>

        <!-- BOTÓN DE INGRESAR CON DETALLE MORADO -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all duration-200 transform active:scale-[0.98]"
          >
            Ingresar al Sistema
          </button>
        </div>
      </form>

      <!-- SIMULADOR DE ROLES (Para que pruebes el front fácil) -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <p class="text-center text-xs font-medium text-gray-400 mb-3">logear como ---:</p>
        <div class="grid grid-cols-3 gap-2">
          <button @click="loginRapido('super')" class="px-2 py-1.5 bg-gray-200">Súper</button>
          <button @click="loginRapido('capturista')" class="px-2 py-1.5 bg-gray-200">
            Capturista
          </button>
          <button @click="loginRapido('consultor')" class="px-2 py-1.5 bg-gray-200">
            Consultor
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const correo = ref('')
const password = ref('')

// Función para cuando den clic al botón normal
const manejarLogin = () => {
  // Por ahora lo mandamos al dashboard por defecto como "super"
  localStorage.setItem('user-rol', 'super')
  router.push('/dashboard')
}

// Función mágica para brincar directo al rol que quieras probar
const loginRapido = (rol) => {
  localStorage.setItem('user-rol', rol)
  router.push('/dashboard')
}
</script>

<style scoped>
/* Animación suave para que la tarjeta aparezca flotando hacia arriba */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div.max-w-md {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
