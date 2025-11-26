import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

const ModalFiltros = ({
    visible,
    onCerrar,
    categorias,
    categoriasSeleccionadas = [], // Ahora es un array
    ordenPrecio,
    onSeleccionarCategoria,
    onSeleccionarOrden,
    onAplicarFiltros,
    onLimpiarFiltros,
    obtenerIconoCategoria
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

    const hayFiltrosActivos = categoriasSeleccionadas.length > 0 || ordenPrecio;

    // Función para verificar si una categoría está seleccionada
    const estaSeleccionada = (categoria) => {
        return categoriasSeleccionadas.includes(categoria);
    };

    // Función para manejar el toggle de categorías
    const toggleCategoria = (categoria) => {
        onSeleccionarCategoria(categoria);
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
                    onStartShouldSetResponder={() => true}
                >
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.titulo}>Filtros</Text>
                            {categoriasSeleccionadas.length > 0 && (
                                <Text style={styles.contadorTexto}>
                                    {categoriasSeleccionadas.length} {categoriasSeleccionadas.length === 1 ? 'categoría' : 'categorías'}
                                </Text>
                            )}
                        </View>
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
                                    const isSelected = estaSeleccionada(cat.categoria);
                                    return (
                                        <TouchableOpacity
                                            key={cat.categoria || index}
                                            style={[
                                                styles.opcionButton,
                                                isSelected && styles.opcionActiva
                                            ]}
                                            onPress={() => toggleCategoria(cat.categoria)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[
                                                styles.iconContainer,
                                                { backgroundColor: isSelected ? '#DBEAFE' : '#F3F4F6' }
                                            ]}>
                                                <Ionicons
                                                    name={obtenerIconoCategoria(cat.categoria)}
                                                    size={24}
                                                    color={isSelected ? '#3B82F6' : '#6B7280'}
                                                />
                                            </View>
                                            <Text style={[
                                                styles.opcionTexto,
                                                isSelected && styles.opcionTextoActiva
                                            ]}>
                                                {cat.categoria}
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

                        <View style={{ height: 10 }} />
                    </ScrollView>

                    {/* Botones de acción */}
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity
                            style={styles.botonAplicar}
                            onPress={onAplicarFiltros}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.botonAplicarTexto}>
                                Aplicar Filtros
                                {categoriasSeleccionadas.length > 0 && ` (${categoriasSeleccionadas.length})`}
                            </Text>
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
    contadorTexto: {
        fontSize: 13,
        fontWeight: '500',
        color: '#3B82F6',
        marginTop: 2,
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
        borderRadius: 10,
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

export default ModalFiltros;