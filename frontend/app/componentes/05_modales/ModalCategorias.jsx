import { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIAS_ELECTRONICAS } from '../06_secciones/SeccionInformacion';

// Mapeo de categorías a iconos
const ICONOS_CATEGORIAS = {
    'Smartphones': 'phone-portrait-outline',
    'Laptops': 'laptop-outline',
    'Computadoras': 'desktop-outline',
    'Tablets': 'tablet-portrait-outline',
    'Televisores y monitores': 'tv-outline',
    'Gaming': 'game-controller-outline',
    'Audio': 'headset-outline',
    'Cámaras y fotografía': 'camera-outline',
    'Wearables': 'watch-outline',
    'Accesorios': 'construct-outline',
    'Almacenamiento': 'save-outline',
    'Redes': 'wifi-outline',
    'Impresoras y escáneres': 'print-outline',
    'Componentes de PC': 'hardware-chip-outline',
    'Electrónica': 'cube-outline',
    'Software': 'code-slash-outline',
    'default': 'pricetag-outline'
};

const ModalCategorias = ({ visible, categoriaSeleccionada, categoriasBD = [], onSeleccionar, onCerrar, onToast }) => {
    const [mostrarInputCategoria, setMostrarInputCategoria] = useState(false);
    const [categoriaPersonalizada, setCategoriaPersonalizada] = useState('');

    const agregarCategoriaPersonalizada = () => {
        if (categoriaPersonalizada.trim()) {
            onSeleccionar(categoriaPersonalizada.trim());
            setCategoriaPersonalizada('');
            setMostrarInputCategoria(false);
            onCerrar();
            onToast('Categoría agregada correctamente', 'success');
        } else {
            onToast('Por favor ingresa un nombre para la categoría', 'error');
        }
    };

    const handleSeleccionar = (categoria) => {
        onSeleccionar(categoria);
        onCerrar();
    };

    // Obtener icono para la categoría
    const obtenerIconoCategoria = (categoria) => {
        return ICONOS_CATEGORIAS[categoria] || ICONOS_CATEGORIAS['default'];
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onCerrar}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Selecciona Categoría</Text>
                        <TouchableOpacity
                            onPress={onCerrar}
                            style={styles.modalCloseButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.categoriasList} showsVerticalScrollIndicator={false}>
                        {/* Sección: Mis Categorías (de la BD) */}
                        {categoriasBD.length > 0 && (
                            <>
                                <Text style={styles.subtituloLista}>Mis Categorías</Text>
                                {categoriasBD.map((cat, index) => {
                                    const nombreCategoria = typeof cat === 'string' ? cat : cat.categoria;
                                    return (
                                        <TouchableOpacity
                                            key={`bd-${nombreCategoria}-${index}`}
                                            style={[
                                                styles.categoriaItem,
                                                categoriaSeleccionada === nombreCategoria && styles.categoriaItemSelected,
                                            ]}
                                            onPress={() => handleSeleccionar(nombreCategoria)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.categoriaItemContent}>
                                                <Ionicons
                                                    name={obtenerIconoCategoria(nombreCategoria)}
                                                    size={24}
                                                    color={categoriaSeleccionada === nombreCategoria ? '#3B82F6' : '#6B7280'}
                                                />
                                                <Text
                                                    style={[
                                                        styles.categoriaNombre,
                                                        categoriaSeleccionada === nombreCategoria && styles.categoriaNombreSelected,
                                                    ]}
                                                >
                                                    {nombreCategoria}
                                                </Text>
                                            </View>
                                            {categoriaSeleccionada === nombreCategoria && (
                                                <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}

                                {/* Separador */}
                                <View style={styles.separadorContainer}>
                                    <View style={styles.separadorLinea} />
                                    <Text style={styles.separadorTexto}>O REGISTRA UNA NUEVA</Text>
                                    <View style={styles.separadorLinea} />
                                </View>
                            </>
                        )}

                        {/* Sección: Registrar Nueva Categoría */}
                        <Text style={styles.subtituloLista}>
                            {categoriasBD.length > 0 ? 'Registrar Nueva Categoría' : 'Categorías Disponibles'}
                        </Text>
                        {CATEGORIAS_ELECTRONICAS.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoriaItem,
                                    categoriaSeleccionada === cat.nombre && styles.categoriaItemSelected,
                                ]}
                                onPress={() => handleSeleccionar(cat.nombre)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.categoriaItemContent}>
                                    <Ionicons
                                        name={cat.icon}
                                        size={24}
                                        color={categoriaSeleccionada === cat.nombre ? '#3B82F6' : '#6B7280'}
                                    />
                                    <Text
                                        style={[
                                            styles.categoriaNombre,
                                            categoriaSeleccionada === cat.nombre && styles.categoriaNombreSelected,
                                        ]}
                                    >
                                        {cat.nombre}
                                    </Text>
                                </View>
                                {categoriaSeleccionada === cat.nombre && (
                                    <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                                )}
                            </TouchableOpacity>
                        ))}

                        {/* Opción para agregar categoría personalizada */}
                        {!mostrarInputCategoria ? (
                            <TouchableOpacity
                                style={styles.addCategoriaButton}
                                onPress={() => setMostrarInputCategoria(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="add-circle-outline" size={24} color="#10B981" />
                                <Text style={styles.addCategoriaText}>Agregar nueva categoría</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.inputCategoriaContainer}>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="pricetag-outline" size={20} color="#6B7280" style={styles.inputIconInterno} />
                                    <TextInput
                                        style={styles.inputCategoriaPersonalizada}
                                        placeholder="Nombre de la categoría"
                                        placeholderTextColor="#9CA3AF"
                                        value={categoriaPersonalizada}
                                        onChangeText={setCategoriaPersonalizada}
                                        autoFocus
                                    />
                                </View>
                                <View style={styles.inputCategoriaActions}>
                                    <TouchableOpacity
                                        style={styles.inputCategoriaButtonCancel}
                                        onPress={() => {
                                            setMostrarInputCategoria(false);
                                            setCategoriaPersonalizada('');
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="close" size={18} color="#6B7280" />
                                        <Text style={styles.inputCategoriaButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.inputCategoriaButtonAdd}
                                        onPress={agregarCategoriaPersonalizada}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                                        <Text style={styles.inputCategoriaButtonTextAdd}>Agregar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    subtituloLista: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        marginTop: 8,
    },
    separadorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separadorLinea: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separadorTexto: {
        marginHorizontal: 10,
        fontSize: 12,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriasList: {
        padding: 16,
    },
    categoriaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoriaItemSelected: {
        backgroundColor: '#DBEAFE',
        borderColor: '#3B82F6',
    },
    categoriaItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoriaNombre: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    categoriaNombreSelected: {
        fontWeight: '700',
        color: '#3B82F6',
    },
    addCategoriaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#10B981',
        borderStyle: 'dashed',
        marginBottom: 10,
        marginTop: 8,
        gap: 12,
    },
    addCategoriaText: {
        fontSize: 16,
        color: '#10B981',
        fontWeight: '600',
    },
    inputCategoriaContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#10B981',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputIconInterno: {
        marginRight: 8,
    },
    inputCategoriaPersonalizada: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 12,
    },
    inputCategoriaActions: {
        flexDirection: 'row',
        gap: 8,
    },
    inputCategoriaButtonCancel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        gap: 6,
    },
    inputCategoriaButtonAdd: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#10B981',
        borderRadius: 8,
        gap: 6,
    },
    inputCategoriaButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    inputCategoriaButtonTextAdd: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ModalCategorias;