// Import memory handlers from analyze.js
import { memoryHandler } from './analyze';

// Use the imported handler
export default async function handler(req, res) {
    return memoryHandler(req, res);
}
