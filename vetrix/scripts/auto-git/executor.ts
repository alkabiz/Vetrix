import { exec } from 'child_process';
import { promisify } from 'util';
import { IExecutor, FileChange, CommitMessage } from './types';

const execAsync = promisify(exec);

export class Executor implements IExecutor {
    async commit(change: FileChange, message: CommitMessage): Promise<void> {
        try {
            // 1. Add the file
            // If deleted, git add also works to stage the deletion
            await execAsync(`git add "${change.path}"`);

            // 2. Construct commit message
            const scopePart = message.scope ? `(${message.scope})` : '';
            const fullMessage = `${message.type}${scopePart}: ${message.subject}`;

            // 3. Commit
            // Use --no-verify to skip pre-commit hooks if any, to ensure speed? 
            // Or maybe we want hooks? Let's keep hooks for safety.
            await execAsync(`git commit -m "${fullMessage}"`);

            console.log(`Committed: ${fullMessage}`);
        } catch (error) {
            console.error(`Error committing ${change.path}:`, error);
            throw error;
        }
    }
}
