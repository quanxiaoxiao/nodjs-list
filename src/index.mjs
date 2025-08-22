import assert from 'node:assert';

export const sort = (arr) => {
  assert(Array.isArray(arr), 'Expected an array');
  if (arr.length === 0) {
    return [];
  }
  assert(typeof arr[0]._id === 'string', 'Expected objects with string _id property');
  return [...arr].sort((a, b) => {
    if (a._id === b._id) {
      return 0;
    }
    if (a._id > b._id) {
      return 1;
    }
    return -1;
  });
};

export const findIndex = (arr) => {
  assert(Array.isArray(arr), 'Expected an array');
  return (_id) => {
    assert(typeof _id === 'string', 'Expected string _id');
    const len = arr.length;
    if (len === 0) {
      return -1;
    }
    if (len === 1) {
      return arr[0]._id === _id ? 0 : -1;
    }
    let left = 0;
    let right = len;
    while (left < right) {
      const index = Math.floor((right - left) / 2) + left;
      const currentId = arr[index]._id;
      if (currentId === _id) {
        return index;
      }
      if (_id > currentId) {
        left = index + 1;
      } else {
        right = index;
      }
    }
    return -1;
  };
};

export const findIndexWithInsert = (arr, _id) => {
  assert(Array.isArray(arr), 'Expected an array');
  assert(typeof _id === 'string', 'Expected string _id');
  const len = arr.length;
  if (len === 0) {
    return 0;
  }
  let left = 0;
  let right = len;
  while (left < right) {
    const index = Math.floor((right - left) / 2) + left;
    const currentId = arr[index]._id;
    if (currentId === _id) {
      return index;
    }
    if (_id > currentId) {
      left = index + 1;
    } else {
      right = index;
    }
  }
  return left;
};

export const remove = (arr) => {
  assert(Array.isArray(arr), 'Expected an array');
  const find = findIndex(arr);
  return (_id) => {
    const index = find(_id);
    if (index === -1) {
      return null;
    }
    const len = arr.length;
    const currentItem = arr[index];
    if (index === 0) {
      return [
        currentItem,
        arr.slice(1),
      ];
    }
    if (index === len - 1) {
      return [
        currentItem,
        arr.slice(0, index),
      ];
    }
    return [
      currentItem,
      [
        ...arr.slice(0, index),
        ...arr.slice(index + 1),
      ],
    ];
  };
};

export const update = (arr) => {
  assert(Array.isArray(arr), 'Expected an array');
  const find = findIndex(arr);
  return (_id, fn) => {
    assert(typeof fn === 'function', 'Expected update function');
    const index = find(_id);
    if (index === -1) {
      return null;
    }
    const currentItem = arr[index];
    const dataUpdated = fn(currentItem);
    if (!dataUpdated) {
      return null;
    }
    const itemNext = {
      ...currentItem,
      ...dataUpdated,
    };
    assert(
      typeof itemNext._id === 'string' && itemNext._id === currentItem._id,
      '_id field cannot be modified',
    );
    const newArr = [...arr];
    newArr[index] = itemNext;
    return [
      itemNext,
      currentItem,
      newArr,
    ];
  };
};

export const find = (arr) => {
  const fd = findIndex(arr);
  return (_id) => {
    const index = fd(_id);
    if (index === -1) {
      return null;
    }
    return arr[index];
  };
};
