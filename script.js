const gameBoard = document.querySelector('#gameBoard');
rows = 20;
cols = 30;
gameBoard.style['grid-template-rows'] = `repeat(${rows},20px`;
gameBoard.style['grid-template-columns'] = `repeat(${cols},20px`;

for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
        const gridDiv = document.createElement('div');
        gameBoard.appendChild(gridDiv);
        gridDiv.classList.add('mineGrid');
        gridDiv.style['grid-column'] = `${j}`;
        gridDiv.style['grid-row'] = `${i}`;
    }
}