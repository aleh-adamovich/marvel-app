import {useEffect, useState} from "react";
import './charList.scss';
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const CharList = ({onCharSelected}) => {
    const [charList, setCharList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isCharListEnded, setIsCharListEnded] = useState(false);
    const [offset, setOffset] = useState(1535);

    const marvelService = new MarvelService();

    useEffect(() => {
        fetchCharList();
    }, []);

    const fetchCharList = (offset) => {
        onCharListLoading();

        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    }

    const onCharListLoading = () => {
        setIsLoadingMore(true);
    }

    const onCharListLoaded = (newCharList) => {
        let isCharListEnded = false;

        if (newCharList.length < 9) {
            isCharListEnded = true;
        }

        setCharList((prevState) => [...prevState, ...newCharList]);
        setIsLoading(false);
        setIsLoadingMore(false);
        setOffset((prevState) => prevState + 9);
        setIsCharListEnded(isCharListEnded);
    }

    const onError = () => {
        setIsError(true);
        setIsLoading(false);
    }


    // change to useRef
    const refItems = [];
    const setRefItems = (elem) => refItems.push(elem);

    // check this func
    const renderCharList = () => {
        const renderItems = charList.map(({id, name, thumbnail}, i) => {
            let imgStyle = {objectFit: 'cover'};

            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {objectFit: 'unset'}
            }

            const handleClick = () => {
                onCharSelected(id);

                refItems.forEach((ref) => ref.classList.remove('char__item_selected'));
                refItems[i].classList.add('char__item_selected');
            }

            return (
                <li
                    key={id}
                    className="char__item"
                    onClick={handleClick}
                    ref={setRefItems}
                    tabIndex={0}
                >
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {renderItems}
            </ul>
        );
    }

    const errorMessage = isError ? <ErrorMessage/> : null;
    const spinner = isLoading ? <Spinner/> : null;
    const content = !(isError || isLoading) ? renderCharList() : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                onClick={() => fetchCharList(offset)}
                disabled={isLoadingMore}
                style={{display: isCharListEnded ? 'none' : 'display'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;
