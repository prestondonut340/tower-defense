import Board from 'tower-defense/objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';
import PathCoords from 'tower-defense/objects/path-coords';
import TowerGroup from 'tower-defense/objects/tower-group';
import Tower from 'tower-defense/objects/tower';
import Wave from 'tower-defense/objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  board.set('imageUrl', '/images/path-12.jpg');

  const pathObjects = [
    PathCoords.create({ x: -3, y: 10 }),
    PathCoords.create({ x: 15, y: 10 }),
    PathCoords.create({ x: 15, y: 25 }),
    PathCoords.create({ x: 5, y: 25 }),
    PathCoords.create({ x: 5, y: 60 }),
    PathCoords.create({ x: 40, y: 60 }),
    PathCoords.create({ x: 40, y: 42 }),
    PathCoords.create({ x: 60, y: 42 }),
    PathCoords.create({ x: 60, y: 60 }),
    PathCoords.create({ x: 95, y: 60 }),
    PathCoords.create({ x: 95, y: 75 }),
    PathCoords.create({ x: 85, y: 75 }),
    PathCoords.create({ x: 85, y: 90 }),
    PathCoords.create({ x: 103, y: 90 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 20;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 1475,
      health: 300,
      maxHealth: 300,
      points: 5,
      quantity: mobQuantity,
      speed: 10, // seconds to cross one axis of the board
      type: 'standard'
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  let groupNum = 1;

  function getNewTowerGroup(numRows, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      groupNum,
      numRows,
      posY,
      selector: 'tower-group-' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  // getNewTowerGroup = function(numRows, posY)
  const towerGroup1 = getNewTowerGroup(14, 15);

  // addTowersToTowerGroup = function(towerGroup, specsForTowers)
  addTowersToTowerGroup(towerGroup1, [
    { type: 2 }, { type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }
  ]);
  determineFlexDirectionEligibility(towerGroup1);

  wave.set('towerGroups', Ember.A([towerGroup1]));
}

function addTowersToTowerGroup(towerGroup, specsForTowers) {
  function getNewTower(towerNum, type) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: `tower-${towerGroup.get('groupNum')}-${towerNum}`,
      type,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = [];
  for (var i = 1; i < specsForTowers.length + 1; i++) {
    newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
  }

  towerGroup.set('towers', newTowers);
}

function determineFlexDirectionEligibility(towerGroup) {
  const numTowers = towerGroup.get('towers.length');
  const numRows = towerGroup.get('numRows');

  if (numRows >= numTowers) {
    towerGroup.set('flexDirectionAllowed', true);
  }
}

function generateIdForRecord() {
  function generate4DigitString() {
    const baseInt = Math.floor((1 + Math.random()) * 0x10000);
    return baseInt.toString(16).substring(1);
  }

  return generate4DigitString() + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() +
         generate4DigitString() + generate4DigitString();
}

export default function createWave12() {
  const wave = Wave.create({
    towerStylesHidden: false,
    instructions: {
      main: `This last one's pretty tough! Use the properties you've learned to
             score 80 or higher!

**justify-content**
* \`flex-start\`: group items at the start of a container's main axis
* \`flex-end\`: group items at the end of the main axis
* \`center\`: group items in the center of the main axis
* \`space-between\`: evenly distribute items along the main axis such that the
first item aligns at the start and the final item aligns at the end
* \`space-around\`: evenly distribute items along the main axis such that all
items have equal space around them

**align-items** and **align-self**
* \`flex-start\`: align item(s) across the start of a container's cross axis
* \`flex-end\`: align item(s) across the end of the cross axis
* \`center\`: align item(s) across the center of the cross axis

**flex-direction**
* \`row\`: lay out the main axis from left to right
* \`row-reverse\`: lay out the main axis from right to left
* \`column\`: lay out the main axis from top to bottom
* \`column-reverse\`: lay out the main axis from bottom to top

**order**
* \`#\`: position an item relative to the other items in the container`,
      tldr: `Use the properties you've learned to move your towers into
             position: <nobr class="text__code">justify-content ???</nobr>, <nobr
             class="text__code">align-items ???</nobr>, <nobr
             class="text__code">flex-direction ???</nobr>, <nobr
             class="text__code">order ???</nobr>, <nobr
             class="text__code">align-self ???</nobr>.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
