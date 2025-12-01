import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalAcercaDe = ({ visible, onCerrar }) => {
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

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="information-circle" size={28} color="#2563EB" />
                            </View>
                            <Text style={styles.titulo}>Acerca de la app</Text>
                        </View>
                    </View>

                    {/* Contenido */}
                    <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>
                        <View style={styles.infoCard}>
                            <Text style={styles.appName}>DSI Market</Text>
                            <Text style={styles.version}>Versión 1.0.0</Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="code-slash" size={20} color="#3B82F6" />
                                <Text style={styles.sectionTitle}>Tecnología</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                Desarrollada con React Native + Expo
                            </Text>
                            <Text style={styles.sectionText}>
                                Backend: Node.js + Express + MySQL
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="people" size={20} color="#3B82F6" />
                                <Text style={styles.sectionTitle}>Equipo de desarrollo</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                Proyecto final desarrollado para el curso de Taller de Aplicaciones Móviles
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="heart" size={20} color="#EF4444" />
                                <Text style={styles.sectionTitle}>Agradecimientos</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                ¡Gracias por usar nuestra aplicación!
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
                            <Text style={styles.botonCerrarTexto}>Cerrar</Text>
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
    infoCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    sectionText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 4,
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

export default ModalAcercaDe;
