// 2021-03-14
function debounce(func, wait = 0, { immediate = false, maxWait } = {}) {
    let timer = null;
    let timestamp = null;

    return function() {
        const that = this, args = arguments;
        const timeout = maxWait < wait ? maxWait : wait;

        const invokeFunc = function() {
            if (!immediate) func.call(that, args);
        }

        if (!timer) {
            if (immediate) func.call(that, args);
            timestamp = Date.now();
        } else {
            clearTimeout(timer);
            timer = null;

            if (!!maxWait && (Date.now() - timestamp >= maxWait)) {
                if (!immediate) func.call(that, args);
                return;
            }
        }

        timer = setTimeout(invokeFunc, timeout);
    };
}

function throttle(func, wait = 0, { immediate = false } = {}) {
    return debounce(func, wait, { immediate, maxWait: wait });
}

function main() {
    const t1 = setInterval((function() {
        return debounce(() => { console.log("debounced - immediate"); }, 3000, { immediate: true });
    })(), 100);

    const t2 = setInterval((function() {
        return debounce(() => { console.log("debounced"); }, 3000);
    })(), 100);

    const t3 = setInterval((function() {
        return throttle(() => { console.log("throttled - immediate"); }, 3000, { immediate: true });
    })(), 100);

    const t4 = setInterval((function() {
        return throttle(() => { console.log("throttled"); }, 3000);
    })(), 100);

    const t0 = setInterval(() => {
        console.log("elapsed time: 1000 ms");
    }, 1000);

    const timer = setTimeout(() => {
        clearInterval(t1);
        clearInterval(t2);
        clearInterval(t3);
        clearInterval(t4);
        clearInterval(t0);

        clearTimeout(timer);
    }, 6099);

    // Outputs:
    // => debounced - immediate
    // => throttled - immediate
    // => elapsed time: 1000 ms
    // => elapsed time: 1000 ms
    // => elapsed time: 1000 ms
    // => throttled
    // => throttled - immediate
    // => elapsed time: 1000 ms
    // => elapsed time: 1000 ms
    // => elapsed time: 1000 ms
    // => debounced
    // => throttled
}

// main();