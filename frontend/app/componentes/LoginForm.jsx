import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator
} from 'react-native';

const LoginForm = ({ onLogin, onSwitchToRegister, cargando }) => {
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    const handleSubmit = () => {
        onLogin(loginForm);
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.formIconContainer}>
                <Text style={styles.formIcon}>🔑</Text>
            </View>
            <Text style={styles.formTitulo}>¡Bienvenido de nuevo!</Text>
            <Text style={styles.formSubtitulo}>Ingresa tus datos para continuar</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>📧 Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="tu@email.com"
                    placeholderTextColor="#999"
                    value={loginForm.email}
                    onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>🔒 Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    value={loginForm.password}
                    onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                style={[styles.botonPrimario, cargando && styles.botonDeshabilitado]}
                onPress={handleSubmit}
                disabled={cargando}
                activeOpacity={0.8}
            >
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.textoBotonPrimario}>Iniciar sesión</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkContainer}
                onPress={onSwitchToRegister}
                activeOpacity={0.7}
            >
                <Text style={styles.linkTexto}>
                    ¿No tienes cuenta? <Text style={styles.linkDestacado}>Regístrate aquí</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    formIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    formIcon: {
        fontSize: 40,
    },
    formTitulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 8,
    },
    formSubtitulo: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    botonPrimario: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    textoBotonPrimario: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botonDeshabilitado: {
        opacity: 0.6,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkTexto: {
        fontSize: 14,
        color: '#666',
    },
    linkDestacado: {
        color: '#2196F3',
        fontWeight: '600',
    },
});

export default LoginForm;
