import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import {useState, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';

import useMarverService from '../../services/MarverService';
import AppBanner from '../appBanner/AppBanner';
import setContent from '../../utils/setContent';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const {loading, getComics, clearError, process, setProcess} = useMarverService();

    useEffect(() => {
        updateComic();
    }, [comicId])

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const updateComic = () => {
        clearError();
        getComics(comicId)
            .then(onComicLoaded)
            .then(() => setProcess('confirmed'))
    }

    return (
        <>
            <AppBanner/>
            <CSSTransition in={!loading} timeout={800} classNames="single-comic">
                <>{setContent(process, View, comic)}</>
            </CSSTransition>
        </>
    )
}

const View = ({data}) => {
    const {title, description, pagecount, thumbnail, language, price} = data;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comics book`}
                    />
                <title>{title}</title>
            </Helmet>
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