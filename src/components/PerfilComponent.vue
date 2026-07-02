<script setup>
import { ref } from 'vue'

// 1. Estado para los datos del usuario
const usuario = ref('hermenegildoAng') 
const correo = ref('hernandezhermenegildoangeldavi@gmail.com')

// 2. Estado para el formulario de contraseña
const passwordActual = ref('')
const passwordNueva = ref('')
const passwordConfirmar = ref('')

// 3. Estados de UI
const cargando = ref(false)
const mensajeExito = ref('')
const mensajeError = ref('')

const cambiarPassword = async () => {
  mensajeExito.value = ''
  mensajeError.value = ''

  if (!passwordActual.value || !passwordNueva.value || !passwordConfirmar.value) {
    mensajeError.value = 'Por favor, llena todos los campos.'
    return
  }

  if (passwordNueva.value !== passwordConfirmar.value) {
    mensajeError.value = 'La nueva contraseña y la confirmación no coinciden.'
    return
  }

  if (passwordNueva.value.length < 8) {
    mensajeError.value = 'La nueva contraseña debe tener al menos 8 caracteres.'
    return
  }

  cargando.value = true

  try {
    // Simulación de petición al backend (Django)
    await new Promise(resolve => setTimeout(resolve, 1500)) 
    
    mensajeExito.value = '¡Contraseña actualizada correctamente!'
    passwordActual.value = ''
    passwordNueva.value = ''
    passwordConfirmar.value = ''
  } catch (error) {
    mensajeError.value = 'Hubo un error al cambiar la contraseña. Verifica tu contraseña actual.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50/50 min-h-screen rounded-xl">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Mi Perfil</h1>
      <p class="text-sm text-gray-500">Administra tus datos de usuario y seguridad de la cuenta.</p>
    </div>

    <hr class="border-gray-200" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-fit">
        <div class="flex flex-col items-center text-center space-y-2 pb-4 border-b border-gray-100">
          <div class="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase shadow-md shadow-purple-200">
            {{ usuario[0] }}
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">{{ usuario }}</h2>
            <p class="text-xs text-purple-600 font-semibold tracking-wider uppercase">Administrador</p>
          </div>
        </div>

        <div class="space-y-3 pt-2">
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuario</label>
            <p class="text-sm font-medium text-gray-700 bg-purple-50/50 border border-purple-100 px-3 py-2 rounded-lg mt-1 select-all">
              {{ usuario }}
            </p>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico</label>
            <p class="text-sm font-medium text-gray-700 bg-purple-50/50 border border-purple-100 px-3 py-2 rounded-lg mt-1 select-all overflow-hidden text-ellipsis">
              {{ correo }}
            </p>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Actualizar Contraseña</h3>
        
        <div v-if="mensajeExito" class="mb-4 p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
          {{ mensajeExito }}
        </div>
        <div v-if="mensajeError" class="mb-4 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
          {{ mensajeError }}
        </div>

        <form @submit.prevent="cambiarPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
            <input 
              v-model="passwordActual" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              :disabled="cargando"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
              <input 
                v-model="passwordNueva" 
                type="password" 
                class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Mínimo 8 caracteres"
                :disabled="cargando"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
              <input 
                v-model="passwordConfirmar" 
                type="password" 
                class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Repite la contraseña"
                :disabled="cargando"
              />
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button 
              type="submit" 
              :disabled="cargando"
              class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition shadow-md shadow-purple-100 hover:shadow-lg focus:ring-2 focus:ring-purple-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span v-if="cargando">Actualizando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>