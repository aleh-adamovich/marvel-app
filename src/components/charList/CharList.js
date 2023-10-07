import {useEffect, useState} from "react";
import './charList.scss';
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import {useMarvelService} from "../../hooks/useMarvelService";

const CharList = ({onCharSelected}) => {
    const [charList, setCharList] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isCharListEnded, setIsCharListEnded] = useState(false);
    const [offset, setOffset] = useState(210);

    const {isLoading, isError, getAllCharacters} = useMarvelService();

    useEffect(() => {
        fetchCharList(offset, true);
    }, []);

    const fetchCharList = (offset, initialLoading) => {
        initialLoading ? setIsLoadingMore(false) : setIsLoadingMore(true);

        getAllCharacters(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newCharList) => {
        let isCharListEnded = false;

        if (newCharList.length < 9) {
            isCharListEnded = true;
        }

        setCharList((prevState) => [...prevState, ...newCharList]);
        setIsLoadingMore(false);
        setOffset((prevState) => prevState + 9);
        setIsCharListEnded(isCharListEnded);
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

    const error = isError ? <ErrorMessage/> : null;
    const spinner = isLoading && !isLoadingMore ? <Spinner/> : null;
    const content = renderCharList();

    return (
        <div className="char__list">
            {error}
            {spinner}
            {content}
            {!error && (
                <button
                    className="button button__main button__long"
                    onClick={() => fetchCharList(offset)}
                    disabled={isLoadingMore}
                    style={{display: isCharListEnded ? 'none' : 'display'}}
                >
                    <div className="inner">load more</div>
                </button>
            )}
        </div>
    )
}

export default CharList;
