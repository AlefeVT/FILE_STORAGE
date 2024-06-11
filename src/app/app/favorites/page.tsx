import FileBrowser from "../_components/file-browser";

export default function FavoritePage() {
    return (
        <>
            <FileBrowser title="Arquivos Favoritos" favorites={true}/>
        </>
    )
}