// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

const SearchBar = () => {
    return (
        <div id="se-search">
            <div>
                <select id="se-search-select">
                    <option value="">Tudo</option>
                    <option value="student">Estudante</option>
                    <option value="teacher">Professor</option>
                </select>
                <input
                    type="text"
                    id="se-search-bar"
                    placeholder="Pesquisar no Sigarra"
                />
            </div>
            <div
                className="se-header-link-popover se-popover-open"
                style={{ padding: "20px", width: "300px" }}
            >
                <div class="gcse-searchbox"></div>
                <div class="gcse-searchresults"></div>
            </div>
        </div>
    );
};

export default SearchBar;
