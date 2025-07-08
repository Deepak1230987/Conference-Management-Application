import mongoose from 'mongoose';
import Paper from './models/paper.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ictacem2025', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Add modeOfPresentation field to existing papers
const addModeOfPresentationField = async () => {
    try {
        console.log('Starting migration: Adding modeOfPresentation field to existing papers...');

        // Find all papers that don't have modeOfPresentation field
        const papersWithoutMode = await Paper.find({
            modeOfPresentation: { $exists: false }
        });

        console.log(`Found ${papersWithoutMode.length} papers without modeOfPresentation field`);

        if (papersWithoutMode.length === 0) {
            console.log('No papers need to be updated');
            return;
        }

        // Update each paper to add a default modeOfPresentation
        let updatedCount = 0;

        for (const paper of papersWithoutMode) {
            try {
                // Set default value to "Oral" for existing papers
                const result = await Paper.updateOne(
                    { _id: paper._id },
                    {
                        $set: {
                            modeOfPresentation: 'Oral'
                        }
                    }
                );

                if (result.modifiedCount > 0) {
                    updatedCount++;
                    console.log(`Updated paper: ${paper.title} (ID: ${paper._id})`);
                }
            } catch (error) {
                console.error(`Error updating paper ${paper._id}:`, error);
            }
        }

        console.log(`Migration completed. Updated ${updatedCount} papers`);

        // Verify the migration
        const remainingPapers = await Paper.find({
            modeOfPresentation: { $exists: false }
        });

        if (remainingPapers.length === 0) {
            console.log('✅ Migration successful! All papers now have modeOfPresentation field');
        } else {
            console.log(`⚠️  Warning: ${remainingPapers.length} papers still missing modeOfPresentation field`);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await addModeOfPresentationField();
};

main().catch(console.error);
