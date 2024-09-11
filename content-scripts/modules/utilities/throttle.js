/*-- 
- Simple utility throttle function with no return value
- Example usage:
  const throttledFunc = throttle(function() {
      // This function will only be called at most once every 1000 milliseconds
  }, 1000)
--*/
export default function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
        const args = arguments;
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(
                function () {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan),
            );
        }
    };
}
