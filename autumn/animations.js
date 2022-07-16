window.transitioning = false;

window.num_sections;
window.current_section = 0;

window.layers = {
	back: 0,
	background: 250,
	middle: 500,
	foreground: 750,
	front: 1000,

};

window.addEventListener("DOMContentLoaded", function(event){
	number_sections();
	setup_nav();
	setup_scroll_transitions();
	setup_keyboard_actions();

	document.querySelector("#nav-item-0").click();
});

function vine(){
	console.log("vining");
	let path = document.querySelector("#vine_path");
	let len = anime.setDashoffset(path);
	path.style["stroke-dasharray"] = len;

	let progress = 1 - (window.current_section/(window.num_sections-1));

	let path_len = progress * parseInt(len);

	console.log("progress: ", progress);
	console.log("path length: ", path_len);

	anime({
		targets: "#vine_path",
		strokeDashoffset: path_len,
		easing: 'easeInOutQuad',
		duration: 800,
	});
}


function cssProp(css_name){
	let name_array = Array.from(css_name);

	let processed_array = name_array.filter(function(el, i, array){
		if(el == "-"){
			if(i+1 < array.length)
				array[i+1] = array[i+1].toUpperCase();
			return false;
		}

		return true;
	});

	processed_array[0] = processed_array[0].toLowerCase();

	return processed_array.join("");
}

function setVendor(element, property, value) {
	element.style[cssProp("webkit-" + property)] = value;
	element.style[cssProp("moz-" + property)] = value;
	element.style[cssProp(property)] = value;
}

function calc(expr){
	let div = document.createElement("div");

	div.style.top = expr;
	div.style.display = "none";
	div.style.position = "absolute";

	document.querySelector("body").appendChild(div);
	let eval = getComputedStyle(div).top;
	document.querySelector("body").removeChild(div);

	return eval;
}


function rand_color(elem){
	let r = Math.floor(Math.random()*256);
	let g = Math.floor(Math.random()*256);
	let b = Math.floor(Math.random()*256);
	elem.style.backgroundColor = "rgb("+r+","+g+","+b+")";
}

function number_sections(){
	let sections = document.querySelectorAll("section");
	sections.forEach(function(sec, i){
		sec.id = "section-" + i;
		sec.dataset.index = i;
	});
	window.num_sections = sections.length;
}

function setup_nav(){
	let sections = document.querySelectorAll("section");
	let nav = document.querySelector("nav");
	nav.style.zIndex = window.layers.front;

	sections.forEach(function(current_section, index, all_sections){
		let nav_item = document.createElement("div");

		nav_item.classList.add("nav-item")
		nav_item.id = "nav-item-" + index;
		nav_item.dataset.index = index;
		
		nav_item.addEventListener("click", transition);

		nav.appendChild(nav_item);

	});

}

function setup_scroll_transitions(){
	window.addEventListener("swiped-up", function(){
		if(transitioning){ return; }
		console.log("swiped up");
		next_section();
	});

	window.addEventListener("swiped-down", function(){
		if(transitioning){ return; }
		console.log("swiped down");
		prev_section();
	});

	window.addEventListener("wheel", function(){
		if(transitioning){ return; }
		if(event.deltaY > 10){
			next_section();
		}else if(event.deltaY < 10){
			prev_section();
		}
	});
}

function setup_keyboard_actions(){
	document.addEventListener('keydown', function(event) {
		if(event.keyCode == 40) { // down
			next_section();
		}
		else if(event.keyCode == 38) { // up
			prev_section();
		} else if(event.keyCode == 32) { // space
			next_section();
		}
	});
}


function next_section(){
	console.log("next section");
	// check bounds
	let next_section_num = parseInt(window.current_section) + 1;
	if(next_section_num < window.num_sections){
		// simulate a click on the next section
		document.querySelector("#nav-item-" + next_section_num).click();
	}
}

function prev_section(){
	console.log("prev section");
	// check bounds
	let next_section_num = parseInt(window.current_section) - 1;
	if(next_section_num >= 0){
		// simulate a click on the next section
		document.querySelector("#nav-item-" + next_section_num).click();
	}
}

function simple_transition(section){
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), 100);
	});
}

function wipe_reveal(section, direction = "down", gradient_width = 200, duration = 500){
	console.log("starting wipe");


	let height = window.innerHeight;
	let width = window.innerWidth;

	let top = -(height + 2*gradient_width);
	let mid_y = -gradient_width;
	let bottom = height;

	let left = -(width + 2*gradient_width);
	let mid_x = -gradient_width;
	let right = width;

	let gradient_direction = direction == "down" || direction == "up"
		? "to bottom"
		: "to right";

	setVendor(section, "mask-size", -left+"px " + -top + "px");
	setVendor(section, "mask-repeat", "no-repeat");
	setVendor(section, "mask-image", "linear-gradient("+ gradient_direction +", \
		rgba(0,0,0,0) 0%,\
		rgba(0,0,0,1) calc(0% + "+gradient_width+"px),\
		rgba(0,0,0,1) calc(100% - "+gradient_width+"px),\
		rgba(0,0,0,0) 100%)"
	);

	let start_y = direction == "down" ? top+"px" :
				direction == "up" ? bottom+"px" :
				mid_y+"px";

	let start_x = direction == "right" ? left+"px" :
				direction == "left" ? right+"px" :
				mid_x+"px";

	let end_y = mid_y+"px";
	let end_x = mid_x+"px";

	let wipe = anime({
		targets: section,
		maskPositionY: [start_y, end_y],
		"-webkit-mask-position-y": [start_y, end_y],
		maskPositionX: [start_x, end_x],
		"-webkit-mask-position-x": [start_x, end_x],
		duration: duration,
		easing: "linear"
	});

	
	return wipe.finished;
}

function do_entrance_animations(section){
	console.log("doing entrance animations");

	const entrance_items = section.querySelectorAll(".enter");

	let entrance_animations = anime({
		targets: entrance_items,
		translateY: [-200, 0],
		opacity: [0, 1],
		easing: "easeOutCubic",
		delay: anime.stagger(100)
	});

	return entrance_animations.finished;
}

function start_animation_loop(section){
	console.log("starting animation loop");
}
function stop_animation_loop(section){
	console.log("stopping animation loop");
}


function transition(event){

	// already transitioning ?
	if(transitioning){ return; }
	window.transitioning = true;

	let section = document.querySelector("#section-"+event.target.dataset.index);

	if(section == null){ return; }
	if (section.classList.contains("active")){
		window.transitioning = false;
		return;
	}



	let prev_section = document.querySelector("section.active");
	if(prev_section != null){
		prev_section.style.zIndex = window.layers.background;
	}

	let prev_nav_item = document.querySelector("nav .active");
	if(prev_nav_item != null)
		prev_nav_item.classList.remove("active");


	rand_color(section);

	start_animation_loop(section);

	event.target.classList.add("active");
	section.classList.add("active");
	section.style.zIndex = window.layers.middle;

	window.current_section = event.target.dataset.index;

	let d = ["up", "down", "left", "right"]
	let di = Math.floor(Math.random()*d.length);
	wipe_reveal(section, direction = d[di], gradient_width = 1500, duration = 1300)
		.then(done_transition);

	vine();

/*
	simple_transition(section).then(done_transition);
*/

	function done_transition(){
		do_entrance_animations(section);

		if(prev_section != null){
			prev_section.classList.remove("active");

			// stop the old section animations
			stop_animation_loop(prev_section);

			// reset prev section styles
			prev_section.style = "";
		}
		window.transitioning = false;
	}
}
