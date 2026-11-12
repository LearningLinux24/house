import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function generateManifest() {
  try {
    const manifest = {};
    const floors = [
      { key: 'gf', folder: 'gf-tv' },
      { key: '1f', folder: '1f-tv' }
    ];

    for (const { key, folder } of floors) {
      let dirPath = path.resolve(process.cwd(), 'public', 'videos', folder);
      if (!fs.existsSync(dirPath)) {
        dirPath = path.resolve(process.cwd(), 'dist', 'videos', folder);
      }

      if (!fs.existsSync(dirPath)) {
        manifest[key] = {
          hasVideo: false,
          floor: key,
          folder: `public/videos/${folder}`,
          count: 0,
          message: 'Folder not found'
        };
        continue;
      }

      const files = fs.readdirSync(dirPath);
      const mp4Files = files
        .filter(f => f.toLowerCase().endsWith('.mp4') && !f.startsWith('.'))
        .map(file => {
          const fullPath = path.join(dirPath, file);
          const stats = fs.statSync(fullPath);
          return {
            filename: file,
            url: `/videos/${folder}/${encodeURIComponent(file)}`,
            mtimeMs: stats.mtimeMs,
            size: stats.size
          };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

      if (mp4Files.length > 0) {
        manifest[key] = {
          hasVideo: true,
          floor: key,
          folder: `public/videos/${folder}`,
          count: mp4Files.length,
          latest: mp4Files[0]
        };
      } else {
        manifest[key] = {
          hasVideo: false,
          floor: key,
          folder: `public/videos/${folder}`,
          count: 0,
          message: 'Nothing to play (No .mp4 files found)'
        };
      }
    }

    const publicVideosDir = path.resolve(process.cwd(), 'public', 'videos');
    if (!fs.existsSync(publicVideosDir)) {
      fs.mkdirSync(publicVideosDir, { recursive: true });
    }
    const manifestPath = path.join(publicVideosDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[tvVideosPlugin] Failed to generate manifest.json:', err.message);
  }
}

function tvVideosPlugin() {
  const handleTvApi = (req, res) => {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const floor = (urlObj.searchParams.get('floor') || 'gf').toLowerCase();
      const isUpper = (floor === '1f' || floor === 'first_floor' || floor === '1' || floor === '2f' || floor === 'second_floor' || floor === '2');
      const folderName = isUpper ? '1f-tv' : 'gf-tv';
      let dirPath = path.resolve(process.cwd(), 'public', 'videos', folderName);
      if (!fs.existsSync(dirPath)) {
        dirPath = path.resolve(process.cwd(), 'dist', 'videos', folderName);
      }

      if (!fs.existsSync(dirPath)) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          hasVideo: false,
          floor,
          folder: `public/videos/${folderName}`,
          message: 'Folder not found'
        }));
        return;
      }

      const files = fs.readdirSync(dirPath);
      const mp4Files = files
        .filter(f => f.toLowerCase().endsWith('.mp4') && !f.startsWith('.'))
        .map(file => {
          const fullPath = path.join(dirPath, file);
          const stats = fs.statSync(fullPath);
          return {
            filename: file,
            url: `/videos/${folderName}/${encodeURIComponent(file)}`,
            mtimeMs: stats.mtimeMs,
            size: stats.size
          };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

      res.setHeader('Content-Type', 'application/json');
      if (mp4Files.length > 0) {
        res.end(JSON.stringify({
          hasVideo: true,
          floor,
          folder: `public/videos/${folderName}`,
          count: mp4Files.length,
          latest: mp4Files[0]
        }));
      } else {
        res.end(JSON.stringify({
          hasVideo: false,
          floor,
          folder: `public/videos/${folderName}`,
          count: 0,
          message: 'Nothing to play (No .mp4 files found)'
        }));
      }
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message }));
    }
  };

  return {
    name: 'tv-videos-api',
    buildStart() {
      generateManifest();
    },
    configureServer(server) {
      generateManifest();
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/tv-videos')) {
          handleTvApi(req, res);
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      generateManifest();
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/tv-videos')) {
          handleTvApi(req, res);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [tvVideosPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
