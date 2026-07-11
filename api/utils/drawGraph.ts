import fs from 'fs';
import path from 'path';

/**
 * Saves a LangGraph compiled app's graph as a PNG image.
 * @param app The compiled LangGraph application
 * @param outputPath The absolute or relative path to save the image (e.g., 'graph.png')
 */
export async function saveGraphImage(app: any, outputPath: string) {
    try {
        console.log("Generating Mermaid graph image...");
        const imageBlob = await app.getGraph().drawMermaidPng();
        const buffer = Buffer.from(await imageBlob.arrayBuffer());
        
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Graph image successfully saved to ${outputPath}`);
    } catch (error) {
        console.error("❌ Failed to generate graph image:", error);
    }
}
