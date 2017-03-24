var board=[];
var score=0;//分数
var hasConflicted=[];
var startX,startY,endX,endY;

$(document).ready(function(){
	prepareForMobile();//适应移动端尺寸
	newgame();
})

function prepareForMobile(){
  if(documentWidth>500){
  	gridContainerWidth=500;
  	cellSpace=20;
  	cellSideLength=100;
  }

  $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
  $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
  $('#grid-container').css('padding',cellSpace);
  $('#grid-container').css('border-radius',0.02*gridContainerWidth);
  
  $('.grid-cell').css('width',cellSideLength);
  $('.grid-cell').css('height',cellSideLength);
  $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
	//初始化棋盘
	init();
	updateScore(0);

	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}
  //初始化二维数组
	for(var i=0;i<4;i++){
		board[i]=[];
		hasConflicted[i]=[];
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
	}

	updateBoardView();
	score=0;
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$("#number-cell-"+i+"-"+j);
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				theNumberCell.css('font-size',getNumberFontSize(board[i][j]));
			}
			hasConflicted[i][j]=false;
		}
	}
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
	if(nospace(board)){ //没有空位置则无法显示
		return false;
	}else{
		//随机一个位置
		var randx=parseInt(Math.floor(Math.random()*4));
		var randy=parseInt(Math.floor(Math.random()*4));
		var times=0;
		while(times<50){
			if(board[randx][randy]==0){//该位置为0时可以添加数字
				break;
			}else{ //否则重新生成坐标
		    var randx=parseInt(Math.floor(Math.random()*4));
		    var randy=parseInt(Math.floor(Math.random()*4));
		    times++;
	    }
		}
    if(times==50){
    	for(var i=0;i<4;i++){
    		for(var j=0;j<4;j++){
    			if(board[i][j]==0){
    				randx=i;
    				randy=j;
    			}
    		}
    	}
    }

		//随机一个数字
		var randNumber=Math.random()<0.6?2:4;
		//在随机位置上显示随机数字
		board[randx][randy]=randNumber;
		showNumberWithAnimation(randx,randy,randNumber);
		return true;
	}

}

$(document).keydown(function(event){

	switch(event.keyCode){
		case 37: //left
		  if(moveLeft()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300);
		  }
		  break;
		case 38: //up
		  event.preventDefault();
		  if(moveUp()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300);
		  }
		  break;
		case 39: //right
		  if(moveRight()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300);
		  }
		  break;
		case 40: //down
		  if(moveDown()){
		  	event.preventDefault();
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300);
		  }
		  break;
		default: //default
		  break;
	}
})

//支持触摸
document.addEventListener('touchstart',function(event){
  startX=event.touches[0].pageX;
  startY=event.touches[0].pageY;
});


document.addEventListener('touchend',function(event){
  endX=event.changedTouches[0].pageX;
  endY=event.changedTouches[0].pageY;

  var deltaX=endX-startX;
  var deltaY=endY-startY;

  if(Math.abs(deltaX)<0.3*documentWidth&&Math.abs(deltaY)<0.3*documentWidth){
  	return;
  }
  //水平方向滑动
  if(Math.abs(deltaX)>=Math.abs(deltaY)){
    if(deltaX>0){
    	//right
    	if(moveRight()){
    		event.preventDefault();
    		setTimeout('generateOneNumber()',210);
    		setTimeout('isgameover()',300);
    	}
    }else{
    	//left
    	if(moveLeft()){
    		event.preventDefault();
    		setTimeout('generateOneNumber()',210);
    		setTimeout('isgameover()',300);
    	}
    }
  }else{  //垂直方向
    if(deltaY>0){
    	//down
    	if(moveDown()){
    		event.preventDefault();
    		setTimeout('generateOneNumber()',210);
    		setTimeout('isgameover()',300);
    	}
    }else{
    	//up
    	if(moveUp()){
    		event.preventDefault();
    		setTimeout('generateOneNumber()',210);
    		setTimeout('isgameover()',300);
    	}
    }
  }

});

function isgameover(){
  if(nospace(board)&&nomove(board)){
  	gameover();
  }
}

function gameover(){
	alert('Gameover!');
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}else{
		for(var i=0;i<4;i++){
			for(var j=1;j<4;j++){
				if(board[i][j]!=0){
          for(var k=0;k<j;k++){//遍历左侧所有元素
          	if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
          		//move
          		showMoveAnimation(i,j,i,k);
          		board[i][k]=board[i][j];
          		board[i][j]=0;
          		continue;
          	}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&& !hasConflicted[i][k]){
              //move
              showMoveAnimation(i,j,i,k);
              //add
              board[i][k]+=board[i][j];
              board[i][j]=0;
              //add score
              score+=board[i][k];
              updateScore(score);
              hasConflicted[i][k]=true;
              continue;
          	}
          }
				}
			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}else{
		for(var i=0;i<4;i++){
			for(var j=2;j>=0;j--){
				if(board[i][j]!=0){
          for(var k=3;k>j;k--){//遍历右侧所有元素
          	if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
          		//move
          		showMoveAnimation(i,j,i,k);
          		board[i][k]=board[i][j];
          		board[i][j]=0;
          		continue;
          	}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
              //move
              showMoveAnimation(i,j,i,k);
              //add
              board[i][k]+=board[i][j];
              board[i][j]=0;
              //add score
              score+=board[i][k];
              updateScore(score);
              hasConflicted[i][k]=true;
              continue;
          	}
          }
				}
			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}
}

function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}else{
		for(var j=0;j<4;j++){
			for(var i=1;i<4;i++){
				if(board[i][j]!=0){
          for(var k=0;k<i;k++){//遍历上侧所有元素
          	if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
          		//move
          		showMoveAnimation(i,j,k,j);
          		board[k][j]=board[i][j];
          		board[i][j]=0;
          		continue;
          	}else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
              //move
              showMoveAnimation(i,j,k,j);
              //add
              board[k][j]+=board[k][j];
              board[i][j]=0;
              //add score
              score+=board[k][j];
              updateScore(score);
              hasConflicted[i][k]=true;
              continue;
          	}
          }
				}
			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}
}

function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}else{
		for(var j=0;j<4;j++){
			for(var i=2;i>=0;i--){
				if(board[i][j]!=0){
          for(var k=3;k>i;k--){//遍历下侧所有元素
          	if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
          		//move
          		showMoveAnimation(i,j,k,j);
          		board[k][j]=board[i][j];
          		board[i][j]=0;
          		continue;
          	}else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
              //move
              showMoveAnimation(i,j,k,j);
              //add
              board[k][j]+=board[k][j];
              board[i][j]=0;
              //add score
              score+=board[k][j];
              updateScore(score);
              hasConflicted[i][k]=true;
              continue;
          	}
          }
				}
			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}
}
