import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ titulo }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.titulo}>{titulo}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2196F3',
        padding: 16,
        paddingTop: 40,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Header;
