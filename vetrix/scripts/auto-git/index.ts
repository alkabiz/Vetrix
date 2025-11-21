import { Watcher } from './watcher.js';
import { Analyzer } from './analyzer.js';
import { Generator } from './generator.js';
import { Executor } from './executor.js';

async function main() {
    const watcher = new Watcher();
    const analyzer = new Analyzer();
    const generator = new Generator();
    const executor = new Executor();

    console.log('Starting Auto-Git Agent...');
    console.log('Press Ctrl+C to stop.');

    await watcher.start(async (change) => {
        console.log(`\nDetected change: ${change.status} ${change.path}`);

        try {
            // 1. Analyze
            const analysis = await analyzer.analyze(change);

            // 2. Generate Message
            const message = generator.generate(analysis);

            // 3. Execute Commit
            await executor.commit(change, message);

        } catch (error) {
            console.error('Failed to process change:', error);
        }
    });
}

main().catch(console.error);
