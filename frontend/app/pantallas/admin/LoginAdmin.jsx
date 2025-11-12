import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../servicios/api';

const LoginAdmin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setCargando(true);
        try {
            const respuesta = await login(email, password);

            if (respuesta.usuario.rol !== 'vendedor') {
                Alert.alert('Acceso Denegado', 'No tienes permisos de administrador');
                return;
            }

            // Guardar token y datos de usuario
            await AsyncStorage.setItem('token', respuesta.token);
            await AsyncStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

            navigation.replace('DashboardAdmin');
        } catch (error) {
            Alert.alert('Error', error.message || 'Credenciales inválidas');
        } finally {
            setCargando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.contenido}>
                <Text style={styles.icono}>🔐</Text>
                <Text style={styles.titulo}>Panel de Administración</Text>
                <Text style={styles.subtitulo}>Ingresa tus credenciales</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!cargando}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!cargando}
                />

                <TouchableOpacity
                    style={[styles.boton, cargando && styles.botonDeshabilitado]}
                    onPress={handleLogin}
                    disabled={cargando}
                >
                    {cargando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.textoBoton}>Iniciar Sesión</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navigation.goBack()}
                    disabled={cargando}
                >
                    <Text style={styles.textoVolver}>← Volver a la tienda</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contenido: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    icono: {
        fontSize: 80,
        textAlign: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitulo: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    boton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    botonDeshabilitado: {
        backgroundColor: '#ccc',
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botonVolver: {
        marginTop: 20,
        padding: 10,
    },
    textoVolver: {
        color: '#2196F3',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default LoginAdmin;
