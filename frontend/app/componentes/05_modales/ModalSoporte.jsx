import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalSoporte = ({ visible, onCerrar }) => {
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

    const abrirEmail = () => {
        Linking.openURL('mailto:soporte@dsimarket.com');
    };

    const abrirTelefono = () => {
        Linking.openURL('tel:+51987654321');
    };

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

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="headset" size={28} color="#2563EB" />
                            </View>
                            <Text style={styles.titulo}>Soporte y ayuda</Text>
                        </View>
                    </View>

                    {/* Contenido */}
                    <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>
                        <Text style={styles.descripcion}>
                            ¿Necesitas ayuda? Estamos aquí para ti. Contáctanos a través de cualquiera de estos canales:
                        </Text>

                        {/* Email */}
                        <TouchableOpacity
                            style={styles.contactCard}
                            onPress={abrirEmail}
                            activeOpacity={0.7}
                        >
                            <View style={styles.contactIconContainer}>
                                <Ionicons name="mail" size={24} color="#3B82F6" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Correo electrónico</Text>
                                <Text style={styles.contactValue}>soporte@dsimarket.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Teléfono */}
                        <TouchableOpacity
                            style={styles.contactCard}
                            onPress={abrirTelefono}
                            activeOpacity={0.7}
                        >
                            <View style={styles.contactIconContainer}>
                                <Ionicons name="call" size={24} color="#10B981" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Teléfono</Text>
                                <Text style={styles.contactValue}>+51 987 654 321</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Horario */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <Ionicons name="time-outline" size={20} color="#6B7280" />
                                <Text style={styles.infoTitle}>Horario de atención</Text>
                            </View>
                            <Text style={styles.infoText}>Lunes a Viernes: 9:00 AM - 6:00 PM</Text>
                            <Text style={styles.infoText}>Sábados: 9:00 AM - 1:00 PM</Text>
                            <Text style={styles.infoText}>Domingos: Cerrado</Text>
                        </View>

                        {/* Tiempo de respuesta */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <Ionicons name="timer-outline" size={20} color="#6B7280" />
                                <Text style={styles.infoTitle}>Tiempo de respuesta</Text>
                            </View>
                            <Text style={styles.infoText}>
                                Respondemos en un máximo de 24 horas hábiles
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.botonCerrar}
                            onPress={onCerrar}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.botonCerrarTexto}>Entendido</Text>
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
        maxHeight: '85%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },
    contenido: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    descripcion: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    contactIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    infoCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    infoText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 2,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    botonCerrar: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botonCerrarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ModalSoporte;
