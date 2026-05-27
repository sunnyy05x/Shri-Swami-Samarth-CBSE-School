const fs = require('fs');
let html = fs.readFileSync('infrastructure.html', 'utf8');

const mapping = {
  'Play Zone': 'images/play-zone.png',
  'Library': 'images/library.png',
  'Multipurpose Hall': 'images/multipurpose-hall.jpg',
  'Smart Classrooms': null,
  'Science Lab': 'images/science-lab.png',
  'Computer Lab': 'images/computer-lab.png',
  'Creative Studios': 'images/music-room.png',
  'Infirmary': null,
  'Remedial Classes': null,
  'Creative Zone': null,
  'Karate': 'images/karate.png',
  'Yoga': 'images/yoga.png',
  'Safety & Security': null,
  'AI \\(Artificial Intelligence\\)': null,
  'Water Facility': null,
  'Sanitization': null
};

for (const [title, imgPath] of Object.entries(mapping)) {
  const h2Regex = new RegExp(`<h2>${title}(?: <span.*?>.*?</span>)?</h2>`);
  
  if (imgPath) {
    // Replace the image pane completely
    const sectionRegex = new RegExp(`(<section class="immersive-slide">\\s*<div class="immersive-content">\\s*<div class="content-inner reveal">[\\s\\S]*?` + h2Regex.source + `[\\s\\S]*?</div>\\s*</div>\\s*)<div class="immersive-image-pane">[\\s\\S]*?</div>\\s*</section>`, 'i');
    
    html = html.replace(sectionRegex, (match, p1) => {
      return p1 + `<div class="immersive-image-pane">
        <img src="${imgPath}" alt="${title.replace(/\\/g, '')}" class="immersive-img" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    </section>`;
    });
  } else {
    // Remove image pane and add full-width class
    const sectionRegex = new RegExp(`(<section class="immersive-slide">\\s*)<div class="immersive-content">(\\s*<div class="content-inner reveal">[\\s\\S]*?` + h2Regex.source + `[\\s\\S]*?</div>\\s*</div>\\s*)<div class="immersive-image-pane">[\\s\\S]*?</div>\\s*</section>`, 'i');
    
    html = html.replace(sectionRegex, (match, p1, p2) => {
      return p1 + `<div class="immersive-content full-width">` + p2 + `    </section>`;
    });
  }
}

fs.writeFileSync('infrastructure.html', html);
console.log('Updated infrastructure.html');
