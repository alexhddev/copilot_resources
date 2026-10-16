import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const WEBSITE_ROOT = join(__dirname, 'website');

const serve = serveStatic(WEBSITE_ROOT, { index: ['index.html'] });

const server = createServer((req, res) => {
  serve(req, res, (err) => {
    if (err) {
      res.statusCode = err.status || 500;
      res.end(err.message);
      return;
    }
    res.statusCode = 404;
    res.end('Not found');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
