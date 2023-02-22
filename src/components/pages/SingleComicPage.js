import { useParams, Link } from 'react-router-dom';
import {useState, useEffect} from 'react';

import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const {loading, error, getComics, clearError} = useMarverService();

    useEffect(() => {
        updateComic();
    }, [comicId])
    // пользователь сам может ввести ссылку с id и приложение должно за этим следить

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const updateComic = () => {
        clearError();
        getComics(comicId)
            .then(onComicLoaded)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, pagecount, thumbnail, language, price} = comic;
    console.log(pagecount);

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pagecount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}$</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;