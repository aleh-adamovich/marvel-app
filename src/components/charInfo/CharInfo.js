import './charInfo.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

export default class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    };

    marvelService = new MarvelService();

    onCharLoading = () => this.setState({
        loading: true
    });

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
        });
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        });
    }

    updateChar = () => {
        const {charId} = this.props;

        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService.getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.charId !== this.props.charId) {
            this.updateChar();
        }
    }

    render() {

        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
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