import assert from 'node:assert';

export const sort = (arr) => {
  assert(Array.isArray(arr));
  const len = arr.length;
  if (len === 0) {
    return [];
  }
  assert(typeof arr[0]._id === 'string');
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
  assert(Array.isArray(arr));
  const len = arr.length;
  return (_id) => {
    assert(typeof _id === 'string');
    if (len === 0) {
      return -1;
    }
    if (len === 1) {
      return arr[0]._id === _id ? 0 : -1;
    }
    let left = 0;
    let right = len;
    let mid = Math.floor((right - left) / 2);
    while (left < right) {
      const index = mid + left;
      const d = arr[index];
      if (d._id === _id) {
        return index;
      }
      if (_id > d._id) {
        left = index + 1;
      } else {
        right = index;
      }
      if (left < right) {
        mid = Math.floor((right - left) / 2);
      }
    }
    return -1;
  };
};

export const remove = (arr) => {
  assert(Array.isArray(arr));
  const len = arr.length;
  const find = findIndex(arr);
  return (_id) => {
    const index = find(_id);
    if (index === -1) {
      return null;
    }
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
  assert(Array.isArray(arr));
  const len = arr.length;
  const find = findIndex(arr);
  return (_id, fn) => {
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
    if (index === 0) {
      return [
        itemNext,
        currentItem,
        [
          itemNext,
          ...arr.slice(1),
        ],
      ];
    }
    if (index === len - 1) {
      return [
        itemNext,
        currentItem,
        [
          ...arr.slice(0, index),
          itemNext,
        ],
      ];
    }
    return [
      itemNext,
      currentItem,
      [
        ...arr.slice(0, index),
        itemNext,
        ...arr.slice(index + 1),
      ],
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
