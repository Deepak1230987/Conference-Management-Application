import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropUniqueIndex = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/website';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Get the database
        const db = mongoose.connection.db;

        // List all collections to find the right one
        console.log('Available collections:');
        const collections = await db.listCollections().toArray();
        console.log(collections.map(c => c.name));

        // Try different potential collection names
        const possibleNames = ['papers', 'paper', 'Papers', 'Paper'];
        let collection = null;
        let collectionName = '';

        for (const name of possibleNames) {
            if (collections.some(c => c.name === name)) {
                collection = db.collection(name);
                collectionName = name;
                console.log(`Found collection: ${name}`);
                break;
            }
        }

        if (!collection) {
            console.log('Could not find Paper collection. Please check the collection name manually');
            return;
        }

        // List all indexes to verify
        console.log(`Current indexes for ${collectionName}:`);
        const indexes = await collection.indexes();
        console.log(indexes);

        // Drop the unique index on ictacemId if it exists
        const ictacemIdIndex = indexes.find(index =>
            index.key && index.key.ictacemId === 1
        );

        if (ictacemIdIndex) {
            const indexName = ictacemIdIndex.name;
            console.log(`Found index ${indexName} on ictacemId field`);

            if (ictacemIdIndex.unique === true) {
                console.log(`Dropping unique index ${indexName} on ictacemId field...`);
                await collection.dropIndex(indexName);
                console.log('Successfully dropped unique index on ictacemId field');

                // Create a non-unique index instead
                console.log('Creating non-unique index on ictacemId field...');
                await collection.createIndex({ ictacemId: 1 }, { unique: false });
                console.log('Successfully created non-unique index on ictacemId field');
            } else {
                console.log('The index on ictacemId is already non-unique');
            }
        } else {
            console.log('No index found on ictacemId field');
        }

        // Verify indexes after changes
        console.log('Updated indexes:');
        const updatedIndexes = await collection.indexes();
        console.log(updatedIndexes);

        console.log('Index update complete');
    } catch (error) {
        console.error('Error updating indexes:', error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the function
dropUniqueIndex();