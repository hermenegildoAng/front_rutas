// src/composables/useLectorRutas.js
import { ref } from 'vue'

export function useLectorRutas(onPuntosCargados) {
  const archivoSeleccionado = ref(null)
  const archivoValido = ref(false)
  const archivoCargando = ref(false)
  const archivoResultado = ref(null)

  const limpiarArchivo = () => {
    archivoSeleccionado.value = null
    archivoValido.value = false
  }

  // Tu lógica exacta para GeoJSON
  const parsearGeoJSON = (data) => {
    let pts = []
    if (data.type === 'FeatureCollection') {
      const feature = data.features.find(f => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'))
      if (feature) {
        if (feature.geometry.type === 'LineString') {
          pts = feature.geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }))
        } else if (feature.geometry.type === 'MultiLineString') {
          pts = feature.geometry.coordinates[0].map(c => ({ lat: c[1], lng: c[0] }))
        }
      }
    } else if (data.type === 'Feature' && data.geometry) {
      if (data.geometry.type === 'LineString') {
        pts = data.geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }))
      }
    }
    return pts
  }

  // Tu lógica exacta para GPX
  const parsearGPX = (doc) => {
    const pts = []
    const trkpts = doc.getElementsByTagName('trkpt')
    if (trkpts.length > 0) {
      for (let i = 0; i < trkpts.length; i++) {
        pts.push({
          lat: parseFloat(trkpts[i].getAttribute('lat')),
          lng: parseFloat(trkpts[i].getAttribute('lon'))
        })
      }
    } else {
      const wpt = doc.getElementsByTagName('wpt')
      for (let i = 0; i < wpt.length; i++) {
        pts.push({
          lat: parseFloat(wpt[i].getAttribute('lat')),
          lng: parseFloat(wpt[i].getAttribute('lon'))
        })
      }
    }
    return pts
  }

  // Tu lógica exacta para KML
  const parsearKML = (doc) => {
    const pts = []
    const coordinatesNodes = doc.getElementsByTagName('coordinates')
    if (coordinatesNodes.length > 0) {
      const coordStr = coordinatesNodes[0].textContent.trim()
      const pairs = coordStr.split(/\s+/)
      pairs.forEach(p => {
        const parts = p.split(',')
        if (parts.length >= 2) {
          pts.push({ lat: parseFloat(parts[1]), lng: parseFloat(parts[0]) })
        }
      })
    }
    return pts
  }

  const procesarArchivo = async () => {
    if (!archivoSeleccionado.value || !archivoValido.value) return
    archivoCargando.value = true
    archivoResultado.value = null

    try {
      const text = await archivoSeleccionado.value.text()
      const extension = '.' + archivoSeleccionado.value.name.split('.').pop().toLowerCase()
      let puntos = []

      if (extension === '.geojson' || extension === '.json') {
        puntos = parsearGeoJSON(JSON.parse(text))
      } else if (extension === '.gpx' || extension === '.kml') {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, 'text/xml')
        puntos = extension === '.gpx' ? parsearGPX(xmlDoc) : parsearKML(xmlDoc)
      }

      if (puntos.length === 0) {
        archivoResultado.value = { ok: false, mensaje: 'No se encontraron puntos en el archivo.' }
        return
      }

      // Pasamos los puntos al callback (para que el componente padre los dibuje en el mapa)
      onPuntosCargados(puntos)
      
      archivoResultado.value = { ok: true, mensaje: `${puntos.length} puntos cargados correctamente.` }
      limpiarArchivo()

    } catch (err) {
      console.error('Error parseando archivo:', err)
      archivoResultado.value = { ok: false, mensaje: 'Error al leer el archivo. Verifica que sea válido.' }
    } finally {
      archivoCargando.value = false
    }
  }

  return {
    archivoSeleccionado,
    archivoValido,
    archivoCargando,
    archivoResultado,
    limpiarArchivo,
    procesarArchivo
  }
}