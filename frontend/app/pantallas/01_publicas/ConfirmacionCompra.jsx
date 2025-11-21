import { useEffect, useState } from 'react';
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
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../../contexto/CarritoContext';
import { crearPedido } from '../../servicios/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmacionCompra = ({ navigation }) => {
    const { carrito, vaciarCarrito, obtenerTotal } = useCarrito();
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

    // Calcular el paso actual basado en los datos completados
    useEffect(() => {
        const contactoCompleto = formData.nombre_cliente && formData.email && formData.telefono;
        const envioCompleto = formData.direccion;
        const pagoCompleto = formData.metodo_pago;

        if (pagoCompleto && envioCompleto && contactoCompleto) {
            setPasoActual(3);
        } else if (envioCompleto && contactoCompleto) {
            setPasoActual(2);
        } else if (contactoCompleto) {
            setPasoActual(2);
        } else {
            setPasoActual(1);
        }
    }, [formData]);

    const pasos = [
        { numero: 1, titulo: 'Contacto', icono: 'person-outline', completado: pasoActual > 1 },
        { numero: 2, titulo: 'Envío', icono: 'location-outline', completado: pasoActual > 2 },
        { numero: 3, titulo: 'Pago', icono: 'card-outline', completado: pasoActual > 3 }
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
                    <Image
                        source={require('../../../assets/yape_icon.png')}
                        style={styles.yapeIcon}
                        resizeMode="contain"
                    />
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
            {/* Header minimalista */}
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
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Indicador de progreso renovado */}
            <View style={styles.progressContainer}>
                {pasos.map((paso, index) => (
                    <View key={paso.numero} style={styles.pasoWrapper}>
                        <View style={styles.pasoItem}>
                            <View style={[
                                styles.pasoCirculo,
                                paso.completado && styles.pasoCompletado,
                                pasoActual === paso.numero && styles.pasoActivo
                            ]}>
                                {paso.completado ? (
                                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                ) : (
                                    <Ionicons name={paso.icono} size={20}
                                        color={pasoActual === paso.numero ? "#FFF" : "#9CA3AF"} />
                                )}
                            </View>
                            <Text style={[
                                styles.pasoTexto,
                                (paso.completado || pasoActual === paso.numero) && styles.pasoTextoActivo
                            ]}>
                                {paso.titulo}
                            </Text>
                        </View>
                        {index < pasos.length - 1 && (
                            <View style={[
                                styles.lineaConexion,
                                (paso.completado || (pasoActual > paso.numero)) && styles.lineaCompletada
                            ]} />
                        )}
                    </View>
                ))}
            </View>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Columnas lado a lado en tablets/landscape */}
                <View style={styles.mainContent}>
                    {/* Columna Izquierda: Formularios */}
                    <View style={styles.formularioColumn}>
                        {/* Prompt login compacto */}
                        {!usuarioActivo && (
                            <TouchableOpacity
                                style={styles.loginPromptCompact}
                                onPress={() => navigation.navigate('Perfil')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="person-circle-outline" size={20} color="#3B82F6" />
                                <Text style={styles.loginPromptTexto}>
                                    ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text>
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Datos personales - diseño más limpio */}
                        <View style={styles.seccion}>
                            <View style={styles.seccionHeaderCompact}>
                                <Ionicons name="person-outline" size={18} color="#3B82F6" />
                                <Text style={styles.seccionTitulo}>Información de contacto</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nombre completo"
                                            value={formData.nombre_cliente}
                                            onChangeText={(text) => handleChange('nombre_cliente', text)}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                <View style={styles.rowInputs}>
                                    <View style={[styles.inputContainer, styles.inputHalfRow]}>
                                        <View style={styles.inputWrapper}>
                                            <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Email"
                                                value={formData.email}
                                                onChangeText={(text) => handleChange('email', text)}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.inputContainer, styles.inputHalfRow]}>
                                        <View style={styles.inputWrapper}>
                                            <Ionicons name="call-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Teléfono"
                                                value={formData.telefono}
                                                onChangeText={(text) => handleChange('telefono', text)}
                                                keyboardType="phone-pad"
                                                maxLength={9}
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Dirección - más compacta */}
                        <View style={styles.seccion}>
                            <View style={styles.seccionHeaderCompact}>
                                <Ionicons name="location-outline" size={18} color="#3B82F6" />
                                <Text style={styles.seccionTitulo}>Dirección de entrega</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <View style={[styles.inputWrapper, styles.inputWrapperTextarea]}>
                                    <Ionicons name="home-outline" size={18} color="#6B7280" style={styles.inputIconTop} />
                                    <TextInput
                                        style={[styles.input, styles.inputMultiline]}
                                        placeholder="Calle, número, distrito, ciudad"
                                        value={formData.direccion}
                                        onChangeText={(text) => handleChange('direccion', text)}
                                        multiline
                                        numberOfLines={2}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Métodos de pago - tarjetas horizontales */}
                        <View style={styles.seccion}>
                            <View style={styles.seccionHeaderCompact}>
                                <Ionicons name="wallet-outline" size={18} color="#3B82F6" />
                                <Text style={styles.seccionTitulo}>Método de pago</Text>
                            </View>

                            <View style={styles.metodosPagoGrid}>
                                {metodosPago.map(metodo => (
                                    <View key={metodo.id} style={styles.metodoPagoWrapper}>
                                        <TouchableOpacity
                                            style={[
                                                styles.metodoPagoCardCompact,
                                                metodoPagoExpandido === metodo.id && styles.metodoPagoCardActivo
                                            ]}
                                            onPress={() => toggleMetodoPago(metodo.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.metodoPagoIcono, { backgroundColor: metodo.color + '15' }]}>
                                                <Ionicons name={metodo.icono} size={22} color={metodo.color} />
                                            </View>
                                            <View style={styles.metodoPagoInfo}>
                                                <Text style={styles.metodoPagoNombre}>{metodo.nombre}</Text>
                                                <Text style={styles.metodoPagoDescripcion}>{metodo.descripcion}</Text>
                                            </View>
                                            <Ionicons
                                                name={metodoPagoExpandido === metodo.id
                                                    ? "checkmark-circle"
                                                    : "ellipse-outline"}
                                                size={24}
                                                color={metodoPagoExpandido === metodo.id ? metodo.color : "#D1D5DB"}
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
                        </View>
                    </View>

                    {/* Columna Derecha: Resumen sticky */}
                    <View style={styles.resumenColumn}>
                        <View style={styles.resumenCardCompact}>
                            <View style={styles.resumenHeaderCompact}>
                                <Ionicons name="receipt-outline" size={20} color="#3B82F6" />
                                <Text style={styles.resumenTitle}>Resumen</Text>
                            </View>

                            <View style={styles.resumenBody}>
                                <View style={styles.resumenRow}>
                                    <Text style={styles.resumenLabel}>Subtotal ({carrito.length} items)</Text>
                                    <Text style={styles.resumenValor}>S/ {obtenerTotal().toFixed(2)}</Text>
                                </View>

                                <View style={styles.resumenRow}>
                                    <View style={styles.envioLabelCompact}>
                                        <Ionicons name="rocket-outline" size={14} color="#10B981" />
                                        <Text style={styles.resumenLabel}>Envío</Text>
                                    </View>
                                    <Text style={styles.envioGratis}>GRATIS</Text>
                                </View>

                                <View style={styles.dividerThin} />

                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <View style={styles.totalContainer}>
                                        <Text style={styles.totalMoneda}>S/</Text>
                                        <Text style={styles.totalValor}>{obtenerTotal().toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Trust badges compactos */}
                            <View style={styles.trustBadges}>
                                <View style={styles.trustBadgeItem}>
                                    <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                                    <Text style={styles.trustBadgeTexto}>Pago seguro</Text>
                                </View>
                                <View style={styles.trustBadgeItem}>
                                    <Ionicons name="lock-closed" size={16} color="#10B981" />
                                    <Text style={styles.trustBadgeTexto}>Encriptado</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Botón pagar rediseñado */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.botonPagar,
                        !formData.metodo_pago && styles.botonPagarDeshabilitado
                    ]}
                    onPress={handleConfirmarCompra}
                    disabled={!formData.metodo_pago}
                    activeOpacity={0.85}
                >
                    {procesandoPago ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <View style={styles.botonPagarContent}>
                                <Ionicons name="shield-checkmark-outline" size={22} color="#FFF" />
                                <Text style={styles.textoPagar}>Pagar S/ {obtenerTotal().toFixed(2)}</Text>
                            </View>
                            <Ionicons name="arrow-forward-circle" size={24} color="#FFF" />
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
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    placeholder: {
        width: 40,
    },

    // Indicador de progreso nuevo
    progressContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pasoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pasoItem: {
        alignItems: 'center',
        gap: 8,
        flex: 1,
        zIndex: 1,
    },
    pasoCirculo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    pasoActivo: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        transform: [{ scale: 1.05 }],
    },
    pasoCompletado: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        shadowColor: '#10B981',
        shadowOpacity: 0.2,
    },
    pasoTexto: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        textAlign: 'center',
    },
    pasoTextoActivo: {
        color: '#1A1A1A',
        fontWeight: '700',
    },
    lineaConexion: {
        height: 3,
        flex: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: -8,
        marginTop: -30,
        borderRadius: 2,
    },
    lineaCompletada: {
        backgroundColor: '#10B981',
    },

    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // Layout de 2 columnas
    mainContent: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 16,
        flexWrap: 'wrap',
    },
    formularioColumn: {
        flex: 1,
        minWidth: 300,
    },
    resumenColumn: {
        width: 445,
        maxWidth: '100%',
    },

    // Login prompt compacto
    loginPromptCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    loginPromptTexto: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
        flex: 1,
    },
    loginLink: {
        color: '#3B82F6',
        fontWeight: '700',
    },

    // Secciones más limpias
    seccion: {
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    seccionHeaderCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 8,
    },
    seccionTitulo: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // Inputs rediseñados
    inputGroup: {
        gap: 12,
    },
    inputContainer: {
        marginBottom: 0,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        height: 48,
    },
    inputWrapperTextarea: {
        height: 70,
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputIconTop: {
        marginRight: 10,
        marginTop: 2,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    inputMultiline: {
        textAlignVertical: 'top',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    inputHalfRow: {
        flex: 1,
    },

    // Métodos de pago más elegantes
    metodosPagoGrid: {
        gap: 12,
    },
    metodoPagoWrapper: {
        marginBottom: 0,
    },
    metodoPagoCardCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 14,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    metodoPagoCardActivo: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    metodoPagoIcono: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metodoPagoInfo: {
        flex: 1,
    },
    metodoPagoNombre: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    metodoPagoDescripcion: {
        fontSize: 11,
        color: '#6B7280',
    },

    // Formulario de pago
    formularioPago: {
        backgroundColor: '#F9FAFB',
        padding: 14,
        marginTop: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tarjetasAceptadas: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 10,
    },
    tarjetaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        gap: 5,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tarjetaBadgeTexto: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
    inputPago: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    inputHalf: {
        flex: 1,
    },
    infoSeguridad: {
        flexDirection: 'row',
        backgroundColor: '#ECFDF5',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
        alignItems: 'center',
    },
    infoSeguridadTexto: {
        flex: 1,
        fontSize: 11,
        color: '#065F46',
        lineHeight: 15,
        fontWeight: '500',
    },

    // Yape
    yapeHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    yapeLogoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#722F87',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    yapeIcon: {
        width: 60,
        height: 60,
        borderRadius: 50,

    },
    yapeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#722F87',
    },
    instruccionesYape: {
        backgroundColor: '#FFF',
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
    },
    instruccionesTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    instruccionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    numeroPaso: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#722F87',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numeroTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
    },
    instruccionTexto: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
    },

    // Resumen compacto
    resumenCardCompact: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    resumenHeaderCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 8,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    resumenTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    resumenBody: {
        padding: 16,
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resumenLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    resumenValor: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    envioLabelCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    envioGratis: {
        fontSize: 13,
        color: '#10B981',
        fontWeight: '700',
    },
    dividerThin: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    totalMoneda: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
        marginRight: 3,
    },
    totalValor: {
        fontSize: 22,
        fontWeight: '700',
        color: '#3B82F6',
    },

    // Trust badges
    trustBadges: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 14,
        backgroundColor: '#F0FDF4',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    trustBadgeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    trustBadgeTexto: {
        fontSize: 10,
        color: '#065F46',
        fontWeight: '600',
    },

    // Barra inferior
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    botonPagar: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        paddingHorizontal: 20,
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

    // Modal
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
