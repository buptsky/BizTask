// 函数去抖
export function debounce(fn, interval = 300) {
  let timeout = null;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, interval);
  }
};