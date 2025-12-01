import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

const ModalFiltrosAdmin = ({
    visible,
    onCerrar,
    categorias,
    categoriaSeleccionada,
    ordenPrecio,
    onSeleccionarCategoria,
    onSeleccionarOrden,
    onAplicarFiltros,
    onLimpiarFiltros,
    getCategoriaIcono
}) => {
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

    const hayFiltrosActivos = categoriaSeleccionada !== 'Todas' || ordenPrecio;

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
                    onStartShouldSetResponder={() => true}
                >
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.titulo}>Filtros</Text>
                        {hayFiltrosActivos && (
                            <TouchableOpacity
                                onPress={onLimpiarFiltros}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.limpiarTexto}>Limpiar todo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Sección de Categorías */}
                        <View style={styles.seccion}>
                            <Text style={styles.seccionTitulo}>Categorías</Text>
                            <View style={styles.opcionesContainer}>
                                {categorias.map((cat, index) => {
                                    const isSelected = categoriaSeleccionada === cat;
                                    return (
                                        <TouchableOpacity
                                            key={cat || index}
                                            style={[
                                                styles.opcionButton,
                                                isSelected && styles.opcionActiva
                                            ]}
                                            onPress={() => onSeleccionarCategoria(cat)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[
                                                styles.iconContainer,
                                                { backgroundColor: isSelected ? '#DBEAFE' : '#F3F4F6' }
                                            ]}>
                                                <Ionicons
                                                    name={cat === 'Todas' ? 'grid-outline' : getCategoriaIcono(cat)}
                                                    size={24}
                                                    color={isSelected ? '#3B82F6' : '#6B7280'}
                                                />
                                            </View>
                                            <Text style={[
                                                styles.opcionTexto,
                                                isSelected && styles.opcionTextoActiva
                                            ]}>
                                                {cat === 'Todas' ? 'Todas las categorías' : cat}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Sección de Ordenar por Precio */}
                        <View style={styles.seccion}>
                            <Text style={styles.seccionTitulo}>Ordenar por precio</Text>
                            <View style={styles.opcionesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.opcionButton,
                                        ordenPrecio === 'menor' && styles.opcionActiva
                                    ]}
                                    onPress={() => onSeleccionarOrden('menor')}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.iconContainer,
                                        { backgroundColor: ordenPrecio === 'menor' ? '#DCFCE7' : '#F3F4F6' }
                                    ]}>
                                        <Ionicons
                                            name="arrow-down"
                                            size={24}
                                            color={ordenPrecio === 'menor' ? '#10B981' : '#6B7280'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.opcionTexto,
                                        ordenPrecio === 'menor' && styles.opcionTextoActiva
                                    ]}>
                                        Menor a mayor precio
                                    </Text>
                                    {ordenPrecio === 'menor' && (
                                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.opcionButton,
                                        ordenPrecio === 'mayor' && styles.opcionActiva
                                    ]}
                                    onPress={() => onSeleccionarOrden('mayor')}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.iconContainer,
                                        { backgroundColor: ordenPrecio === 'mayor' ? '#FEF3C7' : '#F3F4F6' }
                                    ]}>
                                        <Ionicons
                                            name="arrow-up"
                                            size={24}
                                            color={ordenPrecio === 'mayor' ? '#F59E0B' : '#6B7280'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.opcionTexto,
                                        ordenPrecio === 'mayor' && styles.opcionTextoActiva
                                    ]}>
                                        Mayor a menor precio
                                    </Text>
                                    {ordenPrecio === 'mayor' && (
                                        <Ionicons name="checkmark-circle" size={24} color="#F59E0B" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ height: 20 }} />
                    </ScrollView>

                    {/* Botones de acción */}
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity
                            style={styles.botonAplicar}
                            onPress={onAplicarFiltros}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.botonAplicarTexto}>Aplicar Filtros</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    limpiarTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    seccion: {
        marginBottom: 24,
    },
    seccionTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    opcionesContainer: {
        gap: 10,
    },
    opcionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 5,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    opcionActiva: {
        borderColor: '#3B82F6',
        backgroundColor: '#F8FAFC',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    opcionTexto: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#6B7280',
    },
    opcionTextoActiva: {
        color: '#1A1A1A',
        fontWeight: '600',
    },
    botonesContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    botonAplicar: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botonAplicarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ModalFiltrosAdmin;
