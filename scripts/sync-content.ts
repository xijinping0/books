import { sync, type OramaDocument } from '@/lib/orama-cloud';
import * as fs from 'node:fs/promises';
import { CloudManager } from '@oramacloud/client';

// the path of pre-rendered `static.json`, choose one according to your React framework
const filePath = {
  next: '.next/server/app/static.json.body',
  'tanstack-start': '.output/public/static.json',
  'react-router': 'build/client/static.json',
  waku: 'dist/public/static.json',
}['next'];

async function main() {
  const apiKey = process.env.ORAMA_PRIVATE_API_KEY;
  if (apiKey == null) {
    console.warn('No api key for Orama found, skipping');
    return;
  }
  const index = process.env.ORAMA_PRIVATE_INDEX;
  if (index == null) {
    console.warn('No index for Orama found, skipping');
    return;
  }

  const content = await fs.readFile(filePath);
  const records = JSON.parse(content.toString()) as OramaDocument[];
  const manager = new CloudManager({ api_key: apiKey });

  await sync(manager, {
    index,
    documents: records,
  });

  console.info(`Search updated: ${records.length} records`);
}

void main();
