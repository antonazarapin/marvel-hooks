import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarverService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        const {charId} = props;

        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }



    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            <CSSTransition in={!loading} timeout={800} classNames="char__animate">
            <>{skeleton}
            {errorMessage}
            {spinner}
            {content}</>
            </CSSTransition>
        </div>
    )
}

const View = ({char}) => {
    const {name, thumbnail, description, wiki, homepage, comics} = char;

    const comicsUpdate = () => {
        if (comics.length > 0) {
            return null;
        } else {
            return (
                <li className="char__comics-item">
                    The server doesn't have comics with this character...
                </li>
            )
        }
    }

    return (
        <div className='char__animate'>
            <div className="char__basics">
                <img src={thumbnail} 
                             alt={name}
                             style={
                                thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' 
                                    ? { objectFit: 'unset' } 
                                    : { objectFit: 'cover' }
                             }/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsUpdate()}
                {
                    comics.map((item, i) => {
                        if (i > 10) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;