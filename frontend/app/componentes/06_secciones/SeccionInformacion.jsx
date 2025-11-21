import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Categorías de productos electrónicos actualizadas
export const CATEGORIAS_ELECTRONICAS = [
    { id: 1, nombre: 'Smartphones', icon: 'phone-portrait-outline' },
    { id: 2, nombre: 'Laptops', icon: 'laptop-outline' },
    { id: 3, nombre: 'Computadoras', icon: 'desktop-outline' },
    { id: 4, nombre: 'Tablets', icon: 'tablet-portrait-outline' },
    { id: 5, nombre: 'Televisores y monitores', icon: 'tv-outline' },
    { id: 6, nombre: 'Gaming', icon: 'game-controller-outline' },
    { id: 7, nombre: 'Audio', icon: 'headset-outline' },
    { id: 8, nombre: 'Cámaras y fotografía', icon: 'camera-outline' },
    { id: 9, nombre: 'Wearables', icon: 'watch-outline' },
    { id: 10, nombre: 'Accesorios', icon: 'construct-outline' },
    { id: 11, nombre: 'Almacenamiento', icon: 'save-outline' },
    { id: 12, nombre: 'Redes', icon: 'wifi-outline' },
    { id: 13, nombre: 'Impresoras y escáneres', icon: 'print-outline' },
    { id: 14, nombre: 'Componentes de PC', icon: 'hardware-chip-outline' },
    { id: 15, nombre: 'Electrónica', icon: 'cube-outline' },
    { id: 16, nombre: 'Software', icon: 'code-slash-outline' }
];


const SeccionInformacion = ({ datos, setDatos, onAbrirModalCategorias }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Información Básica</Text>

            {/* Nombre */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>
                    Nombre del Producto <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="pricetag-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={datos.nombre}
                        onChangeText={(text) => setDatos({ ...datos, nombre: text })}
                        placeholder="Ej: iPhone 15 Pro Max"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {/* Categoría */}
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>
                        Categoría <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity onPress={onAbrirModalCategorias} activeOpacity={0.7}>
                        <Ionicons name="apps-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>
                
                {datos.categoria ? (
                    <TouchableOpacity
                        style={styles.categoriaSeleccionada}
                        onPress={onAbrirModalCategorias}
                        activeOpacity={0.7}
                    >
                        <View style={styles.categoriaSeleccionadaContent}>
                            <Ionicons 
                                name={CATEGORIAS_ELECTRONICAS.find(c => c.nombre === datos.categoria)?.icon || 'grid-outline'} 
                                size={20} 
                                color="#3B82F6" 
                            />
                            <Text style={styles.categoriaSeleccionadaTexto}>{datos.categoria}</Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.categoriaVacia}
                        onPress={onAbrirModalCategorias}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
                        <Text style={styles.categoriaVaciaTexto}>Selecciona una categoría</Text>
                        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Precio y Stock */}
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>
                        Precio (S/) <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="cash-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={datos.precio}
                            onChangeText={(text) => setDatos({ ...datos, precio: text })}
                            placeholder="0.00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>
                        Stock <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="cube-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={datos.stock}
                            onChangeText={(text) => setDatos({ ...datos, stock: text })}
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={datos.descripcion}
                        onChangeText={(text) => setDatos({ ...datos, descripcion: text })}
                        placeholder="Describe las características principales del producto..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>
                <Text style={styles.caracteresContador}>
                    {datos.descripcion?.length || 0} caracteres
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    required: {
        color: '#EF4444',
    },
    inputContainer: {
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
    inputRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
        paddingTop: 12,
        paddingBottom: 12,
        minHeight: 120,
    },
    textArea: {
        paddingTop: 0,
        paddingBottom: 0,
        minHeight: 100,
    },
    caracteresContador: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
        textAlign: 'right',
    },
    categoriaSeleccionada: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#DBEAFE',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    categoriaSeleccionadaContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    categoriaSeleccionadaTexto: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    categoriaVacia: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 10,
    },
    categoriaVaciaTexto: {
        flex: 1,
        fontSize: 15,
        color: '#9CA3AF',
    },
});

export default SeccionInformacion;