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
  board.set('imageUrl', '/images/path-4.jpg');

  const pathObjects = [
    PathCoords.create({ x: -3, y: 30 }),
    PathCoords.create({ x: 40, y: 30 }),
    PathCoords.create({ x: 40, y: 80 }),
    PathCoords.create({ x: -3, y: 80 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 10;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 1500,
      health: 220,
      maxHealth: 220,
      points: 10,
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
  const towerGroup1 = getNewTowerGroup(3, 9);
  const towerGroup2 = getNewTowerGroup(3, 59);

  // addTowersToTowerGroup = function(towerGroup, numTowers)
  addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 1 }]);
  addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 1 }]);
  determineFlexDirectionEligibility(towerGroup1);
  determineFlexDirectionEligibility(towerGroup2);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2]));
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

export default function createWave4() {
  const wave = Wave.create({
    towerStylesHidden: true,
    instructions: {
      main: `Now some of the groups have vertical space, which is the perfect
             opportunity to use the \`align-items\` property. \`align-items\`
             positions a container's items across its **cross axis** and accepts
             the following values:

* \`flex-start\`: align items across the start of a container's cross axis
* \`flex-end\`: align items across the end of the cross axis
* \`center\`: align items across the center of the cross axis

<u>Note</u>: \`align-items\` also accepts the values <i>baseline</i> (align
items such that their baselines line up) and <i>stretch</i> (stretch items such
that they span the entire cross axis), but these values cannot be used in
Flexbox Defense.`,
      tldr: `Use <nobr class="text__code">align-items ???</nobr> to move your
             towers into effective positions.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
