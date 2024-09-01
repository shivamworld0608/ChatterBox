import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) { 
			const socket = io(`${import.meta.env.REACT_APP_URL}`, {
				query: {
					userId: authUser._id,
				},
				withCredentials: true,
				transportOptions: {
    polling: {
      extraHeaders: {
        'X-Custom-Header': 'value'
      }
    }
  }
				reconnectionAttempts: 5, // number of reconnection attempts
			        reconnectionDelay: 1000, // delay between reconnections
			});


		socket.on("connect", () => {
			console.log("WebSocket connected successfully");
			setSocket(socket);
		});
		socket.on("disconnect", (reason) => {
			console.warn("WebSocket disconnected:", reason);
		});
			socket.on("connect_error", (err) => {
			console.error("WebSocket connection error:", err);
		});

                      socket.on("reconnect_attempt", (attemptNumber) => {
			console.log(`WebSocket reconnect attempt ${attemptNumber}`);
		});
			
			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () =>{ 
				socket.off('getOnlineUsers');
				socket.close();
			        console.log("WebSocket connection closed");
			}
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
				console.log("Socket cleared");
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
