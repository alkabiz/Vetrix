import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { IAnalyzer, FileChange, ChangeAnalysis } from './types';

const execAsync = promisify(exec);

export class Analyzer implements IAnalyzer {
    async analyze(change: FileChange): Promise<ChangeAnalysis> {
        const context = this.getContext(change.path);
        let diff = '';

        try {
            if (change.status === 'modified') {
                // Get diff for modified file
                const { stdout } = await execAsync(`git diff "${change.path}"`);
                diff = stdout;
            } else if (change.status === 'added') {
                // Read content for new file
                try {
                    diff = await readFile(change.path, 'utf-8');
                } catch (e) {
                    diff = 'New file (content could not be read)';
                }
            } else if (change.status === 'deleted') {
                diff = 'File deleted';
            }
        } catch (error) {
            console.error(`Error analyzing file ${change.path}:`, error);
            diff = 'Error reading diff';
        }

        return {
            fileChange: change,
            diff,
            context
        };
    }

    private getContext(path: string) {
        const lowerPath = path.toLowerCase();
        return {
            isComponent: lowerPath.includes('components/') || lowerPath.endsWith('.tsx') || lowerPath.endsWith('.jsx'),
            isStyle: lowerPath.includes('styles/') || lowerPath.endsWith('.css') || lowerPath.endsWith('.scss'),
            isTest: lowerPath.includes('test') || lowerPath.endsWith('.test.ts') || lowerPath.endsWith('.spec.ts'),
            isConfig: lowerPath.includes('config') || lowerPath.endsWith('.json') || lowerPath.endsWith('.rc'),
            isRefactor: false // Hard to determine without deep analysis, generator can infer this from diff
        };
    }
}
