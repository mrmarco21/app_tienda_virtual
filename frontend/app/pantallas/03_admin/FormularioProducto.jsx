import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
    KeyboardAvoidingView,
    BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { crearProducto, actualizarProducto, obtenerCategorias, subirImagen } from '../../servicios/api';

// Importar componentes
import ToastNotification from '../../componentes/06_secciones/ToastNotification';
import SeccionImagen from '../../componentes/06_secciones/SeccionImagen';
import SeccionInformacion from '../../componentes/06_secciones/SeccionInformacion';
import ModalCategorias from '../../componentes/05_modales/ModalCategorias';
import ModalSeleccionImagen from '../../componentes/05_modales/ModalSeleccionImagen';
import BotonesAccion from '../../componentes/06_secciones/BotonesAccion';

const FormularioProducto = ({ navigation, route }) => {
    const producto = route.params?.producto;
    const esEdicion = !!producto;

    // Estados del formulario
    const [datos, setDatos] = useState({
        nombre: producto?.nombre || '',
        categoria: producto?.categoria || '',
        precio: producto?.precio?.toString() || '',
        stock: producto?.stock?.toString() || '',
        descripcion: producto?.descripcion || '',
        imagen: producto?.imagen || '',
    });

    const [imagenLocal, setImagenLocal] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
    const [mostrarModalImagen, setMostrarModalImagen] = useState(false);
    const [categoriasBD, setCategoriasBD] = useState([]);

    // Estado para Toast
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success',
    });

    // Cargar categorías de la BD al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const res = await obtenerCategorias();
            // Normalizar la respuesta
            let categorias = [];
            if (res?.data?.data) {
                categorias = Array.isArray(res.data.data) ? res.data.data : [];
            } else if (res?.data) {
                categorias = Array.isArray(res.data) ? res.data : [];
            } else if (Array.isArray(res)) {
                categorias = res;
            }

            // Asegurar que las categorías estén en el formato correcto
            const categoriasFormateadas = categorias.map(cat => {
                if (typeof cat === 'string') {
                    return { categoria: cat };
                }
                return cat;
            });

            setCategoriasBD(categoriasFormateadas);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            // No mostrar error al usuario, simplemente no habrá categorías de BD
        }
    };

    // Manejar el botón de retroceso físico (sin conflictos con navegación principal)
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Si hay cambios sin guardar, mostrar confirmación
            const hayCambios = datos.nombre || datos.precio || datos.stock || datos.categoria;

            if (hayCambios) {
                Alert.alert(
                    'Descartar cambios',
                    '¿Estás seguro de salir? Los cambios no guardados se perderán.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                            text: 'Salir',
                            onPress: () => navigation.goBack(),
                            style: 'destructive'
                        },
                    ]
                );
                return true; // Previene la acción por defecto
            }

            // Si no hay cambios, permitir retroceder normalmente
            return false; // Permite que la navegación principal maneje el retroceso
        });

        return () => backHandler.remove();
    }, [datos, navigation]);

    // Función para mostrar Toast
    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    // Seleccionar imagen de la galería
    const seleccionarImagen = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                showToast('Necesitamos permisos para acceder a tus fotos', 'error');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImagenLocal(result.assets[0].uri);
                await subirImagenCloudinary(result.assets[0].uri);
            }
        } catch (error) {
            showToast('No se pudo seleccionar la imagen', 'error');
        }
    };

    // Tomar foto con la cámara
    const tomarFoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                showToast('Necesitamos permisos para usar la cámara', 'error');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImagenLocal(result.assets[0].uri);
                await subirImagenCloudinary(result.assets[0].uri);
            }
        } catch (error) {
            showToast('No se pudo tomar la foto', 'error');
        }
    };

    // Subir imagen a Cloudinary
    const subirImagenCloudinary = async (uri) => {
        setSubiendoImagen(true);
        try {
            const response = await subirImagen(uri);

            if (response.success && (response.url || response.secure_url)) {
                const imageUrl = response.url || response.secure_url;
                setDatos({ ...datos, imagen: imageUrl });
                showToast('Imagen subida correctamente', 'success');
            } else {
                throw new Error(response.message || 'No se recibió la URL de la imagen');
            }
        } catch (error) {
            console.error('❌ Error al subir imagen:', error);

            let errorMessage = 'No se pudo subir la imagen';
            if (error.message) {
                errorMessage = error.message;
            }

            showToast(errorMessage, 'error');
            setImagenLocal(null);
        } finally {
            setSubiendoImagen(false);
        }
    };

    // Mostrar opciones de imagen
    const mostrarOpcionesImagen = () => {
        setMostrarModalImagen(true);
    };

    // Guardar producto
    const handleGuardar = async () => {
        // Validaciones
        if (!datos.nombre || !datos.categoria || !datos.precio || !datos.stock) {
            showToast('Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        if (!datos.imagen) {
            showToast('Por favor agrega una imagen del producto', 'error');
            return;
        }

        if (isNaN(datos.precio) || parseFloat(datos.precio) <= 0) {
            showToast('El precio debe ser un número válido mayor a 0', 'error');
            return;
        }

        if (isNaN(datos.stock) || parseInt(datos.stock) < 0) {
            showToast('El stock debe ser un número válido', 'error');
            return;
        }

        setCargando(true);
        try {
            const productoData = {
                ...datos,
                precio: parseFloat(datos.precio),
                stock: parseInt(datos.stock),
            };

            if (esEdicion) {
                await actualizarProducto(producto.id, productoData);
                showToast('Producto actualizado correctamente', 'success');
            } else {
                await crearProducto(productoData);
                showToast('Producto creado correctamente', 'success');
            }

            // Esperar para que el usuario vea el toast antes de navegar
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (error) {
            showToast(error.message || 'No se pudo guardar el producto', 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            {/* Toast Notification */}
            <ToastNotification
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>
                        {esEdicion ? 'Editar' : 'Nuevo'} Producto
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {esEdicion ? 'Actualiza la información' : 'Completa los datos'}
                    </Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Sección de Imagen */}
                <SeccionImagen
                    imagenLocal={imagenLocal}
                    imagenUrl={datos.imagen}
                    subiendoImagen={subiendoImagen}
                    onPressMostrarOpciones={mostrarOpcionesImagen}
                />

                {/* Sección de Información */}
                <SeccionInformacion
                    datos={datos}
                    setDatos={setDatos}
                    onAbrirModalCategorias={() => setMostrarModalCategorias(true)}
                />

                {/* Botones de Acción */}
                <BotonesAccion
                    esEdicion={esEdicion}
                    cargando={cargando}
                    subiendoImagen={subiendoImagen}
                    onCancelar={() => navigation.goBack()}
                    onGuardar={handleGuardar}
                />

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modal de Categorías */}
            <ModalCategorias
                visible={mostrarModalCategorias}
                categoriaSeleccionada={datos.categoria}
                categoriasBD={categoriasBD}
                onSeleccionar={(categoria) => setDatos({ ...datos, categoria })}
                onCerrar={() => setMostrarModalCategorias(false)}
                onToast={showToast}
            />

            {/* Modal de Selección de Imagen */}
            <ModalSeleccionImagen
                visible={mostrarModalImagen}
                onCerrar={() => setMostrarModalImagen(false)}
                onTomarFoto={tomarFoto}
                onSeleccionarGaleria={seleccionarImagen}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
});

export default FormularioProducto;