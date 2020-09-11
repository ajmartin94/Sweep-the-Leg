function loseSequence() {
    this.classList.add('mine');

    gameOverlay.style.display = 'block';
}

function winSequence() {
    gameOverlay.style.display = 'block';
}

function clearZeros() {
    const startRow = parseInt(this.dataset.row);
    const startCol = parseInt(this.dataset.col);

    for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
            const row = startRow + a;
            const col = startCol + b;
            
            const notBelowGrid = row >= 0 && col >= 0;
            const notAboveGrid = row < rows && col < cols;
            const notCurrentGrid = !((a === 0) && (b === 0));

            if (notBelowGrid && notAboveGrid && notCurrentGrid)  {
                if (gridData[row][col] === 0) {
                    const gridCol = document.querySelectorAll(`[data-col='${col}']`);
                    const gridSqr = [...gridCol].filter((sqr) => sqr.dataset.row === `${row}`);
                    console.log(gridSqr);
                    revealNumber.bind(gridSqr[0])();
                }   
            }
        }
    }
}

function revealNumber() {
    this.classList.remove('hidden');
    this.classList.add('revealed')

    const gridNum = gridData[this.dataset.row-1][this.dataset.col-1];

    if (gridNum === 9) {
        loseSequence.bind(this)();
    } else if (gridNum === 0) {
        clearZeros.bind(this)();
    } else {
        const pTag = document.createElement('p');
        pTag.innerText = `${gridNum}`;
        this.appendChild(pTag);
        goodSquares--;
    }

    if (goodSquares === 0) {
        winSequence();
    }
}

const gameBoard = document.querySelector('#gameBoard');
const gameOverlay = document.querySelector('#gameOverlay');

const rows = 10;
const cols = 10;
gameBoard.style['grid-template-rows'] = `repeat(${rows},20px`;
gameBoard.style['grid-template-columns'] = `repeat(${cols},20px`;

const totalMines = 10;
let goodSquares = rows*cols - totalMines;

let gridData = [];

for (let i = 0; i < rows; i++) {
    let temp = [];
    for (let j = 0; j < cols; j++) {
        temp.push(0);
    }
    gridData.push(temp);
}

for (let i = 0; i < totalMines; i++) {
    const mineRow = Math.round(Math.random() * (rows-1));
    const mineCol = Math.round(Math.random() * (cols-1));

    gridData[mineRow][mineCol] = 9;
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
                    // console.log('Skipped '+a+' '+b+' at '+i+' '+j+' because '+notBelowGrid+notAboveGrid+notCurrentGrid);
                }
            }
        }

        if (gridData[i][j] !== 9) {
            gridData[i][j] = sum;
        }
    }
}

for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
        const gridDiv = document.createElement('div');
        gameBoard.appendChild(gridDiv);
        gridDiv.classList.add('mineGrid','hidden');
        gridDiv.style['grid-column'] = `${j}`;
        gridDiv.style['grid-row'] = `${i}`;

        gridDiv.setAttribute('data-col', j-1);
        gridDiv.setAttribute('data-row', i-1);
        
        gridDiv.addEventListener('click',function clickFunction(event) {
            gridDiv.style['box-shadow'] = '0 0 3px 0 black inset';

            setTimeout(() => {
                revealNumber.bind(gridDiv)();

                gridDiv.style['box-shadow'] = '';
                
            },80)

            gridDiv.removeEventListener('click',clickFunction);
        })
    }
}

