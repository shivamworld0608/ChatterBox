import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { REACT_APP_URL } = import.meta.env;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(${REACT_APP_URL}/users, {
          credentials: "include", // Include cookies in the request
          signal, // Attach the signal for aborting the fetch
        });
        if (!res.ok)
          throw new Error(Failed to fetch conversations: ${res.statusText});

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getConversations();

    // Cleanup function to abort fetch if the component unmounts
    return () => controller.abort();
  }, [REACT_APP_URL]);

  return { loading, conversations };
};

export default useGetConversations;
