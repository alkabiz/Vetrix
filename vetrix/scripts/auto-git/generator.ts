import { IGenerator, ChangeAnalysis, CommitMessage } from './types';
import * as path from 'path';

export class Generator implements IGenerator {
    generate(analysis: ChangeAnalysis): CommitMessage {
        const { fileChange, diff, context } = analysis;
        const fileName = path.basename(fileChange.path);
        const dirName = path.dirname(fileChange.path);

        let type: CommitMessage['type'] = 'refactor';
        let subject = '';

        if (fileChange.status === 'added') {
            type = 'feat';
            subject = `create ${fileName}`;
        } else if (fileChange.status === 'deleted') {
            type = 'chore';
            subject = `delete ${fileName}`;
        } else {
            // Modified
            if (context.isStyle) {
                type = 'style';
                subject = `update styles in ${fileName}`;
            } else if (context.isConfig) {
                type = 'chore';
                subject = `update configuration in ${fileName}`;
            } else if (context.isTest) {
                type = 'test';
                subject = `update tests in ${fileName}`;
            } else {
                // Analyze diff content for clues
                const lowerDiff = diff.toLowerCase();
                if (lowerDiff.includes('fix') || lowerDiff.includes('bug') || lowerDiff.includes('error')) {
                    type = 'fix';
                    subject = `fix issue in ${fileName}`;
                } else if (lowerDiff.includes('import') && diff.split('\n').length < 5) {
                    type = 'refactor';
                    subject = `update imports in ${fileName}`;
                } else {
                    type = 'refactor';
                    subject = `update logic in ${fileName}`;
                }
            }
        }

        return {
            type,
            scope: this.getScope(fileChange.path),
            subject
        };
    }

    private getScope(filePath: string): string | undefined {
        // Extract scope from path, e.g., components/Button -> component
        // This is a simple heuristic
        const parts = filePath.split('/');
        if (parts.length > 1) {
            if (parts[0] === 'src' || parts[0] === 'app' || parts[0] === 'components') {
                return parts[1]; // e.g. "components" or "dashboard"
            }
            return parts[0];
        }
        return undefined;
    }
}
