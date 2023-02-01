/* eslint-disable @typescript-eslint/naming-convention */

import * as assert from 'assert';
import { HexString, VariableList } from '../../models/base';

import * as commonFunction from '../../utils/common';


suite('createRootSelector method', () => {
    test('when no item in list', () => {
      const output = commonFunction.createRootSelector({});
      assert.strictEqual(output, `:root {\n}\n`);
    });

    test('when 1 item in list', () => {
      let input = { '--body': '#123' };
      let expectedOutput = `:root {
	--body: #123;
}
`;
      const output = commonFunction.createRootSelector(input);
      assert.strictEqual(output, expectedOutput);
    });

    test('when multiple item in list', () => {
      let input = { '--body': '#123', '--other': 'rgb(255,0,255)' };
      let expectedOutput = `:root {
	--body: #123;
	--other: rgb(255,0,255);
}
`;
      const output = commonFunction.createRootSelector(input);
      assert.strictEqual(output, expectedOutput);
    });
});

suite('getParentSelectorName', () => {
  var list;
  test('with one item in list', () => {
    list = new Map().set(10, 'body');
    const op = commonFunction.getParentSelectorName(list, 20);
    assert.equal(op, 'body');
  });

  test('with multiple item in list', () => {
    list = new Map().set(10, 'body').set(30, 'main').set(35, 'class');
    const output = commonFunction.getParentSelectorName(list, 31);
    assert.equal(output, 'main');
  });

  test('with no item in list', () => {
    list = new Map();
    const output = commonFunction.getParentSelectorName(list, 31);
    assert.equal(output, 'defaultSelector');
  });
});

suite('setVariableName method', () => {
  test('when property name found in alias mapper', () => {
    let propertyName = 'background-color';
    let selectorName = 'body';
    let num = 2;
    const output = commonFunction.setVariableName({propertyName, selectorName, num});
    assert.equal(output, '--body__bg--2');
  });

  test('when property name not found in alias mapper', () => {
    let propertyName = 'padding';
    let selectorName = 'main';
    let num = 1;
    const output = commonFunction.setVariableName({propertyName, selectorName, num});
    assert.equal(output, '--main__defaultElement--1');
  });
  
});


suite('hexColorVariation method', () => {
  let colorList: HexString[] = [];
  setup(() => {
    colorList = [ '#abc', '#abcf', '#ab45ef', '#aabbcc', '#abcddef','#aabbccff'];
  });

  test('3 length hex color', () => {
    const output = commonFunction.hexColorVariation(colorList[0]);
    const expectedOutput =  ['#abc', '#abcf', '#aabbcc', '#aabbccff'];
    assert.deepEqual(output, expectedOutput);
  });
  test('4 length hex color', () => {
    const output = commonFunction.hexColorVariation(colorList[1]);
    const expectedOutput =  ['#abcf', '#abc', '#aabbcc', '#aabbccff'];
    assert.deepEqual(output, expectedOutput);
  });
  test('6 length hex color', () => {
    const output = commonFunction.hexColorVariation(colorList[2]);
    const expectedOutput =  ['#ab45ef', '#ab45efff'];
    assert.deepEqual(output, expectedOutput);
  });
  test('6 length hex color with repeated RGB value', () => {
    const output = commonFunction.hexColorVariation(colorList[3]);
    const expectedOutput =  ['#aabbcc', '#abc', '#abcf', '#aabbccff'];
    assert.deepEqual(output, expectedOutput);
  });
  test('8 length hex color', () => {
    const output = commonFunction.hexColorVariation(colorList[4]);
    const expectedOutput =  ['#abcddef'];
    assert.deepEqual(output, expectedOutput);
  });
  test('8 length hex color with repeated RGBA code', () => {
    const output = commonFunction.hexColorVariation(colorList[5]);
    const expectedOutput = ['#aabbccff', '#abc', '#abcf', '#aabbcc'];
    assert.deepEqual(output, expectedOutput);
  });
});

suite('checkDuplicateHexColor method', () => {
  let list: VariableList = {};
  suiteSetup(() => {
    console.log('beforeEach called');
    list = { '--main__color-1': '#234', '--body__bg-1': '#112233', '--class__bg-3': '#abcd'};
  });
  
  test('when 3 length short hex provided and equivalent long hex value exist in the list', () => {
    let colorValue: HexString = '#123';
    const output = commonFunction.checkDuplicateHexColor(colorValue, list);
    const expectedOutput = [true, '--body__bg-1'];
    assert.deepEqual(output, expectedOutput);
  });

  test('when 8 length long hex value provided and equivalent short hex value exist in the list', () => {
    let colorValue: HexString = '#aabbccdd';
    const output = commonFunction.checkDuplicateHexColor(colorValue, list);
    const expectedOutput = [true, '--class__bg-3'];
    assert.deepEqual(output, expectedOutput);
  });

  test('when hex value provided and equivalent hex value does not exist in the list', () => {
    let colorValue: HexString = '#1234';
    const output = commonFunction.checkDuplicateHexColor(colorValue, list);
    const expectedOutput = [false, ''];
    assert.deepEqual(output, expectedOutput);
  });
});

suite('checkDuplicateNonHexColor method', () => {
  let list: VariableList = {};
  suiteSetup(() => {
    list = { '--main__color-1': 'white', '--body__bg-1': 'hsl(255, 0, 0)', '--class__bg-3': 'rgb(120, 220, 020)'};
  });
  
  test('when color name provided and that name already exist in the list', () => {
    let colorValue = 'white';
    const output = commonFunction.checkDuplicateNonHexColor(colorValue, list);
    const expectedOutput = [true, '--main__color-1'];
    assert.deepEqual(output, expectedOutput);
  });

  test('when hsl color code provided and the value exist in the list', () => {
    let colorValue = 'hsl(255, 0, 0)';
    const output = commonFunction.checkDuplicateNonHexColor(colorValue, list);
    const expectedOutput = [true, '--body__bg-1'];
    assert.deepEqual(output, expectedOutput);
  });

  test('when value provided and equivalent hex value does not exist in the list', () => {
    let colorValue = 'rgb(120,120,120)';
    const output = commonFunction.checkDuplicateNonHexColor(colorValue, list);
    const expectedOutput = [false, ''];
    assert.deepEqual(output, expectedOutput);
  });
});