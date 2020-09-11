const gameBoard = document.querySelector('#gameBoard');
rows = 10;
cols = 10;
gameBoard.style['grid-template-rows'] = `repeat(${rows},20px`;
gameBoard.style['grid-template-columns'] = `repeat(${cols},20px`;

let gridData = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,9,9,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,9,0,0,0],
    [0,0,0,0,0,9,0,0,0,0],
    [0,0,9,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
        const gridDiv = document.createElement('div');
        gameBoard.appendChild(gridDiv);
        gridDiv.classList.add('mineGrid','hidden');
        gridDiv.style['grid-column'] = `${j}`;
        gridDiv.style['grid-row'] = `${i}`;

        gridDiv.setAttribute('data-col', j);
        gridDiv.setAttribute('data-row', i);
        
        gridDiv.addEventListener('click',function revealNumber(event) {
            gridDiv.style['box-shadow'] = '0 0 3px 0 black inset';

            setTimeout(() => {
                gridDiv.classList.remove('hidden');
                gridDiv.classList.add('revealed')
                
                const pTag = document.createElement('p');
                pTag.innerText = `${gridData[gridDiv.dataset.row-1][gridDiv.dataset.col-1]}`;
                gridDiv.appendChild(pTag);

                gridDiv.style['box-shadow'] = '';

                gridDiv.removeEventListener('click',revealNumber);
            },80)
            
        })
    }
}

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {

        let sum = 0;

        for (let a = -1; a <= 1; a++) {
            for (let b = -1; b <= 1; b++) {
                const notBelowGrid = (i+a) >= 0 && (j+b) >= 0;
                const notAboveGrid = (i+a) < rows && (j+b) < cols;
                const notCurrentGrid = !((a === 0) && (b === 0));

                if (notBelowGrid && notAboveGrid && notCurrentGrid)  {
                    if (gridData[i+a][j+b] === 9) {
                        sum++;
                    }
                } else {
                    console.log('Skipped '+a+' '+b+' at '+i+' '+j+' because '+notBelowGrid+notAboveGrid+notCurrentGrid);
                }
            }
        }

        if (gridData[i][j] !== 9) {
            gridData[i][j] = sum;
        }
    }
}
