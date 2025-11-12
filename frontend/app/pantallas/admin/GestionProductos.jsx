import { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    RefreshControl,
    Image
} from 'react-native';
import { obtenerProductos, eliminarProducto } from '../../servicios/api';

const GestionProductos = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const datos = await obtenerProductos();
            setProductos(datos);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los productos');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = (id, nombre) => {
        Alert.alert(
            'Eliminar Producto',
            `¿Estás seguro de eliminar "${nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await eliminarProducto(id);
                            Alert.alert('Éxito', 'Producto eliminado');
                            cargarProductos();
                        } catch (error) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const renderProducto = ({ item }) => (
        <View style={styles.tarjeta}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.categoria}>{item.categoria}</Text>
                <Text style={styles.precio}>S/ {item.precio}</Text>
                <Text style={[styles.stock, item.stock < 5 && styles.stockBajo]}>
                    Stock: {item.stock}
                </Text>
            </View>
            <View style={styles.acciones}>
                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: '#2196F3' }]}
                    onPress={() => navigation.navigate('EditarProducto', { producto: item })}
                >
                    <Text style={styles.textoBoton}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: '#F44336' }]}
                    onPress={() => handleEliminar(item.id, item.nombre)}
                >
                    <Text style={styles.textoBoton}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={productos}
                renderItem={renderProducto}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarProductos} />
                }
                ListEmptyComponent={
                    <Text style={styles.vacio}>No hay productos</Text>
                }
            />
            <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() => navigation.navigate('AgregarProducto')}
            >
                <Text style={styles.textoAgregar}>+ Agregar Producto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tarjeta: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    imagen: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    nombre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    categoria: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    precio: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 5,
    },
    stock: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    stockBajo: {
        color: '#F44336',
        fontWeight: 'bold',
    },
    acciones: {
        gap: 10,
    },
    boton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBoton: {
        fontSize: 18,
    },
    botonAgregar: {
        backgroundColor: '#4CAF50',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoAgregar: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    vacio: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
});

export default GestionProductos;
