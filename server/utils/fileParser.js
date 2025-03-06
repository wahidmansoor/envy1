import { parse } from 'csv-parse/sync';

export function parseFile(file, fileType) {
  const content = file.buffer.toString('utf-8');

  switch (fileType) {
    case 'json':
      return parseJSON(content);
    case 'csv':
      return parseCSV(content);
    case 'txt':
    case 'md':
      return content;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

function parseJSON(content) {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON file');
  }
}

function parseCSV(content) {
  try {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });
    return records.map(record => JSON.stringify(record)).join('\n');
  } catch (error) {
    throw new Error('Invalid CSV file');
  }
}
