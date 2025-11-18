import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    Alert, 
    ActivityIndicator, 
    Modal,
    Platform,
    StatusBar,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../contexto/CarritoContext';
import { crearPedido } from '../servicios/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmacionCompra = ({ navigation }) => {
    const { carrito, vaciarCarrito, obtenerTotal } = useCarrito();
    const [cargando, setCargando] = useState(false);
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const [mostrarModalPago, setMostrarModalPago] = useState(false);
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [metodoPagoExpandido, setMetodoPagoExpandido] = useState(null);
    const [pasoActual, setPasoActual] = useState(1);

    const [formData, setFormData] = useState({
        nombre_cliente: '',
        email: '',
        telefono: '',
        direccion: '',
        metodo_pago: ''
    });

    const [datosPagoTarjeta, setDatosPagoTarjeta] = useState({
        numero_tarjeta: '',
        fecha_expiracion: '',
        cvv: '',
        nombre_titular: '',
        dni: ''
    });

    const [datosPagoYape, setDatosPagoYape] = useState({
        numero_celular: '',
        dni: '',
        codigo_aprobacion: ''
    });

    const metodosPago = [
        {
            id: 'tarjeta',
            nombre: 'Tarjeta de Crédito/Débito',
            icono: 'card-outline',
            color: '#3B82F6',
            descripcion: 'Pago seguro con tarjeta'
        },
        {
            id: 'billetera',
            nombre: 'Yape',
            icono: 'phone-portrait-outline',
            color: '#722F87',
            descripcion: 'Pago rápido con billetera digital'
        }
    ];

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const usuarioString = await AsyncStorage.getItem('usuario');
                if (usuarioString) {
                    const usuario = JSON.parse(usuarioString);
                    setUsuarioActivo(usuario);
                    setFormData(prev => ({
                        ...prev,
                        nombre_cliente: usuario.nombre || prev.nombre_cliente,
                        email: usuario.email || prev.email,
                        telefono: usuario.telefono || prev.telefono,
                    }));
                }
            } catch (e) { }
        };
        cargarUsuario();
    }, []);

    const validarFormulario = () => {
        if (!formData.nombre_cliente.trim()) {
            Alert.alert('Datos incompletos', 'Por favor ingresa tu nombre completo');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            Alert.alert('Datos incompletos', 'Por favor ingresa un email válido');
            return false;
        }
        if (!formData.telefono.trim()) {
            Alert.alert('Datos incompletos', 'Por favor ingresa tu teléfono');
            return false;
        }
        if (!formData.direccion.trim()) {
            Alert.alert('Datos incompletos', 'Por favor ingresa tu dirección de entrega');
            return false;
        }
        if (!formData.metodo_pago) {
            Alert.alert('Datos incompletos', 'Por favor selecciona un método de pago');
            return false;
        }

        if (formData.metodo_pago === 'tarjeta') {
            if (!datosPagoTarjeta.numero_tarjeta || !datosPagoTarjeta.fecha_expiracion ||
                !datosPagoTarjeta.cvv || !datosPagoTarjeta.nombre_titular || !datosPagoTarjeta.dni) {
                Alert.alert('Datos incompletos', 'Por favor completa todos los datos de la tarjeta');
                return false;
            }
        }

        if (formData.metodo_pago === 'billetera') {
            if (!datosPagoYape.numero_celular || !datosPagoYape.dni || !datosPagoYape.codigo_aprobacion) {
                Alert.alert('Datos incompletos', 'Por favor completa todos los datos de Yape');
                return false;
            }
        }

        return true;
    };

    const simularPago = async () => {
        setProcesandoPago(true);
        setPagoExitoso(false);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setProcesandoPago(false);
        setPagoExitoso(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
    };

    const handleConfirmarCompra = async () => {
        if (!validarFormulario()) return;
        setMostrarModalPago(true);
    };

    const procesarPedido = async () => {
        try {
            const pagoRealizado = await simularPago();

            if (!pagoRealizado) {
                throw new Error('Pago cancelado');
            }

            const pedidoData = {
                nombre_cliente: formData.nombre_cliente,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                total: obtenerTotal(),
                metodo_pago: formData.metodo_pago === 'billetera' ? 'Yape' : 'Tarjeta',
                productos: carrito.map(p => ({
                    producto_id: p.id,
                    cantidad: p.cantidad,
                    subtotal: p.precio * p.cantidad
                })),
                usuario_id: usuarioActivo?.id || null
            };

            const response = await crearPedido(pedidoData);

            setMostrarModalPago(false);

            Alert.alert(
                '¡Compra exitosa!',
                `Tu pedido #${response.pedidoId} ha sido confirmado.\n\n${usuarioActivo ? 'Puedes ver tu historial en la sección de Perfil.' : 'Te hemos enviado un email con los detalles.'}`,
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            vaciarCarrito();
                            navigation.navigate('Inicio');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error(error);
            setMostrarModalPago(false);
            Alert.alert('Error', 'No se pudo procesar tu pedido. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        if (mostrarModalPago && !procesandoPago && !pagoExitoso) {
            procesarPedido();
        }
    }, [mostrarModalPago]);

    const toggleMetodoPago = (metodoId) => {
        if (metodoPagoExpandido === metodoId) {
            setMetodoPagoExpandido(null);
            setFormData(prev => ({ ...prev, metodo_pago: '' }));
        } else {
            setMetodoPagoExpandido(metodoId);
            setFormData(prev => ({ ...prev, metodo_pago: metodoId }));
        }
    };

    const renderFormularioTarjeta = () => (
        <View style={styles.formularioPago}>
            <View style={styles.tarjetasAceptadas}>
                <View style={styles.tarjetaBadge}>
                    <Ionicons name="card" size={16} color="#1565C0" />
                    <Text style={styles.tarjetaBadgeTexto}>VISA</Text>
                </View>
                <View style={styles.tarjetaBadge}>
                    <Ionicons name="card" size={16} color="#EB001B" />
                    <Text style={styles.tarjetaBadgeTexto}>MC</Text>
                </View>
                <View style={styles.tarjetaBadge}>
                    <Ionicons name="card" size={16} color="#006FCF" />
                    <Text style={styles.tarjetaBadgeTexto}>AMEX</Text>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Número de tarjeta</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputPago}
                        placeholder="1234 5678 9012 3456"
                        value={datosPagoTarjeta.numero_tarjeta}
                        onChangeText={(text) => setDatosPagoTarjeta(prev => ({ ...prev, numero_tarjeta: text }))}
                        keyboardType="numeric"
                        maxLength={16}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Vencimiento</Text>
                    <TextInput
                        style={styles.inputPago}
                        placeholder="MM/AA"
                        value={datosPagoTarjeta.fecha_expiracion}
                        onChangeText={(text) => setDatosPagoTarjeta(prev => ({ ...prev, fecha_expiracion: text }))}
                        maxLength={5}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                        style={styles.inputPago}
                        placeholder="123"
                        value={datosPagoTarjeta.cvv}
                        onChangeText={(text) => setDatosPagoTarjeta(prev => ({ ...prev, cvv: text }))}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre del titular</Text>
                <TextInput
                    style={styles.inputPago}
                    placeholder="Como aparece en la tarjeta"
                    value={datosPagoTarjeta.nombre_titular}
                    onChangeText={(text) => setDatosPagoTarjeta(prev => ({ ...prev, nombre_titular: text }))}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="characters"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>DNI del titular</Text>
                <TextInput
                    style={styles.inputPago}
                    placeholder="12345678"
                    value={datosPagoTarjeta.dni}
                    onChangeText={(text) => setDatosPagoTarjeta(prev => ({ ...prev, dni: text }))}
                    keyboardType="numeric"
                    maxLength={8}
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            <View style={styles.infoSeguridad}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                <Text style={styles.infoSeguridadTexto}>
                    Tus datos están protegidos con encriptación SSL de 256 bits
                </Text>
            </View>
        </View>
    );

    const renderFormularioYape = () => (
        <View style={styles.formularioPago}>
            <View style={styles.yapeHeader}>
                <View style={styles.yapeLogoContainer}>
                    <Ionicons name="phone-portrait" size={32} color="#FFF" />
                </View>
                <Text style={styles.yapeTitle}>Pago con Yape</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Número de celular</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputPago}
                        placeholder="987654321"
                        value={datosPagoYape.numero_celular}
                        onChangeText={(text) => setDatosPagoYape(prev => ({ ...prev, numero_celular: text }))}
                        keyboardType="phone-pad"
                        maxLength={9}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>DNI</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputPago}
                        placeholder="12345678"
                        value={datosPagoYape.dni}
                        onChangeText={(text) => setDatosPagoYape(prev => ({ ...prev, dni: text }))}
                        keyboardType="numeric"
                        maxLength={8}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Código de aprobación</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="key-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputPago}
                        placeholder="Ingresa el código de tu app Yape"
                        value={datosPagoYape.codigo_aprobacion}
                        onChangeText={(text) => setDatosPagoYape(prev => ({ ...prev, codigo_aprobacion: text }))}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.instruccionesYape}>
                <Text style={styles.instruccionesTitle}>¿Cómo yapear?</Text>
                <View style={styles.instruccionItem}>
                    <View style={styles.numeroPaso}>
                        <Text style={styles.numeroTexto}>1</Text>
                    </View>
                    <Text style={styles.instruccionTexto}>Abre tu app Yape</Text>
                </View>
                <View style={styles.instruccionItem}>
                    <View style={styles.numeroPaso}>
                        <Text style={styles.numeroTexto}>2</Text>
                    </View>
                    <Text style={styles.instruccionTexto}>Yapea S/ {obtenerTotal().toFixed(2)}</Text>
                </View>
                <View style={styles.instruccionItem}>
                    <View style={styles.numeroPaso}>
                        <Text style={styles.numeroTexto}>3</Text>
                    </View>
                    <Text style={styles.instruccionTexto}>Ingresa el código aquí</Text>
                </View>
            </View>
        </View>
    );

    const renderModalPago = () => {
        const metodoPago = metodosPago.find(m => m.id === formData.metodo_pago);

        return (
            <Modal
                visible={mostrarModalPago}
                transparent={true}
                animationType="fade"
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {procesandoPago && (
                            <>
                                <View style={styles.processingIcon}>
                                    <ActivityIndicator size="large" color="#3B82F6" />
                                </View>
                                <Text style={styles.modalTitulo}>Procesando pago</Text>
                                <Text style={styles.modalSubtitulo}>
                                    {formData.metodo_pago === 'billetera'
                                        ? 'Verificando tu operación de Yape'
                                        : 'Validando datos de tu tarjeta'}
                                </Text>
                                <View style={styles.paymentDetails}>
                                    <View style={styles.paymentDetailRow}>
                                        <Ionicons name="card-outline" size={20} color="#6B7280" />
                                        <Text style={styles.paymentMethod}>{metodoPago?.nombre}</Text>
                                    </View>
                                    <Text style={styles.paymentAmount}>S/ {obtenerTotal().toFixed(2)}</Text>
                                </View>
                            </>
                        )}

                        {pagoExitoso && (
                            <>
                                <View style={styles.successIcon}>
                                    <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                                </View>
                                <Text style={styles.modalTitulo}>¡Pago exitoso!</Text>
                                <Text style={styles.modalSubtitulo}>
                                    Procesando tu pedido...
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[
                styles.header,
                { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
            ]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Finalizar compra</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.scroll} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Resumen del pedido */}
                <View style={styles.resumenCard}>
                    <View style={styles.resumenHeader}>
                        <Ionicons name="receipt-outline" size={24} color="#3B82F6" />
                        <Text style={styles.resumenTitle}>Resumen del pedido</Text>
                    </View>
                    <View style={styles.resumenRow}>
                        <Text style={styles.resumenLabel}>Productos ({carrito.length})</Text>
                        <Text style={styles.resumenValor}>S/ {obtenerTotal().toFixed(2)}</Text>
                    </View>
                    <View style={styles.resumenRow}>
                        <View style={styles.envioLabel}>
                            <Ionicons name="rocket-outline" size={16} color="#10B981" />
                            <Text style={styles.resumenLabel}>Envío</Text>
                        </View>
                        <Text style={styles.envioGratis}>GRATIS</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.resumenRow}>
                        <Text style={styles.totalLabel}>Total a pagar</Text>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalMoneda}>S/</Text>
                            <Text style={styles.totalValor}>{obtenerTotal().toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Prompt para iniciar sesión */}
                {!usuarioActivo && (
                    <View style={styles.loginPrompt}>
                        <Ionicons name="person-circle-outline" size={24} color="#3B82F6" />
                        <View style={styles.loginPromptContent}>
                            <Text style={styles.loginPromptTexto}>
                                ¿Ya tienes cuenta?{' '}
                                <Text style={styles.loginLink} onPress={() => navigation.navigate('Perfil')}>
                                    Inicia sesión
                                </Text>
                            </Text>
                            <Text style={styles.loginPromptSubtexto}>
                                Para ver tu historial de pedidos
                            </Text>
                        </View>
                    </View>
                )}

                {/* Datos personales */}
                <View style={styles.seccion}>
                    <View style={styles.seccionHeader}>
                        <Ionicons name="person-outline" size={20} color="#1A1A1A" />
                        <Text style={styles.seccionTitulo}>Datos de contacto</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Nombre completo</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Juan Pérez"
                                value={formData.nombre_cliente}
                                onChangeText={(text) => handleChange('nombre_cliente', text)}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Correo electrónico</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Teléfono</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="987654321"
                                value={formData.telefono}
                                onChangeText={(text) => handleChange('telefono', text)}
                                keyboardType="phone-pad"
                                maxLength={9}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Dirección de entrega */}
                <View style={styles.seccion}>
                    <View style={styles.seccionHeader}>
                        <Ionicons name="location-outline" size={20} color="#1A1A1A" />
                        <Text style={styles.seccionTitulo}>Dirección de entrega</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Dirección completa</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="home-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                placeholder="Av. Principal 123, Distrito, Ciudad"
                                value={formData.direccion}
                                onChangeText={(text) => handleChange('direccion', text)}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Métodos de pago */}
                <View style={styles.seccion}>
                    <View style={styles.seccionHeader}>
                        <Ionicons name="wallet-outline" size={20} color="#1A1A1A" />
                        <Text style={styles.seccionTitulo}>Método de pago</Text>
                    </View>

                    {metodosPago.map(metodo => (
                        <View key={metodo.id} style={styles.metodoPagoWrapper}>
                            <TouchableOpacity
                                style={[
                                    styles.metodoPagoCard,
                                    metodoPagoExpandido === metodo.id && styles.metodoPagoCardActivo
                                ]}
                                onPress={() => toggleMetodoPago(metodo.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.metodoPagoIcono, { backgroundColor: metodo.color + '15' }]}>
                                    <Ionicons name={metodo.icono} size={24} color={metodo.color} />
                                </View>
                                <View style={styles.metodoPagoInfo}>
                                    <Text style={styles.metodoPagoNombre}>{metodo.nombre}</Text>
                                    <Text style={styles.metodoPagoDescripcion}>{metodo.descripcion}</Text>
                                </View>
                                <Ionicons 
                                    name={metodoPagoExpandido === metodo.id ? "chevron-up" : "chevron-down"} 
                                    size={24} 
                                    color="#6B7280" 
                                />
                            </TouchableOpacity>

                            {metodoPagoExpandido === metodo.id && (
                                metodo.id === 'tarjeta'
                                    ? renderFormularioTarjeta()
                                    : renderFormularioYape()
                            )}
                        </View>
                    ))}
                </View>

                {/* Trust signals */}
                <View style={styles.trustSignals}>
                    <View style={styles.trustItem}>
                        <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                        <Text style={styles.trustTexto}>Pago seguro</Text>
                    </View>
                    <View style={styles.trustItem}>
                        <Ionicons name="lock-closed" size={20} color="#10B981" />
                        <Text style={styles.trustTexto}>Encriptación SSL</Text>
                    </View>
                    <View style={styles.trustItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <Text style={styles.trustTexto}>Compra protegida</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botón de pago fijo */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.botonPagar,
                        (!formData.metodo_pago || cargando) && styles.botonPagarDeshabilitado
                    ]}
                    onPress={handleConfirmarCompra}
                    disabled={!formData.metodo_pago || cargando}
                    activeOpacity={0.8}
                >
                    {cargando ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <View style={styles.botonPagarContent}>
                                <Ionicons name="lock-closed" size={20} color="#FFF" />
                                <Text style={styles.textoPagar}>Pagar S/ {obtenerTotal().toFixed(2)}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {renderModalPago()}
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
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingBottom: 16,
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
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    resumenCard: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    resumenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    resumenTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    resumenLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    resumenValor: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    envioLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    envioGratis: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    totalMoneda: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6',
        marginRight: 4,
    },
    totalValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#3B82F6',
    },
    loginPrompt: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        gap: 12,
    },
    loginPromptContent: {
        flex: 1,
    },
    loginPromptTexto: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
        marginBottom: 4,
    },
    loginLink: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    loginPromptSubtexto: {
        fontSize: 12,
        color: '#6B7280',
    },
    seccion: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    seccionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    seccionTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 14,
    },
    inputMultiline: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    metodoPagoWrapper: {
        marginBottom: 12,
    },
    metodoPagoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    metodoPagoCardActivo: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    metodoPagoIcono: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metodoPagoInfo: {
        flex: 1,
    },
    metodoPagoNombre: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    metodoPagoDescripcion: {
        fontSize: 12,
        color: '#6B7280',
    },
    formularioPago: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        marginTop: 12,
        borderRadius: 12,
    },
    tarjetasAceptadas: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 12,
    },
    tarjetaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tarjetaBadgeTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
    },
    inputPago: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 14,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    inputHalf: {
        flex: 1,
    },
    infoSeguridad: {
        flexDirection: 'row',
        backgroundColor: '#ECFDF5',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
        alignItems: 'center',
    },
    infoSeguridadTexto: {
        flex: 1,
        fontSize: 12,
        color: '#065F46',
        lineHeight: 16,
    },
    yapeHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    yapeLogoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#722F87',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    yapeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#722F87',
    },
    instruccionesYape: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    instruccionesTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    instruccionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 12,
    },
    numeroPaso: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#722F87',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numeroTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
    instruccionTexto: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
    },
    trustSignals: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    trustItem: {
        alignItems: 'center',
        gap: 6,
    },
    trustTexto: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    botonPagar: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    botonPagarDeshabilitado: {
        backgroundColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    botonPagarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textoPagar: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    processingIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successIcon: {
        marginBottom: 20,
    },
    modalTitulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitulo: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    paymentDetails: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    paymentDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    paymentMethod: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    paymentAmount: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3B82F6',
    },
});

export default ConfirmacionCompra;