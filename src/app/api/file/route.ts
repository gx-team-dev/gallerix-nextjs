import fs from 'fs';
import path from 'path';

export function GET() {
  const usersPath = path.join(process.cwd(), '/src/app', '/IMG_4601.JPG');
  const file = fs.readFileSync(usersPath);
  return new Response(file);
};