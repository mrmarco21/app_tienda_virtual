import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useCarrito } from '../contexto/CarritoContext';
import { crearPedido } from '../servicios/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmacionCompra = ({ navigation }) => {
    const { carrito, vaciarCarrito, obtenerTotal } = useCarrito();
    const [cargando, setCargando] = useState(false);
    const [usuarioActivo, setUsuarioActivo] = useState(null);

    const [formData, setFormData] = useState({
        nombre_cliente: '',
        email: '',
        direccion: '',
        metodo_pago: 'Yape'
    });

    const metodosPago = ['Yape', 'Plin', 'Tarjeta', 'Efectivo'];

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
                    }));
                }
            } catch (e) {}
        };
        cargarUsuario();
    }, []);

    const validarFormulario = () => {
        if (!formData.nombre_cliente.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu nombre');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return false;
        }
        if (!formData.direccion.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu dirección');
            return false;
        }
        return true;
    };

    const handleConfirmarCompra = async () => {
        if (!usuarioActivo) {
            Alert.alert(
                'Inicia sesión',
                'Necesitas iniciar sesión o registrarte para confirmar tu pedido.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Ir a Perfil', onPress: () => navigation.navigate('Perfil') }
                ]
            );
            return;
        }
        if (!validarFormulario()) return;

        try {
            setCargando(true);

            const pedidoData = {
                nombre_cliente: formData.nombre_cliente,
                email: formData.email,
                direccion: formData.direccion,
                total: obtenerTotal(),
                metodo_pago: formData.metodo_pago,
                productos: carrito.map(p => ({
                    producto_id: p.id,
                    cantidad: p.cantidad,
                    subtotal: p.precio * p.cantidad
                }))
            };

            const response = await crearPedido(pedidoData);

            Alert.alert(
                '¡Compra exitosa!',
                `Tu pedido #${response.pedidoId} ha sido registrado correctamente. Te enviaremos un email a ${formData.email} con los detalles.`,
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
            Alert.alert('Error', 'No se pudo procesar tu pedido. Intenta nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🧾 Confirmación</Text>
            </View>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.contenido}>
                    {!usuarioActivo && (
                        <View style={styles.loginCard}>
                            <View style={styles.loginIconContainer}>
                                <Text style={styles.loginIcon}>🔐</Text>
                            </View>
                            <Text style={styles.loginTitulo}>Inicia sesión para continuar</Text>
                            <Text style={styles.loginSubtitulo}>Necesitas una cuenta para confirmar tu pedido</Text>
                            <TouchableOpacity style={styles.botonPrimario} onPress={() => navigation.navigate('Perfil')} activeOpacity={0.8}>
                                <Text style={styles.textoBotonPrimario}>🔑 Iniciar sesión</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Perfil')} activeOpacity={0.8}>
                                <Text style={styles.textoBotonSecundario}>✨ Crear cuenta</Text>
                            </TouchableOpacity>
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>o completa tus datos</Text>
                                <View style={styles.dividerLine} />
                            </View>
                        </View>
                    )}

                <View style={styles.resumen}>
                    <Text style={styles.subtitulo}>Resumen del pedido</Text>
                    {carrito.map(item => (
                        <View key={item.id} style={styles.itemResumen}>
                            <Text style={styles.itemNombre}>{item.nombre} x{item.cantidad}</Text>
                            <Text style={styles.itemPrecio}>S/ {(item.precio * item.cantidad).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalResumen}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValor}>S/ {obtenerTotal().toFixed(2)}</Text>
                    </View>
                </View>

                <Text style={styles.subtitulo}>Datos de entrega</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    value={formData.nombre_cliente}
                    onChangeText={(text) => handleChange('nombre_cliente', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    placeholder="Dirección de entrega"
                    value={formData.direccion}
                    onChangeText={(text) => handleChange('direccion', text)}
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.subtitulo}>Método de pago</Text>
                <View style={styles.metodosPagoContainer}>
                    {metodosPago.map(metodo => (
                        <TouchableOpacity
                            key={metodo}
                            style={[
                                styles.metodoPago,
                                formData.metodo_pago === metodo && styles.metodoPagoActivo
                            ]}
                            onPress={() => handleChange('metodo_pago', metodo)}
                        >
                            <Text style={[
                                styles.metodoPagoTexto,
                                formData.metodo_pago === metodo && styles.metodoPagoTextoActivo
                            ]}>
                                {metodo}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.boton, (cargando || !usuarioActivo) && styles.botonDeshabilitado]}
                    onPress={handleConfirmarCompra}
                    disabled={cargando || !usuarioActivo}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.textoBoton}>Confirmar pedido</Text>
                    )}
                </TouchableOpacity>
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
    scroll: {
        flex: 1,
    },
    contenido: {
        padding: 16,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 12,
    },
    resumen: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    itemResumen: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemNombre: {
        fontSize: 14,
        color: '#666',
    },
    itemPrecio: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    totalResumen: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalValor: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        fontSize: 16,
    },
    inputMultiline: {
        height: 100,
        textAlignVertical: 'top',
    },
    metodosPagoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    metodoPago: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        marginRight: 8,
        marginBottom: 8,
    },
    metodoPagoActivo: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    metodoPagoTexto: {
        fontSize: 14,
        color: '#333',
    },
    metodoPagoTextoActivo: {
        color: '#fff',
        fontWeight: '600',
    },
    boton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    botonDeshabilitado: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    loginCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
    },
    loginIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    loginIcon: {
        fontSize: 40,
    },
    loginTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 6,
        textAlign: 'center',
    },
    loginSubtitulo: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 12,
    },
    botonPrimario: {
        backgroundColor: '#2196F3',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        alignSelf: 'stretch',
    },
    textoBotonPrimario: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botonSecundario: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1.5,
        borderColor: '#2196F3',
        alignSelf: 'stretch',
    },
    textoBotonSecundario: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: '#999',
    },
});

export default ConfirmacionCompra;
