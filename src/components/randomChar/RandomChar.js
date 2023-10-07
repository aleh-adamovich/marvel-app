import {useEffect, useState} from "react";
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import {useMarvelService} from "../../hooks/useMarvelService";

const RandomChar = () => {
    const [char, setChar] = useState({});

    useEffect(() => {
        updateCharacter();
    }, []);

    const {isLoading, isError, clearError, getCharacter} = useMarvelService();

    const updateCharacter = () => {
        // const id = 1011278; id with error
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        clearError();

        getCharacter(id)
            .then((char) => setChar(char));
    }

    const error = isError ? <ErrorMessage/> : null;
    const spinner = isLoading ? <Spinner/> : null;
    const content = !(isError || isLoading) ? <View char={char}/> : null;

    return (
        <div className="randomchar">
            {error}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateCharacter}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

export default RandomChar;

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    let imgStyle = {objectFit: 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {objectFit: 'contain'}
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className='randomchar__img' style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {!description ? 'No Info' : description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}