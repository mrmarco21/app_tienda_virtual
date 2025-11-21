import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    BackHandler,
    Platform,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { login, registro, obtenerPedidosPorEmail } from '../../servicios/api';
import FormularioLogin from '../../componentes/04_formularios/FormularioLogin';
import FormularioRegistro from '../../componentes/04_formularios/FormularioRegistro';
import ModalLoginAdmin from '../../componentes/05_modales/ModalLoginAdmin';
import TarjetaPerfil from '../../componentes/02_tarjetas/TarjetaPerfil';
import ListaPedidos from '../../componentes/03_listas/ListaPedidos';
import ModalDetallePedido from '../../componentes/05_modales/ModalDetallePedido';
import OpcionesPerfil from '../../componentes/06_secciones/OpcionesPerfil';

const Perfil = ({ navigation }) => {
    // Estados principales
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const [vistaActual, setVistaActual] = useState('inicio');
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Estados para modales
    const [modalAdminVisible, setModalAdminVisible] = useState(false);
    const [cargandoAdmin, setCargandoAdmin] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [modalDetalleVisible, setModalDetalleVisible] = useState(false);

    // Estado para expandir/colapsar pedidos
    const [pedidosExpandido, setPedidosExpandido] = useState(false);

    // Manejo del botón back
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (modalAdminVisible) {
                    setModalAdminVisible(false);
                    return true;
                }
                if (vistaActual !== 'inicio') {
                    setVistaActual('inicio');
                    return true;
                }
                navigation.navigate('Inicio');
                return true;
            }
        );
        return () => backHandler.remove();
    }, [navigation, vistaActual, modalAdminVisible]);

    // Cargar usuario al iniciar
    useEffect(() => {
        cargarUsuarioGuardado();
    }, []);

    const cargarUsuarioGuardado = async () => {
        try {
            const usuarioString = await AsyncStorage.getItem('usuario');
            if (usuarioString) {
                const usuarioGuardado = JSON.parse(usuarioString);
                setUsuarioActivo(usuarioGuardado);
                const rolLower = usuarioGuardado.rol?.toLowerCase() || '';
                if (rolLower === 'cliente' || !rolLower) {
                    cargarPedidosUsuario(usuarioGuardado.email);
                }
            }
        } catch (e) { }
    };

    const cargarPedidosUsuario = async (email) => {
        try {
            const response = await obtenerPedidosPorEmail(email);
            const pedidosData = response.data || [];
            setPedidos(pedidosData);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
        }
    };

    // Login de admin
    const handleLoginAdmin = async (adminForm) => {
        if (!adminForm.email.trim() || !adminForm.email.includes('@')) {
            Alert.alert('Datos incompletos', 'Por favor ingresa un email válido');
            return;
        }
        if (!adminForm.password.trim() || adminForm.password.length < 6) {
            Alert.alert('Datos incompletos', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setCargandoAdmin(true);
        try {
            const data = await login(adminForm.email, adminForm.password);
            const { usuario, token } = data;
            const rolLower = usuario.rol?.toLowerCase() || '';

            if (rolLower !== 'admin' && rolLower !== 'vendedor') {
                Alert.alert(
                    'Acceso denegado',
                    'Esta cuenta no tiene permisos de administrador',
                    [{ text: 'Entendido', style: 'cancel' }]
                );
                return;
            }

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

            setModalAdminVisible(false);

            Alert.alert(
                'Bienvenido Admin',
                `Accediendo al panel de administración...`,
                [{ text: 'Continuar', onPress: () => navigation.navigate('Admin') }]
            );
        } catch (error) {
            Alert.alert('Error de autenticación', error.message || 'Credenciales incorrectas');
        } finally {
            setCargandoAdmin(false);
        }
    };

    // Login de cliente
    const handleLogin = async (loginForm) => {
        if (!loginForm.email.trim() || !loginForm.email.includes('@')) {
            Alert.alert('Datos incompletos', 'Por favor ingresa un email válido');
            return;
        }
        if (!loginForm.password.trim() || loginForm.password.length < 6) {
            Alert.alert('Datos incompletos', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setCargando(true);
        try {
            const data = await login(loginForm.email, loginForm.password);
            const { usuario, token } = data;
            const rolLower = usuario.rol?.toLowerCase() || '';

            if (rolLower === 'admin' || rolLower === 'vendedor') {
                Alert.alert(
                    'Acceso restringido',
                    'Esta es el área de clientes. Si eres administrador, usa el botón de acceso administrativo (icono de escudo) en la esquina superior.',
                    [{ text: 'Entendido', style: 'cancel' }]
                );
                setCargando(false);
                return;
            }

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            setUsuarioActivo(usuario);

            Alert.alert('¡Bienvenido!', `Hola ${usuario.nombre}!`);
            setVistaActual('inicio');
            cargarPedidosUsuario(usuario.email);
        } catch (error) {
            Alert.alert('Error', error.message || 'Email o contraseña incorrectos');
        } finally {
            setCargando(false);
        }
    };

    // Registro
    const handleRegistro = async (registroForm) => {
        if (!registroForm.nombre.trim()) {
            Alert.alert('Datos incompletos', 'Por favor ingresa tu nombre');
            return;
        }
        if (!registroForm.email.trim() || !registroForm.email.includes('@')) {
            Alert.alert('Datos incompletos', 'Por favor ingresa un email válido');
            return;
        }
        if (registroForm.password.length < 6) {
            Alert.alert('Datos incompletos', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (registroForm.password !== registroForm.confirmarPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setCargando(true);
        try {
            const data = await registro(registroForm.nombre, registroForm.email, registroForm.password);
            const { usuario, token } = data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            setUsuarioActivo(usuario);

            Alert.alert('¡Registro exitoso!', `¡Bienvenido ${usuario.nombre}!`);
            setVistaActual('inicio');
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo completar el registro');
        } finally {
            setCargando(false);
        }
    };

    // Cerrar sesión
    const handleCerrarSesion = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: () => {
                        setUsuarioActivo(null);
                        setPedidos([]);
                        AsyncStorage.removeItem('usuario');
                        AsyncStorage.removeItem('token');
                        Alert.alert('Sesión cerrada', 'Hasta pronto!');
                    }
                }
            ]
        );
    };

    // Ver detalle de pedido
    const handleVerDetalle = (pedido) => {
        setPedidoSeleccionado(pedido);
        setModalDetalleVisible(true);
    };

    // Funciones de utilidad
    const getEstadoColor = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente': return '#F59E0B';
            case 'confirmado': return '#3B82F6';
            case 'enviado': return '#8B5CF6';
            case 'entregado': return '#10B981';
            case 'cancelado': return '#EF4444';
            case 'completado': return '#10B981';
            default: return '#6B7280';
        }
    };

    const getEstadoIcono = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente': return 'time-outline';
            case 'confirmado': return 'checkmark-circle-outline';
            case 'enviado': return 'airplane-outline';
            case 'entregado': return 'checkmark-done-circle-outline';
            case 'cancelado': return 'close-circle-outline';
            case 'completado': return 'checkmark-done-outline';
            default: return 'document-text-outline';
        }
    };

    // VISTA: Sin iniciar sesión
    if (!usuarioActivo && vistaActual === 'inicio') {
        return (
            <View style={styles.container}>
                <View style={[
                    styles.header,
                    { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
                ]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate('Inicio')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mi Perfil</Text>

                    <TouchableOpacity
                        style={styles.adminButton}
                        onPress={() => setModalAdminVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.noAuthContainer}>
                        <View style={styles.noAuthIconContainer}>
                            <Ionicons name="person-circle-outline" size={80} color="#3B82F6" />
                        </View>
                        <Text style={styles.noAuthTitulo}>¡Bienvenido!</Text>
                        <Text style={styles.noAuthSubtitulo}>
                            Inicia sesión o regístrate para acceder a tu historial de pedidos y disfrutar de beneficios exclusivos
                        </Text>

                        <TouchableOpacity
                            style={styles.botonPrimario}
                            onPress={() => setVistaActual('login')}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="log-in-outline" size={20} color="#FFF" style={styles.botonIcon} />
                            <Text style={styles.textoBotonPrimario}>Iniciar sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonSecundario}
                            onPress={() => setVistaActual('registro')}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="person-add-outline" size={20} color="#3B82F6" style={styles.botonIcon} />
                            <Text style={styles.textoBotonSecundario}>Crear cuenta nueva</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>o continúa explorando</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.opcionSinCuenta}
                            onPress={() => navigation.navigate('Inicio')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="storefront-outline" size={20} color="#6B7280" />
                            <Text style={styles.opcionSinCuentaTexto}>Ver productos</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <ModalLoginAdmin
                    visible={modalAdminVisible}
                    onClose={() => setModalAdminVisible(false)}
                    onLogin={handleLoginAdmin}
                    cargando={cargandoAdmin}
                />
            </View>
        );
    }

    // VISTA: Login
    if (vistaActual === 'login') {
        return (
            <View style={styles.container}>
                <View style={[
                    styles.header,
                    { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
                ]}>
                    <TouchableOpacity
                        onPress={() => setVistaActual('inicio')}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Iniciar sesión</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <FormularioLogin
                        onLogin={handleLogin}
                        onSwitchToRegister={() => setVistaActual('registro')}
                        cargando={cargando}
                    />
                </ScrollView>
            </View>
        );
    }

    // VISTA: Registro
    if (vistaActual === 'registro') {
        return (
            <View style={styles.container}>
                <View style={[
                    styles.header,
                    { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
                ]}>
                    <TouchableOpacity
                        onPress={() => setVistaActual('inicio')}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Crear cuenta</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <FormularioRegistro
                        onRegister={handleRegistro}
                        onSwitchToLogin={() => setVistaActual('login')}
                        cargando={cargando}
                    />
                </ScrollView>
            </View>
        );
    }

    // VISTA: Usuario autenticado
    return (
        <View style={styles.container}>
            <View style={[
                styles.header,
                { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
            ]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Inicio')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contenido}>
                    <TarjetaPerfil usuario={usuarioActivo} />

                    <ListaPedidos
                        pedidos={pedidos}
                        expandido={pedidosExpandido}
                        onToggleExpandir={() => setPedidosExpandido(!pedidosExpandido)}
                        getEstadoColor={getEstadoColor}
                        getEstadoIcono={getEstadoIcono}
                        onVerDetalle={handleVerDetalle}
                        navigation={navigation}
                    />

                    <OpcionesPerfil onCerrarSesion={handleCerrarSesion} />

                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>

            <ModalDetallePedido
                visible={modalDetalleVisible}
                pedido={pedidoSeleccionado}
                onClose={() => setModalDetalleVisible(false)}
                getEstadoColor={getEstadoColor}
                getEstadoIcono={getEstadoIcono}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    adminButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    contenido: {
        padding: 16,
    },
    noAuthContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    noAuthIconContainer: {
        marginBottom: 24,
    },
    noAuthTitulo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    noAuthSubtitulo: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    botonPrimario: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    botonIcon: {
        marginRight: 8,
    },
    textoBotonPrimario: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    botonSecundario: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3B82F6',
        gap: 8,
    },
    textoBotonSecundario: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '700',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#9CA3AF',
        fontSize: 13,
    },
    opcionSinCuenta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
    },
    opcionSinCuentaTexto: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default Perfil;