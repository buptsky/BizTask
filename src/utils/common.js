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
// 清除字符串首尾空字符
export function trim(text) {
  return (text || '').replace(/^\s+|\s+$/g, '');
}