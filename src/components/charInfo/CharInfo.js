import './charInfo.scss';
import {useEffect, useState} from "react";
import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import {useMarvelService} from "../../hooks/useMarvelService";

const CharInfo = ({charId}) => {
    const [char, setChar] = useState(null);

    useEffect(() => {
        updateChar();
    }, [charId]);

    const {isLoading, isError, clearError, getCharacter} = useMarvelService();

    const onCharLoaded = (char) => setChar(char);

    const updateChar = () => {
        if (!charId) {
            return;
        }

        clearError();

        getCharacter(charId)
            .then(onCharLoaded);
    }

    const skeleton = char || isLoading || isError ? null : <Skeleton/>;
    const error = isError ? <ErrorMessage/> : null;
    const spinner = isLoading ? <Spinner/> : null;
    const content = !(isError || isLoading || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {error}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {objectFit: 'cover'};

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {objectFit: 'contain'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
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
                {comics.length > 0 ? null : 'There is no comics for this character'}
                {comics.slice(0, 10).map(({name}) => {
                    return (
                        <li key={name} className="char__comics-item">
                            {name}
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default CharInfo;