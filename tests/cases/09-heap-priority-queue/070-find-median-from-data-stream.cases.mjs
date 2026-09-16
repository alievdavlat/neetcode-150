export default {
  cases: [
    {
      label: 'doc block sequence',
      construct: [],
      ops: [
        ['addNum', [1]],
        ['addNum', [2]],
        ['findMedian', [], 1.5],
        ['addNum', [3]],
        ['findMedian', [], 2],
      ],
    },
    {
      label: 'values arrive out of order',
      construct: [],
      ops: [
        ['addNum', [6]],
        ['addNum', [10]],
        ['addNum', [2]],
        ['addNum', [6]],
        ['findMedian', [], 6],
        ['addNum', [5]],
        ['findMedian', [], 6],
        ['addNum', [0]],
        ['findMedian', [], 5.5],
      ],
    },
    {
      label: 'single value, then a descending stream',
      construct: [],
      ops: [
        ['addNum', [5]],
        ['findMedian', [], 5],
        ['addNum', [4]],
        ['findMedian', [], 4.5],
        ['addNum', [3]],
        ['findMedian', [], 4],
        ['addNum', [2]],
        ['findMedian', [], 3.5],
      ],
    },
  ],
};
