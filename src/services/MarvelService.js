

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=7466c3a4b2d41053b291b432f6f17618';
    _baseOffset = 210;


    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    };

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    };

    _transformCharacter = (char) => {
        let newChar = char;
        if (newChar.description === '') {
            newChar.description = 'Sorry, no data';
        }
        if (newChar.description.length > 150) {
            const text = newChar.description.slice(0, 150);
            newChar.description = text + '...';
        }
        return {
            name: newChar.name,
            description: newChar.description,
            thumbnail: newChar.thumbnail.path + '.' + newChar.thumbnail.extension,
            homepage: newChar.urls[0].url,
            wiki: newChar.urls[1].url,
            id:  newChar.id,
            comics: newChar.comics.items
        }
    };
}

export default MarvelService;