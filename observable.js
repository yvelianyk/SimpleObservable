// ------------------------------------------------------------------------------
// OBSERVABLE IMPLEMENTATION:
// ------------------------------------------------------------------------------

class Observable {
    constructor(subscribe) {
        this.subscribe = subscribe;
    }

    static fromEvent (element, eventName) {
        return new Observable((observer) => {
            const callback = (event) => observer(event);
            element.addEventListener(eventName, callback, false);
            return () => element.removeEventListener(eventName, callback, false);
        });
    }

    map(modifier) {
        return new Observable((observer) => {
            const mapObserver = value => observer(modifier(value));
            return this.subscribe(mapObserver);
        });
    }
}

// ------------------------------------------------------------------------------
// USAGE:
// ------------------------------------------------------------------------------

Observable.fromEvent(document, 'DOMContentLoaded')
    .subscribe(() => {
        const node = document.querySelector('input');
        const paragraph = document.querySelector('p');

        let unsubscribe = Observable.fromEvent(node, 'input')
            .map((event) => event.target.value)
            .map((value) => value + ' : MAPPED VALUE')
            .subscribe((text) => paragraph.innerHTML = text);

        // Unsubscribe after 10 seconds
        setTimeout(unsubscribe, 10000);
    });
