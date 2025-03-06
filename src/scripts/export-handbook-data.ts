import fs from 'fs';
import path from 'path';

interface AlgorithmSubtype {
  name: string;
  steps: string[];
  decisionPoints: string[];
}

interface Algorithm {
  title: string;
  subtypes: AlgorithmSubtype[];
}

const algorithms: Algorithm[] = [
  // Add your algorithm data here
];

const outputPath = path.join(process.cwd(), 'handbook-data.json');

fs.writeFileSync(outputPath, JSON.stringify(algorithms, null, 2));
