import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { crearProducto, actualizarProducto } from '../../servicios/api';

const FormularioProducto = ({ navigation, route }) => {
    const producto = route.params?.producto;
    const esEdicion = !!producto;

    const [datos, setDatos] = useState({
        nombre: producto?.nombre || '',
        categoria: producto?.categoria || '',
        precio: producto?.precio?.toString() || '',
        stock: producto?.stock?.toString() || '',
        descripcion: producto?.descripcion || '',
        imagen: producto?.imagen || '',
    });
    const [cargando, setCargando] = useState(false);

    const handleGuardar = async () => {
        if (!datos.nombre || !datos.categoria || !datos.precio || !datos.stock) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        setCargando(true);
        try {
            const productoData = {
                ...datos,
                precio: parseFloat(datos.precio),
                stock: parseInt(datos.stock),
            };

            if (esEdicion) {
                await actualizarProducto(producto.id, productoData);
                Alert.alert('Éxito', 'Producto actualizado');
            } else {
                await crearProducto(productoData);
                Alert.alert('Éxito', 'Producto creado');
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formulario}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                    style={styles.input}
                    value={datos.nombre}
                    onChangeText={(text) => setDatos({ ...datos, nombre: text })}
                    placeholder="Ej: Smartphone Samsung"
                />

                <Text style={styles.label}>Categoría *</Text>
                <TextInput
                    style={styles.input}
                    value={datos.categoria}
                    onChangeText={(text) => setDatos({ ...datos, categoria: text })}
                    placeholder="Ej: Electrónica"
                />

                <Text style={styles.label}>Precio (S/) *</Text>
                <TextInput
                    style={styles.input}
                    value={datos.precio}
                    onChangeText={(text) => setDatos({ ...datos, precio: text })}
                    placeholder="Ej: 899.99"
                    keyboardType="decimal-pad"
                />

                <Text style={styles.label}>Stock *</Text>
                <TextInput
                    style={styles.input}
                    value={datos.stock}
                    onChangeText={(text) => setDatos({ ...datos, stock: text })}
                    placeholder="Ej: 25"
                    keyboardType="number-pad"
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={datos.descripcion}
                    onChangeText={(text) => setDatos({ ...datos, descripcion: text })}
                    placeholder="Descripción del producto"
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>URL de Imagen</Text>
                <TextInput
                    style={styles.input}
                    value={datos.imagen}
                    onChangeText={(text) => setDatos({ ...datos, imagen: text })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />

                <TouchableOpacity
                    style={[styles.boton, cargando && styles.botonDeshabilitado]}
                    onPress={handleGuardar}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.textoBoton}>
                            {esEdicion ? 'Actualizar' : 'Crear'} Producto
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formulario: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    boton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    botonDeshabilitado: {
        backgroundColor: '#ccc',
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FormularioProducto;
