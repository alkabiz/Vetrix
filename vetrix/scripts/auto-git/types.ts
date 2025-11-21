export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted';
}

export interface ChangeAnalysis {
  fileChange: FileChange;
  diff: string;
  context: {
    isComponent: boolean;
    isStyle: boolean;
    isTest: boolean;
    isConfig: boolean;
    isRefactor: boolean;
  };
}

export interface CommitMessage {
  type: 'feat' | 'fix' | 'refactor' | 'chore' | 'style' | 'docs' | 'test';
  scope?: string;
  subject: string;
  body?: string;
}

export interface IWatcher {
  start(callback: (change: FileChange) => Promise<void>): void;
  stop(): void;
}

export interface IAnalyzer {
  analyze(change: FileChange): Promise<ChangeAnalysis>;
}

export interface IGenerator {
  generate(analysis: ChangeAnalysis): CommitMessage;
}

export interface IExecutor {
  commit(change: FileChange, message: CommitMessage): Promise<void>;
}
