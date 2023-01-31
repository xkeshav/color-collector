/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/semi */

import * as assert from 'assert';

import * as commonFunction from '../../utils/common';

suite('common Functions', () => {
    test('createRootSelector when no item in list', () => {
      const output = commonFunction.createRootSelector({});
      assert.strictEqual(output, `:root {\n}\n`);
    });

    test('createRootSelector when 1 item in list', () => {
      let input = { '--body': '#123' };
      let expectedOutput = `:root {
	--body: #123;
}
`;
      const output = commonFunction.createRootSelector(input);
      assert.strictEqual(output, expectedOutput);
    });

    test('createRootSelector when multiple item in list', () => {
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

  test('getParentSelectorName with one list', () => {
    list = new Map().set(10, 'body');
    const op = commonFunction.getParentSelectorName(list, 20);
    assert.equal(op, 'body');
  });
});
