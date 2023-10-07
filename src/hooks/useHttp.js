import {useState} from "react";

export const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    const makeRequest = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        try {
            setIsLoading(true);

            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            setIsLoading(false);

            return  await response.json();
        } catch (e) {
            setIsLoading(false);
            setIsError(e.message);
            throw e;
        }
    }

    const clearError = () => setIsError(null);

    return {isLoading, isError, makeRequest, clearError}
}
