// A simple queue mechanism to hold pending requests while the auth token is being refreshed

let subscribers: ((token: string | null) => void)[] = [];

/**
 * Add a request to the queue to be retried after token refresh
 * @param callback The function to execute once token is refreshed
 */
export const addSubscriber = (callback: (token: string | null) => void) => {
    subscribers.push(callback);
};

/**
 * Execute all queued requests with the new token or reject them if refresh failed
 * @param error Any error that occurred during refresh, null if successful
 * @param token The new access token
 */
export const processQueue = (error: Error | null, token: string | null = null) => {
    subscribers.forEach((callback) => {
        if (error) {
            callback(null);
        } else {
            callback(token);
        }
    });

    // Clear the queue after processing
    subscribers = [];
};
