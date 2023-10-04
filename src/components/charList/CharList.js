import {Component, createRef} from "react";
import './charList.scss';
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

export default class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 1536,
        loadingMoreCharList: false,
        charListEnded: false
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.fetchCharList();
    }

    onCharListLoading = () => {
        this.setState({
            loadingMoreCharList: true
        });
    }

    onCharListLoaded = (newCharList) => {
        let charListEnded = false;

        if (newCharList.length < 9) {
            charListEnded = true;
        }

        this.setState((prevState) => ({
            charList: [...prevState.charList, ...newCharList],
            loading: false,
            loadingMoreCharList: false,
            offset: prevState.offset + 9,
            charListEnded
        }));
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        });
    }

    fetchCharList = (offset) => {
        this.onCharListLoading();

        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    refItems = [];
    setRefItems = (elem) => this.refItems.push(elem);

    renderCharList = () => {
        const charList = this.state.charList.map(({id, name, thumbnail}, i) => {
            let imgStyle = {objectFit: 'cover'};

            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {objectFit: 'unset'}
            }

            const handleClick = () => {
                this.props.onCharSelected(id);

                this.refItems.forEach((ref) => ref.classList.remove('char__item_selected'));
                this.refItems[i].classList.add('char__item_selected');
            }

            return (
                <li
                    key={id}
                    className="char__item"
                    onClick={handleClick}
                    ref={this.setRefItems}
                    tabIndex={0}
                >
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {charList}
            </ul>
        );
    }

    render() {
        const {loading, error, offset, loadingMoreCharList, charListEnded} = this.state;

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? this.renderCharList() : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    onClick={() => this.fetchCharList(offset)}
                    disabled={loadingMoreCharList}
                    style={{display: charListEnded ? 'none' : 'display'}}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}