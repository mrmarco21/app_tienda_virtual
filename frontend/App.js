import { StatusBar } from 'expo-status-bar';
import { CarritoProvider } from './app/contexto/CarritoContext';
import NavegacionSimple from './app/NavegacionSimple';

export default function App() {
  return (
    <CarritoProvider>
      <NavegacionSimple />
      <StatusBar style="auto" />
    </CarritoProvider>
  );
}
