function difficultyScreen() {
    const diffButtons = gameOverlay.querySelector('#difficultyButtons');
    const diff = gameOverlay.querySelector('#difficulty');
    const play = gameOverlay.querySelector('#play');
    const easy = gameOverlay.querySelector('#easy');
    const medium = gameOverlay.querySelector('#medium');
    const hard = gameOverlay.querySelector('#hard');

    diffButtons.style.display = 'flex';
    diff.style.display = 'block';
    play.style.display = 'block';

    function newBoard(row,col,mine) {
        resetBoard(row,col,mine);
        play.addEventListener('click',() => {
            gameOverlay.style.display = 'none'
            diffButtons.style.display = 'none';
            diff.style.display = 'none';
            play.style.display = 'none';
        });
    }

    easy.addEventListener('click',() => {
        newBoard(10,10,15);
    })

    medium.addEventListener('click',() => {
        newBoard(20,20,60);
    })
    
    hard.addEventListener('click',() => {
        newBoard(20,40,120);
    })


}

function loseSequence() {
    addMine.bind(this)();

    gameOverlay.style.display = 'flex';

    const report = gameOverlay.querySelector('#gameReport');
    const text = gameOverlay.querySelector('#headerText')
    const yes = gameOverlay.querySelector('#yes');
    const no = gameOverlay.querySelector('#no');
    const cont = gameOverlay.querySelector('#continue');
    const playButtons = gameOverlay.querySelector('#playButtons');

    report.style.display = 'block';
    playButtons.style.display = 'flex';
    cont.style.display = 'none';

    yes.addEventListener('click',()=> {
        playButtons.style.display = 'none';
        report.style.display = 'none';
        difficultyScreen();
    });

    no.addEventListener('click',() => {
        text.innerText = 'Cmon now. Play again. Do it.'
        no.style.display = 'none';
    })
}

function winSequence() {
    gameOverlay.style.display = 'flex';


}

function clearZeros() {
    const startRow = parseInt(this.dataset.row);
    const startCol = parseInt(this.dataset.col);

    for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
            const row = startRow + a;
            const col = startCol + b;
            
            const notBelowGrid = row >= 0 && col >= 0;
            const notAboveGrid = row < gridRows && col < gridCols;
            const notCurrentGrid = !((a === 0) && (b === 0));

            if (notBelowGrid && notAboveGrid && notCurrentGrid)  {
                const gridCol = document.querySelectorAll(`[data-col='${col}']`);
                const gridSqr = [...gridCol].filter((sqr) => sqr.dataset.row === `${row}`);

                if (gridSqr[0].parentElement.classList.contains('hidden')) {
                    revealNumber.bind(gridSqr[0])();
                }   
            }
        }
    }
}

function addMine() {
    this.classList.add('mine');

}

function revealNumber() {
    this.style.display = 'none';
    this.parentElement.classList.remove('hidden');

    const gridNum = gridData[this.dataset.row][this.dataset.col];

    if (gridNum === 9) {
        loseSequence.bind(this.parentElement)();
    } else if (gridNum === 0) {
        goodSquares--;
        clearZeros.bind(this)();
    } else {
        const pTag = this.parentElement.querySelector('p');
        pTag.innerText = `${gridNum}`;
        goodSquares--;
    }

    if (goodSquares === 0) {
        winSequence();
    }
}

function getRandomGrid() {
    const randRow = Math.round(Math.random() * (gridRows-1));
    const randCol = Math.round(Math.random() * (gridCols-1));
    return [randRow,randCol];
}

function populateGrid(totalMines) {
    const thisRow = parseInt(this.dataset.row);
    const thisCol = parseInt(this.dataset.col);
    
    let minesPlaced = 0;

    while(minesPlaced < totalMines) {
        [mineRow,mineCol] = getRandomGrid();
        if (Math.abs(thisRow - mineRow) >= 2 && Math.abs(thisCol - mineCol) >= 2 && gridData[mineRow][mineCol] !== 9) {
            gridData[mineRow][mineCol] = 9;
            minesPlaced++;
        }
       
    }
    
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {

            let sum = 0;

            for (let a = -1; a <= 1; a++) {
                for (let b = -1; b <= 1; b++) {
                    const notBelowGrid = (i+a) >= 0 && (j+b) >= 0;
                    const notAboveGrid = (i+a) < gridRows && (j+b) < gridCols;
                    const notCurrentGrid = !((a === 0) && (b === 0));

                    if (notBelowGrid && notAboveGrid && notCurrentGrid)  {
                        if (gridData[i+a][j+b] === 9) {
                            sum++;
                        }
                    }
                }
            }

            if (gridData[i][j] !== 9) {
                gridData[i][j] = sum;
            }
        }
    }
}

function resetBoard(rows,cols,totalMines) {
    let noClicks = true;
    goodSquares = rows*cols - totalMines;
    
    gridData = [];
    gridRows = rows;
    gridCols = cols;

    gameBoard.textContent = '';
    gameBoard.style['grid-template-rows'] = `repeat(${rows},20px`;
    gameBoard.style['grid-template-columns'] = `repeat(${cols},20px`;

    for (let i = 0; i < rows; i++) {
        let temp = [];
        for (let j = 0; j < cols; j++) {
            temp.push(0);
        }
        gridData.push(temp);
    }

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            const gridCoveredDiv = document.createElement('div');
            gridCoveredDiv.classList.add('gridCover');
            gridCoveredDiv.setAttribute('data-col', j-1);
            gridCoveredDiv.setAttribute('data-row', i-1);

            const gridRevealedDiv = document.createElement('div');
            gridRevealedDiv.classList.add('hidden');
            gridRevealedDiv.style['grid-column'] = `${j}`;
            gridRevealedDiv.style['grid-row'] = `${i}`;
            gridRevealedDiv.classList.add('mineGrid');
            const pTag = document.createElement('p');
            gridRevealedDiv.appendChild(pTag);

            gameBoard.appendChild(gridRevealedDiv);
            gridRevealedDiv.appendChild(gridCoveredDiv);
            
            gridCoveredDiv.addEventListener('click',function clickFunction(event) {
                const existingFlag = gridCoveredDiv.querySelector('.flag');

                if (!existingFlag) {
                    if (noClicks) {
                        populateGrid.bind(gridCoveredDiv)(totalMines);
                        noClicks = false;
                    }

                    gridCoveredDiv.style['box-shadow'] = '0 0 3px 0 black inset';

                    setTimeout(() => {
                        revealNumber.bind(gridCoveredDiv)();

                        gridCoveredDiv.style['box-shadow'] = '';
                        
                    },80)

                    gridCoveredDiv.removeEventListener('click',clickFunction);
                }
            })

            gridCoveredDiv.addEventListener('contextmenu', function addFlag(e) {
                e.preventDefault();

                const existingFlag = gridCoveredDiv.querySelector('img');

                if (!existingFlag) {
                    const flagImg = document.createElement('img');
                    flagImg.setAttribute('src','images/flag.png');
                    flagImg.classList.add('flag');
                    gridCoveredDiv.appendChild(flagImg);
                } else {
                    existingFlag.remove();
                }

                return false;
            })
        }
    }
}

const gameBoard = document.querySelector('#gameBoard');
const gameOverlay = document.querySelector('#gameOverlay');
let goodSquares;
let gridRows;
let gridCols;
let gridData;

// const rows = 10;
// const cols = 10;
// const totalMines = 20;

resetBoard(10,10,15);