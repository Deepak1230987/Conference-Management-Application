// Fix papers with missing or incorrect submittedAt dates
import mongoose from 'mongoose';
import Paper from './models/paper.model.js';
import connectDB from './config/db.js';

const fixSubmissionDates = async () => {
    try {
        await connectDB();

        // Find papers with missing or invalid submittedAt dates
        const papersWithInvalidDates = await Paper.find({
            $or: [
                { submittedAt: null },
                { submittedAt: { $exists: false } },
                { submittedAt: new Date(0) },
                { submittedAt: { $lt: new Date('2024-01-01') } } // Before reasonable conference date
            ]
        });

        console.log(`Found ${papersWithInvalidDates.length} papers with invalid submission dates`);

        for (const paper of papersWithInvalidDates) {
            // Set submission date to when the paper was created in the database
            paper.submittedAt = paper._id.getTimestamp();
            await paper.save();
            console.log(`Fixed submission date for paper: ${paper.title}`);
        }

        console.log('All submission dates have been fixed');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing submission dates:', error);
        process.exit(1);
    }
};

fixSubmissionDates();