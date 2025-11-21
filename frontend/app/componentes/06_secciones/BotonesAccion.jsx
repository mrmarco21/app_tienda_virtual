import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BotonesAccion = ({ esEdicion, cargando, subiendoImagen, onCancelar, onGuardar }) => {
    const deshabilitado = cargando || subiendoImagen;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.botonCancelar}
                onPress={onCancelar}
                disabled={cargando}
                activeOpacity={0.7}
            >
                <Ionicons name="close" size={20} color="#374151" />
                <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botonGuardar, deshabilitado && styles.botonDeshabilitado]}
                onPress={onGuardar}
                disabled={deshabilitado}
                activeOpacity={0.7}
            >
                {cargando ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <>
                        <Ionicons
                            name={esEdicion ? 'checkmark' : 'add'}
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={styles.textoBotonGuardar}>
                            {esEdicion ? 'Actualizar' : 'Crear'} Producto
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    botonCancelar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    textoBotonCancelar: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    botonGuardar: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        gap: 8,
    },
    botonDeshabilitado: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
    },
    textoBotonGuardar: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default BotonesAccion;