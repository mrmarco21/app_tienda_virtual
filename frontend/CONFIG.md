# Configuración de la Aplicación

## 📡 Configurar Conexión al Backend

### Paso 1: Encontrar tu IP Local

#### Windows
1. Abre el **Símbolo del sistema** (CMD)
2. Ejecuta: `ipconfig`
3. Busca "Dirección IPv4" en tu adaptador de red WiFi
4. Ejemplo: `192.168.1.100`

#### Mac/Linux
1. Abre la **Terminal**
2. Ejecuta: `ifconfig` o `ip addr`
3. Busca "inet" en tu interfaz de red
4. Ejemplo: `192.168.1.100`

### Paso 2: Actualizar la IP en el Frontend

Edita el archivo: `app/app.json`

```javascript
// Línea 5
"apiUrl": "http://192.168.18.31:3000/api"
//                ^^^^^^^^^^^^^^
//              Cambia esto por tu IP
```

### Paso 3: Configurar el Backend

Asegúrate de que el backend esté configurado para aceptar conexiones desde cualquier IP:

En `backend/src/index.js`, verifica que tenga:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
```

### Paso 4: Configurar el Firewall (Windows)

Si tienes problemas de conexión:

1. Abre **Windows Defender Firewall**
2. Click en **Configuración avanzada**
3. Click en **Reglas de entrada**
4. Click en **Nueva regla...**
5. Selecciona **Puerto** → Siguiente
6. Selecciona **TCP** y escribe **3000** → Siguiente
7. Selecciona **Permitir la conexión** → Siguiente
8. Marca todas las opciones → Siguiente
9. Dale un nombre: "Node.js Backend" → Finalizar

## 🔧 Modos de Ejecución

### Desarrollo Local (Mismo dispositivo)

```bash
npm start
```

Presiona `w` para abrir en navegador web.

### Desarrollo en Red Local (Celular físico)

1. Asegúrate de que tu celular y PC estén en la misma red WiFi
2. Ejecuta `npm start`
3. Abre **Expo Go** en tu celular
4. Escanea el código QR

### Tunnel (Si la red local no funciona)

```bash
npm start -- --tunnel
```

Esto usa un túnel de Expo para conectar tu celular, pero es más lento.

## 🐛 Solución de Problemas Comunes

### Error: "Network request failed"

**Causa**: El frontend no puede conectarse al backend.

**Soluciones**:
1. Verifica que el backend esté corriendo (`npm run dev` en la carpeta backend)
2. Verifica que la IP en `app.json` sea correcta
3. Verifica que ambos dispositivos estén en la misma red WiFi
4. Desactiva temporalmente el firewall para probar
5. Intenta usar `--tunnel` en lugar de LAN

### Error: "Unable to resolve module"

**Causa**: Dependencias no instaladas correctamente.

**Solución**:
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### La app se cierra al abrir

**Causa**: Error en el código o dependencias faltantes.

**Solución**:
1. Revisa los logs en la terminal
2. Ejecuta `npm start -- --clear` para limpiar caché
3. Verifica que todas las dependencias estén instaladas

### El carrito no guarda los productos

**Causa**: El contexto no está envolviendo correctamente la app.

**Solución**: Verifica que `App.js` tenga el `CarritoProvider` envolviendo el `AppNavigator`.

## 📱 Probar en Diferentes Dispositivos

### Android Emulator

1. Instala Android Studio
2. Configura un AVD (Android Virtual Device)
3. Ejecuta `npm start` y presiona `a`

### iOS Simulator (Solo Mac)

1. Instala Xcode
2. Ejecuta `npm start` y presiona `i`

### Navegador Web

1. Ejecuta `npm start` y presiona `w`
2. Nota: Algunas funcionalidades móviles pueden no funcionar

## 🚀 Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Limpiar caché y reiniciar
npm start -- --clear

# Usar túnel (más lento pero más compatible)
npm start -- --tunnel

# Ver logs detallados
npm start -- --verbose
```

## 📊 Variables de Entorno (Opcional)

Si quieres usar variables de entorno, crea un archivo `app.config.js`:

```javascript
export default {
  expo: {
    name: "Tienda Virtual",
    slug: "tienda-virtual",
    extra: {
      apiUrl: process.env.API_URL || "http://192.168.1.100:3000/api"
    }
  }
};
```

Luego en `api.js`:

```javascript
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.apiUrl;
```
