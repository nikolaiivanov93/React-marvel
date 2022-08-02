import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charAll, setCharAll] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const onCharAllLoaded = (newCharAll) => {
        let ended = false;
        if (newCharAll.length < 9) {
            ended = true;
        }

        setCharAll(charAll => [...charAll, ...newCharAll]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    };

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const {loading,error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharAllLoaded)
    }

    function returnContent (charAll) {
        const char = charAll.map((item, i) => {
            const {name, thumbnail} = item;
            let object = 'cover';
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                object = 'contain';
            }
            return (
                <li 
                    key={item.id}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            focusOnItem(i)
                        }
                    }}
                    className="char__item">
                    <img style={{objectFit: object}} src={thumbnail} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {char}
            </ul>
        )
    }

        const spinner = loading && !newItemLoading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const items = returnContent(charAll);

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{'display': charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;