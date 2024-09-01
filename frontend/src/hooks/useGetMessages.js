import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { REACT_APP_URL } = import.meta.env;

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const controller = new AbortController();
    const { signal } = controller;

    const getMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("chat-user-token"); // Assuming token is stored in localStorage

        const res = await fetch(
          ${REACT_APP_URL}/messages/${selectedConversation._id},
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: Bearer ${token}, // Include token in the header
            },
            signal,
            credentials: "include", // Include cookies if your app uses cookie-based authentication
          }
        );
        if (!res.ok)
          throw new Error(Failed to fetch messages: ${res.statusText});

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getMessages();

    // Cleanup function to abort fetch if the component unmounts
    return () => controller.abort();
  }, [REACT_APP_URL, selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
