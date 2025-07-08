import mongoose from 'mongoose';
import Paper from './models/paper.model.js';
import connectDB from './config/db.js';

async function updateSubmissionHistory() {
    try {
        console.log('Starting submission history migration...');

        // Connect to database
        await connectDB();

        const papers = await Paper.find({
            $or: [
                { 'abstractSubmissionHistory.0': { $exists: true } },
                { 'fullPaperSubmissionHistory.0': { $exists: true } }
            ]
        });

        console.log(`Found ${papers.length} papers with submission history to update`);

        for (const paper of papers) {
            let updated = false;

            // Update abstract submission history
            if (paper.abstractSubmissionHistory && paper.abstractSubmissionHistory.length > 0) {
                paper.abstractSubmissionHistory.forEach((submission, index) => {
                    if (!submission.status) {
                        submission.status = index === paper.abstractSubmissionHistory.length - 1 ? 'current' : 'previous';
                        updated = true;
                    }
                    if (!submission.version) {
                        submission.version = index + 1;
                        updated = true;
                    }
                });
            }

            // Update full paper submission history
            if (paper.fullPaperSubmissionHistory && paper.fullPaperSubmissionHistory.length > 0) {
                paper.fullPaperSubmissionHistory.forEach((submission, index) => {
                    if (!submission.status) {
                        submission.status = index === paper.fullPaperSubmissionHistory.length - 1 ? 'current' : 'previous';
                        updated = true;
                    }
                    if (!submission.version) {
                        submission.version = index + 1;
                        updated = true;
                    }
                });
            }

            if (updated) {
                await paper.save();
                console.log(`Updated paper ${paper.ictacemId}`);
            }
        }

        console.log('Migration completed successfully!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

updateSubmissionHistory();