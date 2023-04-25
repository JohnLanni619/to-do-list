export default function Search() {
    function handleSearch(e) {
        const inputValue = e.target.value.toLowerCase();;
        const targets = document.querySelectorAll('#category-container > div');
        targets.forEach( target => {
            const categoryTitle = target.querySelector('h2').textContent.toLowerCase();
            if (categoryTitle.includes(inputValue)) {
                target.classList.remove('hidden')
            } else {
                target.classList.add('hidden')
            }
        })
    }
    return (
        <input 
            className="input" 
            type="text" 
            onChange={event => handleSearch(event)}
        />
    )
};