import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {useState, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';

import useMarverService from '../../services/MarverService';
import AppBanner from "../appBanner/AppBanner";
import setContent from '../../utils/setContent';

import './singleCharacterPage.scss';

const SingleCharacterPage = () => {
    const {characterId} = useParams();
    const [character, setCharacter] = useState(null);

    const {loading, getCharacter, clearError, process, setProcess} = useMarverService();

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
            .then(() => setProcess('confirmed'))
    }

    return (
        <>
            <AppBanner/>
            <CSSTransition in={!loading} timeout={800} classNames="single-character">
                <>{setContent(process, View, character)}</>
            </CSSTransition>
        </>
    )
}

const View = ({data}) => {
    const {name, thumbnail, description} = data;

    return (
        <div className="single-character">
            <Helmet>
                <meta
                    name="description"
                    content={`${name} comics book`}
                    />
                <title>{name}</title>
            </Helmet>
            <img 
                src={thumbnail} 
                alt={name} 
                className="single-character__img"
                style={
                    thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' 
                        ? { objectFit: 'unset' } 
                        : { objectFit: 'cover' }
                }/>
            <div className="single-character__info">
                <h2 className="single-character__name">{name}</h2>
                <p className="single-character__descr">{description}</p>
            </div>
            <Link to="/" className="single-character__back">Back to all</Link>
        </div>
    )
}

export default SingleCharacterPage;