import { useParams, Link } from "react-router-dom";
import {useState, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';

import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";

import './singleCharacterPage.scss';

const SingleCharacterPage = () => {
    const {characterId} = useParams();
    const [character, setCharacter] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarverService();

    useEffect(() => {
        updateCharacter();
    }, [characterId])

    const onCharacterLoaded = (character) => {
        setCharacter(character);
    }

    const updateCharacter = () => {
        clearError();
        getCharacter(characterId)
            .then(onCharacterLoaded)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !character) ? <View character={character}/> : null;
    

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            <CSSTransition in={!loading} timeout={800} classNames="single-character">
                <>{content}</>
            </CSSTransition>
        </>
    )
}

const View = ({character}) => {
    const {name, thumbnail, description} = character;

    return (
        <div className="single-character">
        <img src={thumbnail} alt={name} className="single-character__img"/>
        <div className="single-character__info">
            <h2 className="single-character__name">{name}</h2>
            <p className="single-character__descr">{description}</p>
        </div>
        <Link to="/" className="single-character__back">Back to all</Link>
    </div>
    )
}

export default SingleCharacterPage;