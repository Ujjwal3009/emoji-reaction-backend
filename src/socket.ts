import { Server, Socket } from 'socket.io';
import { Kafka, Producer, Message } from 'kafkajs';
import { CompressionTypes } from 'kafkajs';
<<<<<<< Updated upstream
=======
import { Logger } from './utils/logger';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
    try {
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
      Logger.info('Kafka producer connected successfully');
    } catch (error) {
      Logger.error('Failed to initialize Kafka producer', error);
      throw error;
    }
  }

  public async handleEmojiEvent(data: any) {
    try {
      const emojiEvent: EmojiEvent = {
        sessionId: data.sessionId || 'anonymous',
        emoji: data.emoji,
        timestamp: Date.now()
      };
      
      Logger.info('Processing emoji event', emojiEvent);
      await this.queueMessage(emojiEvent);
    } catch (error) {
      Logger.error('Error handling emoji event', error);
      throw error;
    }
  }

  private async queueMessage(event: EmojiEvent) {
    Logger.debug('Queuing message to Kafka', event);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      console.log(`Flushing ${this.messageQueue.length} messages to Kafka`);
=======
      Logger.info(`Flushing ${this.messageQueue.length} messages to Kafka`);
>>>>>>> Stashed changes
      await this.producer.send({
        topic: 'emoji-events',
        messages: this.messageQueue,
        compression: CompressionTypes.GZIP,
      });
<<<<<<< Updated upstream
      console.log('Successfully sent messages to Kafka');
    } catch (error) {
      console.error('Error sending messages to Kafka:', error);
=======
      Logger.info('Successfully sent messages to Kafka');
    } catch (error) {
      Logger.error('Error sending messages to Kafka', error);
>>>>>>> Stashed changes
    }

    this.messageQueue = [];
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
}

<<<<<<< Updated upstream
// Create a singleton instance
=======
>>>>>>> Stashed changes
const wsHandler = new WebSocketHandler();

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        Logger.info('Client connected', { socketId: socket.id });

        socket.on('sendEmoji', async (data) => {
<<<<<<< Updated upstream
            console.log('Received emoji event:', data);
            
            // Send to Kafka
            await wsHandler.handleEmojiEvent(data);
            
            // Broadcast to other clients
            io.emit('emoji-update', data);
=======
            Logger.info('Received emoji event from client', { 
                socketId: socket.id,
                data 
            });
            
            try {
                await wsHandler.handleEmojiEvent(data);
                io.emit('emoji-update', data);
                Logger.debug('Broadcasted emoji update to all clients', data);
            } catch (error) {
                Logger.error('Error processing emoji event', error);
            }
>>>>>>> Stashed changes
        });

        socket.on('disconnect', () => {
            Logger.info('Client disconnected', { socketId: socket.id });
        });
    });
}; 