import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastNotification = ({ visible, message, type = 'success', onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            // Mostrar
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                }),
            ]).start();

            // Auto ocultar después de 4 segundos
            const timer = setTimeout(() => {
                hideToast();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    if (!visible) return null;

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return { backgroundColor: '#10B981', icon: 'checkmark-circle' };
            case 'error':
                return { backgroundColor: '#EF4444', icon: 'close-circle' };
            case 'warning':
                return { backgroundColor: '#F59E0B', icon: 'warning' };
            case 'info':
                return { backgroundColor: '#3B82F6', icon: 'information-circle' };
            default:
                return { backgroundColor: '#10B981', icon: 'checkmark-circle' };
        }
    };

    const config = getToastConfig();

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: config.backgroundColor },
                { opacity, transform: [{ translateY }] },
            ]}
        >
            <Ionicons name={config.icon} size={24} color="#FFFFFF" />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 9999,
        gap: 12,
    },
    message: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ToastNotification;