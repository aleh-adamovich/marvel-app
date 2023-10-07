import {useHttp} from "./useHttp";

export const useMarvelService = () => {
    const {isLoading, isError, makeRequest, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=a89f079e1ebfdf087c8f9923caf65f08';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await makeRequest(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return  res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await makeRequest(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }

    return {isLoading, isError, clearError, getCharacter, getAllCharacters}
}
