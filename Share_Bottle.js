let select = s => document.querySelector(s),
  	selectAll = s => document.querySelectorAll(s),
		mainSVG = select('.mainSVG'),
		liquid = select("#liquid"),
		pointArray = [],
		pointValueXArray = [],
		pointValueYArray = [],
		liquidWidth = 400,//水面
		numPoints = 30,
		dripOffset = 0.0258,
		rippleDuration = 4.6,
		rippleAmount = '+=8',
		startValX = 220,//水底
		startValY = 400,
		startNum = 0,
		colorArray = ['#E6098B', '#FFBE0B', '#7CFC00', '#FFA500', '#FB5607', '#8338EC', '#3C6BE3', '#3A86FF', '#DA70D6', '#51E5FF', '#04A777', '#F75C03', '#F71735'],
		WaterHeadArray = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16],
		// WaterHeadArray = ['14'],
		allBubbles = selectAll('#bubbleGroup rect')

gsap.set(mainSVG, {
	visibility: 'visible'
})
//底灰波
gsap.set('.darkLiquid', {
	scaleX: -1,
	transformOrigin: '50% 50%'
})
// 头像缩小
for(i=0; i<WaterHeadArray.length; i++){
	gsap.set('#WaterHead' + WaterHeadArray[i], {
		scaleX: 0.15,
		scaleY: 0.15,
		transformOrigin: '50% 50%'
	})
}
// gsap.set('#WaterHead10', {
// 	scaleX: 0.15,
// 	scaleY: 0.15,
// 	transformOrigin: '50% 50%'
// })

// 曲线->水域（-2 : 最后两点，画矩形）
for(let i = 0; i < numPoints; i++) {
	let p =	liquid.points.appendItem(mainSVG.createSVGPoint());
	pointArray.push(p);
	pointValueXArray.push( (i < numPoints - 2) ? startValX : ( i == numPoints - 2 ) ? 600 : 200 );
	startValX += ( liquidWidth / (numPoints-2) );	
	pointValueYArray.push( (i < numPoints - 2) ? startValY : 800 )
}
gsap.set(pointArray, {
	x: gsap.utils.wrap(pointValueXArray),
	y: gsap.utils.wrap(pointValueYArray)
})

//试管液体下移
gsap.set('#level', {
	transformOrigin: '50% 100%'
})
gsap.set('#bubbleGroup rect, #droplet', {
	transformOrigin: '50% 50%'
})
//气泡生成
gsap.fromTo(allBubbles, {
	x: 'random(0, 200)',
	y: 'random(0, 120)',
	scale:'random(0.5, 3)',
	rotation: 'random(20, 180)',
	opacity: 1
}, {
	duration: 1,
	rotation: 'random(180, 360)',
	repeatRefresh: true,
	stagger: {
		each: 0.52,
		repeat: -1
	},
	scale: 0.1,
	y: '-=30',
	opacity: 0.1,
}).seek(100)

const makeDrip = () => {

	// 随机色
	let currentColor = gsap.utils.random(colorArray);
	gsap.to(':root', {'--main-color': currentColor});

	//初始化头像
	for(i=0; i<WaterHeadArray.length; i++){
		gsap.to('#WaterHead' + WaterHeadArray[i], {'display': 'none'});
		gsap.to('#WaterDrop', {'display': 'block'});
		gsap.to('#BlockUp1', {'display': 'none'});
		gsap.to('#BlockUp2', {'display': 'none'});
	}

	//随机显示
	// let ShowWaterHead = gsap.utils.random(WaterHeadArray);
	// console.log(ShowWaterHead);
	// if(ShowWaterHead == '10' || ShowWaterHead == '15'){
	// 	gsap.to('#BlockUp1', {'display': 'block'});
	// 	gsap.to('#BlockUp2', {'display': 'block'});
	// 	gsap.to('#WaterDrop', {'display': 'none'});
	// }
	// gsap.to('#WaterHead' + ShowWaterHead, {'display': 'block'});

	//顺序显示
	if(startNum == '9' || startNum == '14' || startNum == '15'){
		gsap.to('#BlockUp1', {'display': 'block'});
		gsap.to('#BlockUp2', {'display': 'block'});
		gsap.to('#WaterDrop', {'display': 'none'});
	}
	for(j=0; j<WaterHeadArray.length; j++)
	console.log(startNum);
	gsap.to('#WaterHead' + WaterHeadArray[startNum], {'display': 'block'});
	if(startNum < 15){
		startNum += 1;
	}else {
		startNum = 0;
	}
	console.log(startNum);

	// 振幅
	let tl = gsap.timeline({
		defaults: {
			ease: CustomWiggle.create('', {type: 'easeOut', wiggles: gsap.utils.random(9, 12)})
		}
	});

	// 试管出现
	tl.fromTo('#pipette1', {
		x: 600,
		opacity: 0
	}, {
		duration: 1,
		x: 376,
		opacity: 1,
		ease: 'expo.inOut'
	})
	// 试管角度复原
	.fromTo('#pipette1', {
		rotation: -95,
		transformOrigin: '50% 100%'
	}, {
		rotation: 0,
		transformOrigin: '50% 100%',
		duration: 1.5,
		ease: 'elastic(1.5, 0.83)'
	}, 0)
	.addLabel('pipetteReady')
	// 水滴滴出
	.fromTo('#drip', {
		scale: 0
	}, {
		duration: 1,
		scale: 1,
		transformOrigin: '50% 0%',
		ease: 'elastic(1, 0.8)'
	})
	// 试管液体缩短
	.to('#level', {
		duration: 1,
		scaleY: 0.5,
		ease: 'elastic(1, 0.8)'
	},'pipetteReady')
	// 水滴位置+下落
	.fromTo('#drip', {
		x: 399,
		y: 90
	}, {
		x: 399,
		y: 430,
		duration: 0.38,
		ease: 'power1.in'
	})
	.addLabel('splash')
	// 矩形换色
	.to('.poly', {
		fill:currentColor,
	ease: 'sine'
	}, 'splash')
	//气泡渐隐色跟随
	.to('#bubbleGroup', {
		stroke:currentColor,
		ease: 'sine'
	}, 'splash')
	// 波速
	.to(pointArray, {
		duration: gsap.utils.random(3, 5),
		y: (i) => {
			return rippleAmount
		},
		stagger: {
			each: dripOffset,
			from: 'center'
		},
	}, 'splash')
	//气泡跟随振幅
	.to('#bubbleGroup', {
		duration: 4,
		y: '+=random(5, 10)',
		ease: 'wiggle({type:easeOut, wiggles:10})'
	}, 'splash')
	//水花跳起
	.to('#droplet', {
		duration: 0.23,
		y: 'random(-30, -60, 1)',
		rotation: 'random(20, 290)',
		ease: 'power1',
	}, 'splash')
	//水花跳起
	.to('#droplet', {
		duration: 0.23,
		y:0,
		rotation: '+=30',
		ease: 'power1.in',
	}, 'splash+=0.23')
	//水花渐隐
	.fromTo('#droplet', {
		scale: 1
	}, {
		duration: 0.23,
		scale: 0,
		transformOrigin: '50% 100%',
		ease: 'expo.in'
	}, 'splash+=0.23')
	// 试管液体上升
	.to('#level', {
		duration: 1,
		scaleY: 1,
		ease: 'expo.in'
	}, 'splash')
	// 试管倾斜+滑出
	.to('#pipette1', {
		duration: 1,
		rotation: 23,
		x: 100,
		opacity: 0,
		ease: 'expo.in'
	}, 'splash')
	
	gsap.delayedCall(4, makeDrip);
}

makeDrip()
