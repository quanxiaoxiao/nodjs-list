import assert from 'node:assert';
import crypto from 'node:crypto';
import test from 'node:test';

import {
  findIndex,
  findIndexWithInsert,
  remove,
  sort,
  update,
} from './index.mjs';

test('utils > list > sort', () => {
  const arr1 = [];
  const arr2 = [];
  const size = 800;
  for (let i = 0; i < size ; i++) {
    arr1.push({
      _id: `${i}`,
      name: `${i}`,
    });
  }
  for (let i = 0; i < size ; i++) {
    arr2.push({
      _id: `${size - i - 1}`,
      name: `${i}`,
    });
  }

  assert.deepEqual(
    sort(arr2).map((d) => d._id),
    sort(arr1).map((d) => d._id),
  );

  assert.deepEqual(sort([]), []);

  assert.throws(() => {
    sort({});
  });
});

test('utils > list > findIndex', () => {
  const size = 800;
  const arr = [];
  for (let i = 0; i < size ; i++) {
    arr.push({
      _id: `${i}`,
      name: `${i}`,
    });
  }
  const list = sort(arr);
  for (let i = 0; i < size; i++) {
    const d = list[i];
    assert.equal(findIndex(list)(d._id), i);
  }

  assert.equal(findIndex(list)(`${size}`), -1);
  assert.equal(list[findIndex(list)(`${size - 1}`)].name, `${size - 1}`);
});

test('utils > list > findIndex 2', () => {
  const size = 800;
  const arr = [];
  for (let i = 0; i < size ; i++) {
    arr.push({
      _id: crypto.randomUUID(),
      name: `${i}`,
    });
  }
  const list = sort(arr);

  for (let i = 0; i < size; i++) {
    const d = list[i];
    assert(d);
    assert(findIndex(list)(d._id) !== -1);
  }
});

test('utils > list > findIndex 3', () => {
  const size = 800;
  const arr = [];
  for (let i = 0; i < size ; i++) {
    arr.push({
      _id: `${Math.floor(Math.random() * 80)}`,
      name: `${i}`,
    });
  }
  const list = sort(arr);

  for (let i = 0; i < size; i++) {
    const d = list[i];
    assert(d);
    assert(findIndex(list)(d._id) !== -1);
  }
});

test('utils > list > remove1', () => {
  const size = 800;
  const arr = [];
  for (let i = 0; i < size ; i++) {
    arr.push({
      _id: crypto.randomUUID(),
      name: `${i}`,
    });
  }
  const list = sort(arr);
  for (let i = 0; i < size; i++) {
    const d = list[i];
    const ret = remove(list)(d._id);
    assert.equal(ret[0]._id, d._id);
    assert.equal(ret[1].length, size - 1);
    assert.equal(findIndex(ret[1])(d._id), -1);
  }
});

test('utils > list > remove2', () => {
  const size = 800;
  const arr = [];
  for (let i = 0; i < size ; i++) {
    arr.push({
      _id: crypto.randomUUID(),
      name: `${i}`,
    });
  }
  let list = sort(arr);
  assert.equal(list.length, size);
  for (let i = 0; i < size; i++) {
    const d = arr[i];
    const ret = remove(list)(d._id);
    list = ret[1];
    assert.equal(ret[0]._id, d._id);
    assert.equal(ret[1].length, size - 1 - i);
  }
  assert.equal(list.length, 0);
});

test('utils > list > update', () => {
  const size = 800;
  const arr = [];
  for (let i = 0; i < size ; i++) {
    arr.push({
      _id: crypto.randomUUID(),
      index: i,
      name: `${i}`,
    });
  }
  const list = sort(arr);
  for (let i = 0; i < size; i++) {
    const d = list[i];
    const ret = update(list)(d._id, (pre) => {
      assert.equal(d, pre);
      return {
        index: pre.index + 1,
      };
    });
    assert.equal(ret.length, 3);
    assert.equal(ret[1], d);
    assert.deepEqual(
      {
        ...d,
        index: d.index + 1,
      },
      ret[0],
    );
    assert.deepEqual(
      ret[2],
      [
        ...list.slice(0, i),
        {
          ...d,
          index: d.index + 1,
        },
        ...list.slice(i + 1),
      ],
    );
  }
  for (let i = 0; i < size; i++) {
    const d = list[i];
    const ret = update(list)(d._id, (pre) => {
      assert.equal(d, pre);
      if (i % 3 === 0) {
        return null;
      }
      return {
        index: pre.index + 2,
      };
    });
    if (i % 3 === 0) {
      assert.equal(ret, null);
    } else {
      assert.equal(ret[1], d);
      assert.deepEqual(
        {
          ...d,
          index: d.index + 2,
        },
        ret[0],
      );
    }
  }
});

test('findIndexWithInsert', () => {
  const arr = [];
  let index = findIndexWithInsert(arr, '8');
  assert.equal(index, 0);
  arr.push({
    _id: '7',
  });
  index = findIndexWithInsert(arr, '7');

  const count = 1000;

  for (let i = 0; i < count; i++) {
    const _id = `${Math.floor(Math.random() * 1000)}`;
    index = findIndexWithInsert(arr, _id);
    arr.splice(index, 0, { _id });
    assert.deepEqual(arr, sort(arr));
  }
  assert.equal(count + 1, arr.length);
  const find = findIndex(arr);
  for (let i = 0; i < arr.length; i++) {
    const d = arr[i];
    const indexOfFind = find(d._id);
    const indexOfInsert = findIndexWithInsert(arr, d._id);
    assert.equal(indexOfFind, indexOfInsert);
  }
});
