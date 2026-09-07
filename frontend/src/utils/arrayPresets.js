function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Bars are drawn at `value * 30`px inside a fixed-height container, so
// values need to stay small enough to fit — keep this in sync with the
// container height in BubbleSortVisualizer.css / QuickSortVisualizer.css.
const SORT_MAX_VALUE = 10;
const SORT_MIN_SIZE = 1;
const SORT_MAX_SIZE = 10;

function sampleUniqueValues(size) {
  const values = new Set();
  while (values.size < size) {
    values.add(randInt(1, SORT_MAX_VALUE));
  }
  return Array.from(values);
}

// Unsorted arrays for Bubble Sort / Quick Sort, with edge cases that
// showcase best/worst-case behavior. Every call also randomizes how many
// numbers are generated (1-10), not just their values.
export function generateSortArray(type = 'random') {
  const size = randInt(SORT_MIN_SIZE, SORT_MAX_SIZE);

  switch (type) {
    case 'sorted':
      return sampleUniqueValues(size).sort((a, b) => a - b);
    case 'reverse':
      return sampleUniqueValues(size).sort((a, b) => b - a);
    case 'duplicates': {
      const value = randInt(1, SORT_MAX_VALUE);
      return Array.from({ length: size }, () => value);
    }
    case 'random':
    default:
      return sampleUniqueValues(size);
  }
}

const SEARCH_MIN_SIZE = 1;
const SEARCH_MAX_SIZE = 10;

// Sorted arrays for Binary Search. "duplicates" keeps it non-decreasing
// (still valid for binary search) but lets repeated values appear, which
// is itself a useful edge case to see. Array length is also randomized
// (1-10) on every call.
export function generateSearchArray(type = 'unique') {
  const size = randInt(SEARCH_MIN_SIZE, SEARCH_MAX_SIZE);
  const arr = [];
  let v = randInt(1, 5);
  for (let i = 0; i < size; i++) {
    arr.push(v);
    v += type === 'duplicates' ? randInt(0, 6) : randInt(1, 8);
  }
  return arr;
}
