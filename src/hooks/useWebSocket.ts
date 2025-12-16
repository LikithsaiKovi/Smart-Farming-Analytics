import { useEffect, useRef, useState } from 'react';

// Dynamic import to avoid build-time issues
let io: any = null;
let Socket: any = null;

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: string;
}

interface UseWebSocketReturn {
  socket: any;
  isConnected: boolean;
  weatherData: WeatherData | null;
  subscribeToWeather: (lat: number, lon: number) => void;
  unsubscribeFromWeather: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    let newSocket: any = null;
    
    const initializeSocket = async () => {
      try {
        // Dynamic import of socket.io-client
        const socketModule = await import('socket.io-client');
        io = socketModule.io;
        Socket = socketModule.Socket;
        
        // Initialize socket connection with error handling
        newSocket = io('http://localhost:5000', {
          transports: ['websocket', 'polling'],
          timeout: 5000,
          forceNew: true
        });

        newSocket.on('connect', () => {
          console.log('Connected to WebSocket server');
          setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
          setIsConnected(false);
        });

        newSocket.on('weather-update', (data: WeatherData) => {
          console.log('Received weather update:', data);
          setWeatherData(data);
        });

        newSocket.on('connect_error', (error: any) => {
          console.warn('WebSocket connection error (backend may not be running):', error.message);
          setIsConnected(false);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
      } catch (error) {
        console.warn('Failed to initialize WebSocket (backend may not be running):', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    return () => {
      if (newSocket) {
        newSocket.close();
      }
      socketRef.current = null;
    };
  }, []);

  const subscribeToWeather = (lat: number, lon: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('subscribe-weather', { lat, lon });
    }
  };

  const unsubscribeFromWeather = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('unsubscribe-weather');
    }
  };

  return {
    socket,
    isConnected,
    weatherData,
    subscribeToWeather,
    unsubscribeFromWeather,
  };
};
