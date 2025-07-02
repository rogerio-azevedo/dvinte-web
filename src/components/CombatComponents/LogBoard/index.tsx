/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { toast } from "react-toastify";

import api from "../../../services/api";
import { connect, socket } from "../../../services/socket";

import * as Styles from "./styles";

interface LogMessage {
  id: number;
  user: string;
  message: string;
  date: string;
  isCrit?: "HIT" | "FAIL" | null;
}

const LogBoard: React.FC = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<LogMessage[]>([]);

  const from = user?.id;
  const messagesEndRef = useRef<HTMLLIElement>(null);

  function scrollToBottom(): void {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function formatDate(date: string): string {
    const convertedDate = parseISO(date);
    const localDate = toZonedTime(convertedDate, "America/Sao_Paulo");

    return format(localDate, "dd-MM-yy HH:mm:ss");
  }

  async function loadAllMessages(): Promise<void> {
    try {
      const response = await api.get<LogMessage[]>("/combats");
      setMessages(response.data);
    } catch (error) {
      console.error("Erro ao carregar mensagens do LogBoard:", error);
      toast.error("Houve um problema ao carregar as mensagens do Chat!");
    }
  }

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    const handleNewMessage = (newMessage: LogMessage): void => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("chat.message", handleNewMessage);

    return () => {
      socket.off("chat.message", handleNewMessage);
    };
  }, [messages]);

  useEffect(() => {
    connect();
    loadAllMessages();
  }, []);

  return (
    <Styles.Container>
      <Styles.ChatContainer>
        <Styles.ChatHistory>
          <ul>
            {messages.map((message, index) => (
              <Styles.ListMessage
                ref={index === messages.length - 1 ? messagesEndRef : null}
                $from={from === message.id}
                key={`message-${message.id}-${index}`}
              >
                <Styles.MessageData $from={from === message.id}>
                  <Styles.MessageDateTime>
                    {formatDate(message.date)}
                  </Styles.MessageDateTime>
                  <Styles.MessageDataName $from={from === message.id}>
                    {message.user}
                  </Styles.MessageDataName>
                </Styles.MessageData>
                <Styles.Message
                  $crit={message.isCrit}
                  $from={from === message.id}
                >
                  {message.message}
                </Styles.Message>
              </Styles.ListMessage>
            ))}
          </ul>
        </Styles.ChatHistory>
      </Styles.ChatContainer>
    </Styles.Container>
  );
};

export default LogBoard;
