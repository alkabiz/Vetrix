import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { IWatcher, FileChange } from './types';

const execAsync = promisify(exec);

export class Watcher implements IWatcher {
    private intervalId: NodeJS.Timeout | null = null;
    private isRunning = false;
    private lastStatus: Map<string, string> = new Map();
    private gitRoot: string = '';

    constructor(private intervalMs: number = 2000) { }

    async start(callback: (change: FileChange) => Promise<void>): Promise<void> {
        if (this.isRunning) return;

        // Get git root
        try {
            const { stdout } = await execAsync('git rev-parse --show-toplevel');
            this.gitRoot = stdout.trim();
            console.log(`Git root detected: ${this.gitRoot}`);
        } catch (e) {
            console.error('Failed to find git root. Is this a git repository?');
            return;
        }

        this.isRunning = true;
        console.log('Watcher started...');

        // Initial scan to populate state without triggering events
        await this.checkStatus(true);

        this.intervalId = setInterval(async () => {
            const changes = await this.checkStatus();
            for (const change of changes) {
                await callback(change);
            }
        }, this.intervalMs);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('Watcher stopped.');
    }

    private async checkStatus(initial: boolean = false): Promise<FileChange[]> {
        try {
            // Get status of all files (untracked, modified, added, deleted)
            // -uall: shows untracked files
            // --porcelain: easy to parse output
            const { stdout } = await execAsync('git status --porcelain -uall');
            const lines = stdout.split('\n').filter(line => line.trim() !== '');
            const currentStatus = new Map<string, string>();
            const changes: FileChange[] = [];

            for (const line of lines) {
                // format: XY PATH
                // X = index status, Y = worktree status
                const status = line.substring(0, 2);
                const relPath = line.substring(3).trim();

                // Convert to absolute path
                // git status --porcelain returns paths relative to git root with forward slashes
                // We assume gitRoot uses correct separators for the OS (git rev-parse usually does)
                // But let's be safe and use path.join
                // Note: git output might use forward slashes even on Windows.
                const absPath = path.join(this.gitRoot, relPath);

                // Map git status to our simple status
                let changeType: 'added' | 'modified' | 'deleted' | null = null;

                if (status.includes('??')) {
                    changeType = 'added';
                } else if (status.includes('D')) {
                    changeType = 'deleted';
                } else if (status.includes('M')) {
                    changeType = 'modified';
                } else if (status.includes('A')) {
                    changeType = 'added';
                }

                if (changeType) {
                    currentStatus.set(absPath, changeType);

                    if (!initial) {
                        if (!this.lastStatus.has(absPath) || this.lastStatus.get(absPath) !== changeType) {
                            changes.push({ path: absPath, status: changeType });
                        }
                    }
                }
            }

            this.lastStatus = currentStatus;
            return changes;

        } catch (error) {
            console.error('Error checking git status:', error);
            return [];
        }
    }
}
