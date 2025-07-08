import mongoose from 'mongoose';
import Paper from './models/paper.model.js';
import dotenv from 'dotenv';

dotenv.config();

const checkFileTypes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ictacem2025');
        console.log('Connected to MongoDB');

        // Find all papers with adminUploadedFiles
        const papers = await Paper.find({
            'adminUploadedFiles': { $exists: true, $ne: [] }
        });

        console.log(`Found ${papers.length} papers with admin uploaded files`);

        for (const paper of papers) {
            console.log(`\nPaper: ${paper.title} (${paper._id})`);
            if (paper.adminUploadedFiles && paper.adminUploadedFiles.length > 0) {
                paper.adminUploadedFiles.forEach((file, index) => {
                    console.log(`  File ${index + 1}: ${file.fileName} - Type: ${file.fileType}`);
                });
            }
        }

        // Check for any files with old enum values
        const papersWithOldTypes = await Paper.find({
            'adminUploadedFiles.fileType': {
                $in: ['revised_abstract', 'revised_fullpaper', 'admin_notes', 'additional_document', 'other']
            }
        });

        if (papersWithOldTypes.length > 0) {
            console.log(`\n⚠️  Found ${papersWithOldTypes.length} papers with old file types that need updating:`);
            for (const paper of papersWithOldTypes) {
                console.log(`  - ${paper.title} (${paper._id})`);
            }
        } else {
            console.log('\n✅ No papers found with old file types');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

checkFileTypes();
