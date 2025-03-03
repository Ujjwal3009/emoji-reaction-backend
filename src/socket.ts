import { Server, Socket } from 'socket.io';
import { Kafka, Producer, Message } from 'kafkajs';
import { CompressionTypes } from 'kafkajs';

interface EmojiEvent {
  sessionId: string;
  emoji: string;
  timestamp: number;
}

class WebSocketHandler {
  private producer!: Producer;
  private messageQueue: Message[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.initKafkaProducer();
  }

  private async initKafkaProducer() {
    const kafka = new Kafka({
      clientId: 'emoji-reaction-producer',
      brokers: ['kafka:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
        maxRetryTime: 30000,
      },
    });

    this.producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });

    await this.producer.connect();
    console.log('Kafka producer connected successfully');
  }

  public async handleEmojiEvent(data: any) {
    const emojiEvent: EmojiEvent = {
      sessionId: data.sessionId || 'anonymous',
      emoji: data.emoji,
      timestamp: Date.now()
    };
    
    console.log('Processing emoji event:', emojiEvent);
    await this.queueMessage(emojiEvent);
  }

  private async queueMessage(event: EmojiEvent) {
    console.log('Queuing message to Kafka:', event);
    this.messageQueue.push({
      key: event.sessionId,
      value: JSON.stringify(event),
    });

    if (this.messageQueue.length >= 20000) {
      await this.flushMessages();
    }

    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => this.flushMessages(), 500);
    }
  }

  private async flushMessages() {
    if (this.messageQueue.length === 0) return;

    try {
      console.log(`Flushing ${this.messageQueue.length} messages to Kafka`);
      await this.producer.send({
        topic: 'emoji-events',
        messages: this.messageQueue,
        compression: CompressionTypes.GZIP,
      });
      console.log('Successfully sent messages to Kafka');
    } catch (error) {
      console.error('Error sending messages to Kafka:', error);
    }

    this.messageQueue = [];
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
}

// Create a singleton instance
const wsHandler = new WebSocketHandler();

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        socket.on('sendEmoji', async (data) => {
            console.log('Received emoji event:', data);
            
            // Send to Kafka
            await wsHandler.handleEmojiEvent(data);
            
            // Broadcast to other clients
            io.emit('emoji-update', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}; 