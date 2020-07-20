import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

class FFMPEG {
  sizes: Array<[number, number, number]>;

  constructor() {
    this.sizes = [
      [426, 240, 600],
      [640, 360, 900],
      [854, 480, 1600],
      [1280, 720, 3200],
      [1920, 1080, 5300],
    ];
  }

  convert(fn: string): Promise<{ contentPath: string }> {
    return new Promise((resolve, reject) => {
      const name = path.basename(fn, path.extname(fn));
      const targetDir = path.join(path.dirname(fn), name);
      const targetfn = path.join(targetDir, `${name}.mpd`);
      const proc = ffmpeg(fn);

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
      proc
        .output(targetfn)
        .outputOptions([
          '-b:a 96k',
          '-b_strategy 0',
          '-bf 1',
          '-c:a aac',
          '-c:v libx264',
          '-f dash',
          '-g 60',
          '-keyint_min 60',
          '-map 0:a:0',
          '-sc_threshold 0',
          '-use_template 1',
          '-use_timeline 1',
          '-window_size 5',
          '-streaming 1',
          // '-threads 4',
          // '-hide_banner',
          // '-pix_fmt yuv420p',
          // '-profile:v main',
          // '-hls_playlist 1',
          // `-hls_master_name ${fn}.m3u8`,
        ])
        .outputOptions('-adaptation_sets', 'id=0,streams=v id=1,streams=a');

      for (const size of this.sizes) {
        const index = this.sizes.indexOf(size);

        proc.outputOptions([
          `-map 0:v:0`,
          `-b:v:${index} ${size[2]}k`,
          `-s:v:${index} ${size[0]}:${size[1]}`,
        ]);
      }

      proc.on('start', function (commandLine) {
        console.log(`Spawned Ffmpeg with command: ${commandLine}`);
      });

      proc
        .on('progress', function (info) {
          // console.log('progress', info);
        })
        .on('end', function () {
          // console.log('complete');
          resolve({ contentPath: targetDir });
        })
        .on('error', function (err) {
          // console.log('error', err);
          reject(err);
        });

      return proc.run();
    });
  }
}

export default new FFMPEG();
