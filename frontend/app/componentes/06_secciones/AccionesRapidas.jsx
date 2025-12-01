import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AccionesRapidas = ({ navigation }) => {
    const acciones = [
        {
            id: 'productos',
            titulo: 'Gestionar Productos',
            icono: 'cube',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            onPress: () => navigation.navigate('GestionProductos')
        },
        {
            id: 'pedidos',
            titulo: 'Pedidos',
            icono: 'receipt',
            color: '#8B5CF6',
            bgColor: '#F3E8FF',
            onPress: () => navigation.navigate('GestionPedidos')
        },
        {
            id: 'agregar',
            titulo: 'Agregar Producto',
            icono: 'add-circle',
            color: '#10B981',
            bgColor: '#ECFDF5',
            onPress: () => navigation.navigate('AgregarProducto')
        },
        {
            id: 'clientes',
            titulo: 'Clientes',
            icono: 'people',
            color: '#EC4899',
            bgColor: '#FCE7F3',
            onPress: () => navigation.navigate('GestionClientes')
        },
        {
            id: 'reportes',
            titulo: 'Reportes',
            icono: 'bar-chart',
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            onPress: () => navigation.navigate('Reportes')
        }
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionsGrid}>
                {acciones.map(accion => (
                    <TouchableOpacity
                        key={accion.id}
                        style={[styles.actionCard, { borderColor: accion.bgColor }]}
                        onPress={accion.onPress}
                        activeOpacity={0.6}
                    >
                        <View style={[styles.actionIconCircle, { backgroundColor: accion.bgColor }]}>
                            <Ionicons name={accion.icono} size={20} color={accion.color} />
                        </View>
                        <Text style={styles.actionText}>{accion.titulo}</Text>
                        <View style={styles.arrowContainer}>
                            <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        marginTop: 14,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
        letterSpacing: 0.8
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    actionCard: {
        width: (width - 40) / 2,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        position: 'relative',
    },
    actionIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AccionesRapidas;