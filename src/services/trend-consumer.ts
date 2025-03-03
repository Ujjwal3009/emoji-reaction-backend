import { Kafka } from 'kafkajs';
import { Logger } from '../utils/logger';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

interface EmojiEvent {
    sessionId: string;
    emoji: string;
    timestamp: number;
}

const MONGODB_URI = 'mongodb://mongodb:27017';
const DB_NAME = 'emoji-reactions';
const COLLECTION_NAME = 'events'; // Using consistent collection name

async function consumeAndProcessEmojis() {
    const mongoClient = new MongoClient(MONGODB_URI);
    const logDir = '/app/logs';
    const logFile = path.join(logDir, 'emoji-trends.log');
    
    try {
        // Ensure logs directory exists
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        await mongoClient.connect();
        Logger.info('Connected to MongoDB');
        
        const db = mongoClient.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Create indexes for better query performance
        await collection.createIndex({ timestamp: 1 });
        await collection.createIndex({ emoji: 1 });
        Logger.info('MongoDB indexes created');

        const kafka = new Kafka({
            clientId: 'emoji-consumer',
            brokers: ['kafka:9092']
        });

        const consumer = kafka.consumer({ groupId: 'emoji-consumer-group' });
        await consumer.connect();
        Logger.info('Connected to Kafka');

        await consumer.subscribe({ topic: 'emoji-events', fromBeginning: true });
        Logger.info('Subscribed to emoji-events topic');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const event: EmojiEvent = JSON.parse(message.value?.toString() || '{}');
                    
                    // Store in MongoDB with proper timestamp
                    await collection.insertOne({
                        sessionId: event.sessionId,
                        emoji: event.emoji,
                        timestamp: event.timestamp,
                        createdAt: new Date(event.timestamp)
                    });

                    // Log to file
                    const logEntry = `${new Date(event.timestamp).toISOString()} - ${event.emoji} (${event.sessionId})\n`;
                    fs.appendFileSync(logFile, logEntry);

                    // Log to console
                    Logger.info('Processed emoji event', {
                        emoji: event.emoji,
                        sessionId: event.sessionId,
                        timestamp: new Date(event.timestamp).toISOString()
                    });

                } catch (error) {
                    Logger.error('Error processing message', error);
                }
            },
        });

        // Handle cleanup on shutdown
        const cleanup = async () => {
            Logger.info('Cleaning up...');
            try {
                await consumer.disconnect();
                await mongoClient.close();
            } catch (error) {
                Logger.error('Error during cleanup', error);
            }
            process.exit(0);
        };

        process.on('SIGTERM', cleanup);
        process.on('SIGINT', cleanup);

    } catch (error) {
        Logger.error('Fatal error in consumer', error);
        await mongoClient.close();
        process.exit(1);
    }
}

consumeAndProcessEmojis()
    .catch(error => {
        Logger.error('Application failed', error);
        process.exit(1);
    }); 