import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://localhost:11434" });

export async function generateEmbedding(text: string): Promise<number[]> {
    const res = await ollama.embeddings({
        model: "nomic-embed-text",
        prompt: text
    });
    return res.embedding;
}

function normalize(vec: number[]): number[] {
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
    return vec.map(v => v / norm);
}

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error("Vector length mismatch");
    }

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] ?? 0) * (b[i] ?? 0);
    }
    return sum;
}

export async function getSimilarityScore(textA: string, textB: string) {
    const a = normalize(await generateEmbedding(textA));    
    const b = normalize(await generateEmbedding(textB));
    return cosineSimilarity(a, b);
}