let form;
const DEBUG = false;
boardVue = new Vue({
    el: '#vue',
    data: {
        name: "2048",
        score: 0,
        board: [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],
    },
    created: function(){
        console.log("DEBUG is set to: "+DEBUG)
        if(DEBUG) console.log("to make the game playable set to false")
        else console.log("to make it easier to test loses enable")
        $("#form").hide()
        this.addTile()
        this.addTile()
        if(!DEBUG)    $("#addButton").hide()

    },
    methods: {
        addTile: function(){
            let free = []
            for (let i = 0; i < 16; i++) {
                if(this.board[i]===0){
                    free.push(i);
                }
            }
            let slot = free[Math.floor(Math.random()*free.length)];
            if(DEBUG)    this.board[slot]=Math.floor(Math.random()*200);
            else         this.board[slot]= 2;
            free = []
            for (let i = 0; i < 16; i++) {
                if(this.board[i]===0){
                    free.push(i);
                }
            }
            if(free.length===0){
                if(!this.possibleMoves()){
                    console.log("game over")
                    this.gameOver();
                }
            }
            this.currentBoard();
        },
        possibleMoves: function(){
            let x = false;
            for(let i =0; i<16;i++) {
                let moves = [0, 1, 2, 3] //[up, down, left right]
                if (i < 4) moves = moves.filter((current) => {
                    return current !== 0
                })
                if (i > 11) moves = moves.filter((current) => {
                    return current !== 1
                })
                if (i % 4 === 0) moves = moves.filter((current) => {
                    return current !== 2
                })
                if (i % 4 === 3) moves = moves.filter((current) => {
                    return current !== 3
                })
                moves.forEach((current) => {
                    if (current === 0) if (this.board[i] === this.board[i - 4]) x= true;
                    if (current === 1) if (this.board[i] === this.board[i + 4]) x= true;
                    if (current === 2) if (this.board[i] === this.board[i - 1]) x= true;
                    if (current === 3) if (this.board[i] === this.board[i + 1]) x= true;

                })
            }
            return x
        },
        gameOver: function() {
            let allCells = document.getElementsByClassName("cell")
            for(let i =0; i<allCells.length; i++){
                allCells[i].setAttribute("hidden", "true")
            }
            $("#form").show()
            document.getElementById("playerScore").value= this.score

        },

        currentBoard: function(){
            let cells = document.getElementsByClassName('cell')
            for (let i = 0; i < cells.length; i++) {
                if (this.board[i] !== 0) {
                    cells[i].innerHTML = this.board[i].toString();
                } else
                    cells[i].innerHTML = '';
            }
        },
        keyPressed: function (event){
            if(event.code==="ArrowUp") this.shiftBoard(0,0)
            if(event.code==="ArrowDown") this.shiftBoard(1,0)
            if(event.code==="ArrowLeft") this.shiftBoard(2,0)
            if(event.code==="ArrowRight") this.shiftBoard(3,0)

        },
        shiftBoard: function(direction, caller){
            let tempBoard = this.board
            let ctr, x, flag=false
            switch (direction){
                case 0: //up
                    for(let i=4;i<16;i++){
                        ctr =0;
                        if(tempBoard[i]>0){
                            x = i;
                            do{
                                x-=4;
                                if(tempBoard[x]===0){
                                    if(x>=0){
                                        ctr++;
                                    }

                                }

                            } while(x>3)
                            if(ctr>0){
                                tempBoard[i-4*ctr]= tempBoard[i];
                                tempBoard[i]=0;
                                this.board = tempBoard
                                this.currentBoard()
                                flag=true;
                            }

                        }
                    }
                    break;
                case 1: //down
                    for(let i=11; i>=0;i--){
                        ctr=0;
                        if(tempBoard[i]>0){
                            x =i;
                            do{
                                x+=4;
                                if(tempBoard[x]===0){
                                    if(x<=15){
                                        ctr++;
                                    }
                                }
                            } while(x<12)
                            if(ctr>0){
                                tempBoard[i+4*ctr]= tempBoard[i];
                                tempBoard[i]=0;
                                this.board = tempBoard
                                this.currentBoard()
                                flag=true;

                            }
                        }
                    }

                    break;
                case 2: // left
                    for(let i=0;i<16;i++){
                        ctr=0;
                        if(tempBoard[i]>0){
                            if((i%4)===0) continue
                            x=i
                            do{
                                x--;
                                if(tempBoard[x]===0){
                                    if((x%4)<3){
                                        ctr++
                                    }
                                }
                            }while(x%4>0)
                            if(ctr>0){
                                tempBoard[i-ctr]= tempBoard[i];
                                tempBoard[i]=0;
                                this.board = tempBoard
                                this.currentBoard();
                                flag=true;

                            }
                        }
                    }
                    break;
                case 3: //right
                    for(let i=15;i>=0;i--){
                        ctr=0;
                        if(tempBoard[i]>0){
                            if(i%4===3) continue
                            x=i;
                            do{
                                x++
                                if(tempBoard[x]===0){
                                    if((x%4)>0){
                                        ctr++
                                    }
                                }
                            }while(x%4<3)
                            if(ctr>0){
                                tempBoard[i+ctr]= tempBoard[i];
                                tempBoard[i]=0;
                                this.board = tempBoard
                                this.currentBoard();
                                flag=true;

                            }
                        }
                    }
            }
            if(caller===0){
                let flag2 =this.combineNumbers(direction)
                if(flag||flag2)this.addTile()
            }

        },
        combineNumbers: function (direction){
            let tempBoard = this.board
            let flag = false
            switch (direction){
                case 0: //up
                    for(let i = 0;i<16;i++){
                        if(tempBoard[i]>0){
                            if(tempBoard[i]===tempBoard[i+4]){
                                tempBoard[i]= tempBoard[i]*2
                                this.score+=tempBoard[i]
                                tempBoard[i+4]=0;
                                flag=true;
                            }
                        }

                    }
                    break;
                case 1: //down
                    for(let i=15;i>=0;i--){
                        if(tempBoard[i]>0) {

                            if (tempBoard[i] === tempBoard[i - 4]) {
                                tempBoard[i] = tempBoard[i] * 2
                                this.score+=tempBoard[i]
                                tempBoard[i - 4] = 0;
                                flag=true;

                            }
                        }
                    }
                    break;
                case 2: //left
                    for(let i = 0;i<16;i++) {
                        if(tempBoard[i]>0) {

                            if (tempBoard[i] === tempBoard[i + 1]) {
                                tempBoard[i] = tempBoard[i] * 2
                                this.score+=tempBoard[i]
                                tempBoard[i + 1] = 0;
                                flag=true;


                            }
                        }
                    }
                    break;
                case 3: //right
                    for(let i=15;i>=0;i--){
                        if(tempBoard[i]>0) {

                            if (tempBoard[i] === tempBoard[i - 1]) {
                                tempBoard[i] = tempBoard[i] * 2
                                this.score+=tempBoard[i]
                                tempBoard[i - 1] = 0;
                                flag=true;

                            }
                        }
                    }
                    break;
            }
            this.board = tempBoard;
            this.currentBoard()
            if(flag){
                this.shiftBoard(direction, 1);
                return true;
            }
            return false;
        }
    },
})
document.onkeyup = function (e){
    boardVue.keyPressed(e)
}


