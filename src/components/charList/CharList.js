import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import MarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [activeCharacter, setActiveCharacter] = useState(true);

    const marverService = new MarverService();

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = (offset) => {
        onCharLoading();
        marverService.getAllCharacters(offset)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharLoading = () => {
        setNewItemLoading(true);
    }

    const onCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const onError = () => {
        setError(false);
        setLoading(false);
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
                                item.thumbnail.indexOf('not_available') !== -1 
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
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}

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