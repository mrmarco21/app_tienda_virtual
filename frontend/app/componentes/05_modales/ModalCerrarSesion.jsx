import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalCerrarSesion = ({ visible, onCerrar, onConfirmar }) => {
    const slideAnim = useRef(new Animated.Value(600)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 600,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCerrar}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onCerrar}
            >
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                    onStartShouldSetResponder={() => true}
                >
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Contenido */}
                    <View style={styles.contenido}>
                        {/* Icono de advertencia */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="log-out-outline" size={48} color="#EF4444" />
                        </View>

                        {/* Título */}
                        <Text style={styles.titulo}>¿Cerrar sesión?</Text>

                        {/* Descripción */}
                        <Text style={styles.descripcion}>
                            Estás a punto de cerrar sesión en este dispositivo. Podrás volver a iniciar sesión en cualquier momento.
                        </Text>
                    </View>

                    {/* Botones */}
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity
                            style={styles.botonCancelar}
                            onPress={onCerrar}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonConfirmar}
                            onPress={onConfirmar}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.botonConfirmarTexto}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    contenido: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    descripcion: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        textAlign: 'center',
    },
    botonesContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    botonCancelar: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botonCancelarTexto: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '700',
    },
    botonConfirmar: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botonConfirmarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ModalCerrarSesion;
