import path from 'path';
import { initializeAgent } from './agent';
import { saveGraphImage } from '../../utils/drawGraph';

async function exportGraph() {
    console.log("Initializing agent...");
    const agent = await initializeAgent();
    
    const outputPath = path.resolve('api/services/agent/graph.png');
    await saveGraphImage(agent, outputPath);
}

exportGraph();
