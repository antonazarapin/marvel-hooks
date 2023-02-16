import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [activeCharacter, setActiveCharacter] = useState(true);

    const {loading, error, getAllCharacters} = useMarverService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }


    function renderItems(arr) {

        const items = arr.map(item => {

            return (
                <li key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id)
                        setActiveCharacter(activeCharacter => item.id)
                    }}
                    className={
                        activeCharacter === item.id
                            ? 'char__item char__item_selected'
                            : 'char__item'
                    }>
                        
                        <img src={item.thumbnail} 
                             alt={item.name}
                             style={
                                item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' 
                                    ? { objectFit: 'unset' } 
                                    : { objectFit: 'cover' }
                             }/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })
    
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
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