function getHighScores(){
    let div = document.getElementById("theboard")
    let table = document.createElement("table")
    while(div.firstChild){
        div.firstChild.remove()
    }
    let labelRow = document.createElement("tr")
    let nameE = document.createElement("td")
    nameE.innerHTML="Name"
    let scoreE = document.createElement("td")
    scoreE.innerHTML= "Score"
    labelRow.appendChild(nameE)
    labelRow.appendChild(scoreE)
    table.appendChild(labelRow)
    db.collection("highScores").orderBy("score","desc").get().then(snapshot=>{
        snapshot.docs.forEach(doc=>{
            if(DEBUG) console.log(doc.data())
            let row = document.createElement("tr")
            let nameElement = document.createElement("td")
            nameElement.innerHTML= doc.data().name
            let scoreElement = document.createElement("td")
            scoreElement.innerHTML=doc.data().score
            row.appendChild(nameElement)
            row.appendChild(scoreElement)
            table.appendChild(row)
        })
    })
    div.appendChild(table)
    let button = document.createElement("button")
    button.innerHTML= "Play Again?"
    button.onclick= function (){
        window.location.reload()
    }
    div.appendChild(button);
}

form = document.getElementById("form");
form.addEventListener("submit",(e)=>{
    e.preventDefault()
    db.collection("highScores").add({
        name:form.name.value,
        score:parseInt(form.playerScore.value)
    })
    getHighScores()
})


