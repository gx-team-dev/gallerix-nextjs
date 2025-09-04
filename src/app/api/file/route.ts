import fs from 'fs';
import path from 'path';

export function GET() {
  const usersPath = path.join(process.cwd(), 'public', 'temp/IMG_4601.JPG');
  const file = fs.readFileSync(usersPath);
  return new Response(file);
};