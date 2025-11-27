import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

const ModalSeleccionImagen = ({ visible, onCerrar, onTomarFoto, onSeleccionarGaleria }) => {
    const slideAnim = useRef(new Animated.Value(300)).current;

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
                toValue: 300,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleOpcion = (callback) => {
        onCerrar();
        setTimeout(() => callback(), 300);
    };

    return (
        <Modal
            visible={visible}
            transparent
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
                >
                    <View style={styles.handle} />

                    <Text style={styles.titulo}>Seleccionar Imagen</Text>
                    <Text style={styles.subtitulo}>Elige una opción</Text>

                    <View style={styles.opcionesContainer}>
                        <TouchableOpacity
                            style={styles.opcionButton}
                            onPress={() => handleOpcion(onTomarFoto)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="camera" size={28} color="#3B82F6" />
                            </View>
                            <View style={styles.opcionTexto}>
                                <Text style={styles.opcionTitulo}>Tomar Foto</Text>
                                <Text style={styles.opcionDescripcion}>Usa la cámara</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.opcionButton}
                            onPress={() => handleOpcion(onSeleccionarGaleria)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="images" size={28} color="#10B981" />
                            </View>
                            <View style={styles.opcionTexto}>
                                <Text style={styles.opcionTitulo}>Desde Galería</Text>
                                <Text style={styles.opcionDescripcion}>Selecciona una foto</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.cancelarButton}
                        onPress={onCerrar}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 34,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitulo: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    opcionesContainer: {
        gap: 12,
        marginBottom: 16,
    },
    opcionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    opcionTexto: {
        flex: 1,
    },
    opcionTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    opcionDescripcion: {
        fontSize: 13,
        color: '#6B7280',
    },
    cancelarButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelarTexto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default ModalSeleccionImagen;