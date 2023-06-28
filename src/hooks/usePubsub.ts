import { useEffect } from 'react';
import PubSub from 'pubsub-js';

type EventHandler = (message: string, data?: any) => void;

const usePubSubEvent = (eventName: string, eventHandler: EventHandler) => {
    useEffect(() => {
        const token = PubSub.subscribe(eventName, eventHandler);
        return () => {
            PubSub.unsubscribe(token);
        };
    }, [eventName, eventHandler]);
};

export default usePubSubEvent;
