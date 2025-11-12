import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerPedidosPorEmail } from '../servicios/api';
import LoginForm from '../componentes/LoginForm';
import RegisterForm from '../componentes/RegisterForm';

const Perfil = ({ navigation }) => {
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const [vistaActual, setVistaActual] = useState('inicio'); // inicio, login, registro
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Manejar el botón de retroceso del dispositivo
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (vistaActual !== 'inicio') {
                    setVistaActual('inicio');
                    return true;
                }
                navigation.navigate('Inicio');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation, vistaActual]);

    // Cargar usuario guardado al iniciar
    useEffect(() => {
        cargarUsuarioGuardado();
    }, []);

    const cargarUsuarioGuardado = async () => {
        try {
            const usuarioString = await AsyncStorage.getItem('usuario');
            if (usuarioString) {
                const usuarioGuardado = JSON.parse(usuarioString);
                setUsuarioActivo(usuarioGuardado);
                cargarPedidosUsuario(usuarioGuardado.email);
            }
        } catch (e) { }
    };

    const handleLogin = async (loginForm) => {
        if (!loginForm.email.trim() || !loginForm.email.includes('@')) {
            Alert.alert('⚠️ Error', 'Por favor ingresa un email válido');
            return;
        }
        if (!loginForm.password.trim() || loginForm.password.length < 6) {
            Alert.alert('⚠️ Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setCargando(true);
        try {
            // Aquí iría la llamada a tu API para autenticar
            // Por ahora simulamos un login exitoso
            await new Promise(resolve => setTimeout(resolve, 1000));

            const usuario = {
                nombre: 'Usuario Demo',
                email: loginForm.email
            };

            setUsuarioActivo(usuario);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

            Alert.alert('✅ Bienvenido', `Hola ${usuario.nombre}!`);
            setVistaActual('inicio');
            cargarPedidosUsuario(usuario.email);
        } catch (error) {
            Alert.alert('❌ Error', 'Email o contraseña incorrectos');
        } finally {
            setCargando(false);
        }
    };

    const handleRegistro = async (registroForm) => {
        if (!registroForm.nombre.trim()) {
            Alert.alert('⚠️ Error', 'Por favor ingresa tu nombre');
            return;
        }
        if (!registroForm.email.trim() || !registroForm.email.includes('@')) {
            Alert.alert('⚠️ Error', 'Por favor ingresa un email válido');
            return;
        }
        if (registroForm.password.length < 6) {
            Alert.alert('⚠️ Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (registroForm.password !== registroForm.confirmarPassword) {
            Alert.alert('⚠️ Error', 'Las contraseñas no coinciden');
            return;
        }

        setCargando(true);
        try {
            // Aquí iría la llamada a tu API para registrar
            await new Promise(resolve => setTimeout(resolve, 1000));

            const usuario = {
                nombre: registroForm.nombre,
                email: registroForm.email
            };

            setUsuarioActivo(usuario);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

            Alert.alert('✅ Registro exitoso', `¡Bienvenido ${usuario.nombre}!`);
            setVistaActual('inicio');
        } catch (error) {
            Alert.alert('❌ Error', 'No se pudo completar el registro');
        } finally {
            setCargando(false);
        }
    };

    const handleCerrarSesion = () => {
        Alert.alert(
            '👋 Cerrar sesión',
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
                        Alert.alert('✅ Sesión cerrada', 'Hasta pronto!');
                    }
                }
            ]
        );
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

    const getEstadoColor = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente': return '#FF9800';
            case 'confirmado': return '#2196F3';
            case 'enviado': return '#9C27B0';
            case 'entregado': return '#4CAF50';
            case 'cancelado': return '#f44336';
            case 'completado': return '#4CAF50';
            default: return '#666';
        }
    };

    const getEstadoIcono = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        switch (estadoLower) {
            case 'pendiente': return '⏳';
            case 'confirmado': return '✅';
            case 'enviado': return '🚚';
            case 'entregado': return '📦';
            case 'cancelado': return '❌';
            case 'completado': return '✅';
            default: return '📋';
        }
    };

    // VISTA: Sin iniciar sesión
    if (!usuarioActivo && vistaActual === 'inicio') {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>👤 Mi Perfil</Text>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.noAuthContainer}>
                        <View style={styles.noAuthIconContainer}>
                            <Text style={styles.noAuthIcon}>🔐</Text>
                        </View>
                        <Text style={styles.noAuthTitulo}>¡Bienvenido!</Text>
                        <Text style={styles.noAuthSubtitulo}>
                            Inicia sesión o regístrate para ver tu historial de pedidos y disfrutar de una mejor experiencia
                        </Text>

                        <TouchableOpacity
                            style={styles.botonPrimario}
                            onPress={() => setVistaActual('login')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.textoBotonPrimario}>🔑 Iniciar sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonSecundario}
                            onPress={() => setVistaActual('registro')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.textoBotonSecundario}>✨ Crear cuenta nueva</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>o continúa sin cuenta</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.opcionSinCuenta}
                            onPress={() => navigation.navigate('Inicio')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.opcionSinCuentaTexto}>🏠 Explorar productos</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // VISTA: Login
    if (vistaActual === 'login') {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setVistaActual('inicio')} style={styles.headerBack}>
                        <Text style={styles.headerBackText}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Iniciar sesión</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <LoginForm
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setVistaActual('inicio')} style={styles.headerBack}>
                        <Text style={styles.headerBackText}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Crear cuenta</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <RegisterForm
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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>👤 Mi Perfil</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contenido}>
                    {/* Información del usuario */}
                    <View style={styles.perfilCard}>
                        <View style={styles.perfilIcono}>
                            <Text style={styles.perfilIconoTexto}>
                                {usuarioActivo.nombre.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.perfilInfo}>
                            <Text style={styles.perfilNombre}>{usuarioActivo.nombre}</Text>
                            <Text style={styles.perfilEmail}>{usuarioActivo.email}</Text>
                        </View>
                    </View>

                    {/* Mis pedidos */}
                    <View style={styles.seccion}>
                        <View style={styles.seccionHeader}>
                            <Text style={styles.seccionIcono}>📦</Text>
                            <View style={styles.seccionHeaderTexto}>
                                <Text style={styles.seccionTitulo}>Mis Pedidos</Text>
                                <Text style={styles.seccionSubtitulo}>
                                    {pedidos.length === 0 ? 'Aún no tienes pedidos' : `${pedidos.length} pedido(s)`}
                                </Text>
                            </View>
                        </View>

                        {pedidos.length === 0 ? (
                            <View style={styles.sinPedidos}>
                                <Text style={styles.sinPedidosIcono}>🛍️</Text>
                                <Text style={styles.sinPedidosTexto}>No tienes pedidos aún</Text>
                                <TouchableOpacity
                                    style={styles.botonSecundario}
                                    onPress={() => navigation.navigate('Inicio')}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.textoBotonSecundario}>Empezar a comprar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            pedidos.map((pedido, index) => (
                                <View key={pedido.id} style={[styles.pedidoCard, index === pedidos.length - 1 && styles.pedidoCardLast]}>
                                    <View style={styles.pedidoHeader}>
                                        <View style={styles.pedidoNumero}>
                                            <Text style={styles.pedidoNumeroLabel}>Pedido</Text>
                                            <Text style={styles.pedidoNumeroValor}>#{pedido.id}</Text>
                                        </View>
                                        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(pedido.estado) }]}>
                                            <Text style={styles.estadoIcono}>{getEstadoIcono(pedido.estado)}</Text>
                                            <Text style={styles.estadoTexto}>{pedido.estado}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.pedidoDivider} />

                                    <View style={styles.pedidoInfo}>
                                        <View style={styles.pedidoInfoRow}>
                                            <Text style={styles.pedidoInfoIcono}>📅</Text>
                                            <Text style={styles.pedidoInfoTexto}>
                                                {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Text>
                                        </View>

                                        <View style={styles.pedidoInfoRow}>
                                            <Text style={styles.pedidoInfoIcono}>📍</Text>
                                            <Text style={styles.pedidoInfoTexto} numberOfLines={2}>
                                                {pedido.direccion}
                                            </Text>
                                        </View>

                                        <View style={styles.pedidoInfoRow}>
                                            <Text style={styles.pedidoInfoIcono}>💳</Text>
                                            <Text style={styles.pedidoInfoTexto}>
                                                {pedido.metodo_pago}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.pedidoFooter}>
                                        <Text style={styles.pedidoTotalLabel}>Total pagado</Text>
                                        <Text style={styles.pedidoTotal}>
                                            S/ {parseFloat(pedido.total).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    {/* Opciones */}
                    <View style={styles.seccion}>
                        <TouchableOpacity
                            style={styles.opcion}
                            onPress={() => Alert.alert(
                                '📱 Acerca de',
                                'Tienda Virtual Móvil v1.0\n\nDesarrollada con React Native + Expo\n\n¡Gracias por usar nuestra aplicación!',
                                [{ text: 'Cerrar', style: 'cancel' }]
                            )}
                            activeOpacity={0.7}
                        >
                            <View style={styles.opcionContenido}>
                                <Text style={styles.opcionIcono}>📱</Text>
                                <Text style={styles.opcionTexto}>Acerca de la app</Text>
                            </View>
                            <Text style={styles.opcionFlecha}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.opcion}
                            onPress={() => Alert.alert(
                                '💬 Soporte',
                                '¿Necesitas ayuda?\n\nContacta con nosotros:\n\n📧 Email: soporte@tienda.com\n📞 Teléfono: +51 999 999 999',
                                [{ text: 'Entendido', style: 'default' }]
                            )}
                            activeOpacity={0.7}
                        >
                            <View style={styles.opcionContenido}>
                                <Text style={styles.opcionIcono}>💬</Text>
                                <Text style={styles.opcionTexto}>Soporte y ayuda</Text>
                            </View>
                            <Text style={styles.opcionFlecha}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.opcion}
                            onPress={() => navigation.navigate('LoginAdmin')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.opcionContenido}>
                                <Text style={styles.opcionIcono}>🔐</Text>
                                <Text style={[styles.opcionTexto, styles.opcionAdmin]}>
                                    Panel de Administración
                                </Text>
                            </View>
                            <Text style={styles.opcionFlecha}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.opcion, styles.opcionUltima]}
                            onPress={handleCerrarSesion}
                            activeOpacity={0.7}
                        >
                            <View style={styles.opcionContenido}>
                                <Text style={styles.opcionIcono}>🚪</Text>
                                <Text style={[styles.opcionTexto, styles.opcionCerrarSesion]}>
                                    Cerrar sesión
                                </Text>
                            </View>
                            <Text style={styles.opcionFlecha}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerBack: {
        padding: 4,
    },
    headerBackText: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    contenido: {
        padding: 16,
    },

    // Sin autenticar
    noAuthContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    noAuthIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    noAuthIcon: {
        fontSize: 60,
    },
    noAuthTitulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    noAuthSubtitulo: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },

    // Botones
    botonPrimario: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
    },
    textoBotonPrimario: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botonSecundario: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1.5,
        borderColor: '#2196F3',
        width: '100%',
    },
    textoBotonSecundario: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '600',
    },

    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#999',
    },
    opcionSinCuenta: {
        padding: 12,
    },
    opcionSinCuentaTexto: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

    // Perfil autenticado
    perfilCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    perfilIcono: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    perfilIconoTexto: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    perfilInfo: {
        flex: 1,
    },
    perfilNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    perfilEmail: {
        fontSize: 14,
        color: '#666',
    },

    // Secciones
    seccion: {
        marginBottom: 16,
    },
    seccionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    seccionIcono: {
        fontSize: 24,
        marginRight: 12,
    },
    seccionHeaderTexto: {
        flex: 1,
    },
    seccionTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    seccionSubtitulo: {
        fontSize: 13,
        color: '#666',
    },

    // Sin pedidos
    sinPedidos: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    sinPedidosIcono: {
        fontSize: 48,
        marginBottom: 12,
    },
    sinPedidosTexto: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
        textAlign: 'center',
    },

    // Pedidos
    pedidoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    pedidoCardLast: {
        marginBottom: 0,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pedidoNumero: {
        flex: 1,
    },
    pedidoNumeroLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    pedidoNumeroValor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    estadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    estadoIcono: {
        fontSize: 14,
        marginRight: 4,
    },
    estadoTexto: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'capitalize',
    },
    pedidoDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 12,
    },
    pedidoInfo: {
        marginBottom: 12,
    },
    pedidoInfoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    pedidoInfoIcono: {
        fontSize: 16,
        marginRight: 8,
        marginTop: 2,
    },
    pedidoInfoTexto: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    pedidoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    pedidoTotalLabel: {
        fontSize: 14,
        color: '#666',
    },
    pedidoTotal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },

    // Opciones
    opcion: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    opcionUltima: {
        borderBottomWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    opcionContenido: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    opcionIcono: {
        fontSize: 20,
        marginRight: 12,
    },
    opcionTexto: {
        fontSize: 16,
        color: '#333',
    },
    opcionFlecha: {
        fontSize: 24,
        color: '#ccc',
    },
    opcionAdmin: {
        color: '#2196F3',
        fontWeight: '600',
    },
    opcionCerrarSesion: {
        color: '#f44336',
        fontWeight: '600',
    },
});

export default Perfil;