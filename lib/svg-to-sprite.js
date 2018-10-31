const sprites = require('svgstore')();
const fs = require('fs-extra');
const path = require('path');

const SVG_FOLDER_PATH = './src/assets/icon/svg';
const SPRITE_FOLDER_PATH = './src/assets/icon/bip-icon-set.svg';

convertSVGIconsToSVGSprite();

function convertSVGIconsToSVGSprite() {
  fs.readdirSync(path.resolve(SVG_FOLDER_PATH), 'utf-8').forEach(addSVGToSpriteBuffer);
  fs.writeFileSync(path.resolve(SPRITE_FOLDER_PATH), sprites);
}

function addSVGToSpriteBuffer(fileName) {
  const filePath = path.resolve(SVG_FOLDER_PATH, fileName);
  const iconName = path.basename(fileName, '.svg');
  const iconOptions = {
    symbolAttrs: {
      id: `bip-${iconName}-svg`
    }
  }

  sprites.add(iconName, fs.readFileSync(filePath), iconOptions);
}
