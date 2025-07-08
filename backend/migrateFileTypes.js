import mongoose from 'mongoose';
import Paper from './models/paper.model.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateFileTypes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ictacem2025');
        console.log('Connected to MongoDB');

        // Find all papers with old file types
        const papersToUpdate = await Paper.find({
            'adminUploadedFiles.fileType': {
                $in: ['revised_abstract', 'revised_fullpaper', 'admin_notes', 'additional_document', 'other']
            }
        });

        console.log(`Found ${papersToUpdate.length} papers that need file type migration`);

        for (const paper of papersToUpdate) {
            console.log(`\nUpdating paper: ${paper.title} (${paper._id})`);

            let updated = false;
            if (paper.adminUploadedFiles && paper.adminUploadedFiles.length > 0) {
                paper.adminUploadedFiles.forEach((file, index) => {
                    if (file.fileType !== 'review_comment_file') {
                        console.log(`  Updating file ${index + 1}: ${file.fileName} from '${file.fileType}' to 'review_comment_file'`);
                        file.fileType = 'review_comment_file';
                        updated = true;
                    }
                });

                if (updated) {
                    await paper.save();
                    console.log(`  ✅ Paper updated successfully`);
                } else {
                    console.log(`  ℹ️  No changes needed for this paper`);
                }
            }
        }

        console.log('\n🎉 Migration completed successfully!');

        // Verify the migration
        const remainingOldTypes = await Paper.find({
            'adminUploadedFiles.fileType': {
                $in: ['revised_abstract', 'revised_fullpaper', 'admin_notes', 'additional_document', 'other']
            }
        });

        if (remainingOldTypes.length === 0) {
            console.log('✅ All file types have been successfully migrated to "review_comment_file"');
        } else {
            console.log(`⚠️  Warning: ${remainingOldTypes.length} documents still have old file types`);
        }

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

migrateFileTypes();
