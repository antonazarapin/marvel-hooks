import { useHttp } from "../hooks/http.hook";

const useMarverService = () => {
    const {loading, request, error, clearError, process, setProcess} = useHttp();


    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=f2c13ab6f69535c61a86e989c97e34cb';
    const _baseOffset = 210;



    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByNameStartWith = async (name) => {
		const res = await request(`${_apiBase}characters?nameStartsWith=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : `The server doesn't have a description for this character...`,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics)
    }

    const getComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics/${offset}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            pagecount: comics.pageCount  ? `${comics.pageCount} pages`: 'There is no information about the number of pages',
            price: comics.prices[0].price,
            description: comics.textObjects[0] ? `${comics.textObjects[0].text.slice(0, 210)}...` : `The server doesn't have a description for this comics...`,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects[0] ? comics.textObjects[0].language : 'en-us'
        }
    }

    return {
        loading, 
        error, 
        clearError,
        process,
        setProcess,
        getAllCharacters, 
        getCharacter, 
        getAllComics, 
        getComics, 
        getCharacterByNameStartWith}
}

export default useMarverService;