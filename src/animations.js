window.addEventListener("DOMContentLoaded", function(event){
	number_sections();
	setup_section_selectors();
	//setup_colors();
	setup_wheel_transitions();
	start_first_slide();
});

window.current_slide = 0;
window.transitioning = false;

function number_sections(){
	let sections = document.querySelectorAll(".section");
	sections.forEach(function(sec, i){
		sec.id = "section-" + i;
		sec.dataset.sectionNumber = i;
	});
}

window.selector_elements = ["beetle", "fly", "ladybird", "sun", "worm", "butterfly", "secateurs", "woodlouse"];

function setup_section_selectors(){
	let sections = document.querySelectorAll(".section");
	let section_selector_container = document.querySelector("#section-selector-container");

	sections.forEach(function(current_section, index, all_sections){
		let section_selector = document.createElement("div");

		section_selector.classList.add("section-selector")
		section_selector.id = "selector-" + index;
		section_selector.dataset.selectorNumber = index;
		
		section_selector.addEventListener("click", slide_transition);



		let leaf_img = document.createElement("img");
		leaf_img.src = "./static_assets/leaf.svg";
		leaf_img.style.position = "relative";
		leaf_img.addEventListener("click", function(event){
			event.preventDefault();
			event.target.parentElement.click();
		});

		let rotation = - 45 + (index % 2)*90;

		let nudge = 10;

		if(index%2 != 0){
			leaf_img.style.left = nudge + "px";
		}else{
			leaf_img.style.left = -1*nudge + "px";
		}
		
		leaf_img.style.transform = "rotate("+rotation+"deg)";

		leaf_img.classList.add("selector-img");
		
		section_selector.appendChild(leaf_img);

		section_selector_container.appendChild(section_selector);

	});
}

function intro_animations(target_section){
	let entrance_elements = target_section.querySelectorAll(".section-content .enter");

	anime({
		targets: entrance_elements,
		translateY: [-500, 0],
		opacity: [0, 1],
		easing: "easeOutQuart",
		delay: anime.stagger(400, {start: 400})
	});

	let scroll_indicator_elements = target_section.querySelectorAll(".section-content .scroll-arrow");

	// have them animate in staggered
	anime({
		targets: scroll_indicator_elements,
		translateY: [-200, 0],
		opacity: [0, 1],
		easing: "easeOutCubic",
		delay: anime.stagger(100, {start: 1500})
	});

	// make them bounce a little
	/*
	anime({
		targets: scroll_indicator_elements,
		translateY: "1px",
		direction: "alternate",
		loop: true,
		easing: "easeInOutSine",
		delay: anime.stagger(50)
	});
	*/
}

function start_first_slide(){

	let first_section = document.querySelector("#section-0");
	first_section.scrollIntoView();

	first_section.querySelector("lottie-player").play();
	first_section.classList.add("active");

	document.querySelector("#selector-0").classList.add("selected");
	document.querySelectorAll(".section-selector lottie-player").forEach(function(elem, index){
		elem.play();
	});

	intro_animations(first_section);
}

window.target_scroll_position = 0;

function smooth_scroll(){
	let target_scroll_position = window.target_scroll_position;
	let element = document.querySelector("#sections-container");
	if(Math.abs(element.scrollTop - target_scroll_position) < 2){
		element.scrollTop = target_scroll_position;
	}else{
		element.scrollTop = (element.scrollTop + target_scroll_position)*0.5;
		window.requestAnimationFrame(smooth_scroll);
	}
}

function slide_transition(event){

	window.transitioning = true;

	let target_selector = event.target;
	let target_index = parseInt(target_selector.dataset.selectorNumber);

	let target_section = document.querySelector("#section-" + target_index);
	if(target_section === null){
		return;
	}

	// are we already on the current slide?
	if (target_section.classList.contains("active")){
		return;
	}

	//target_section.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});

	//document.querySelector("#sections-container").scrollTop = target_section.offsetTop;
	window.target_scroll_position = target_section.offsetTop;
	smooth_scroll();

	// start the next section's animations
	let target_animation_player = target_section.querySelector("lottie-player");
	if(target_animation_player){
		target_animation_player.play();
	}
	intro_animations(target_section);

	let current_selector = document.querySelector("#selector-" + window.current_slide);

	// remove "selected" from the current selector
	current_selector.classList.remove("selected");

	// add "selected" to the target selector
	target_selector.classList.add("selected");


	// stop the current section's animations after the scroll has happened
	setTimeout(function(){
		let current_section = document.querySelector("#section-" + window.current_slide);
		let current_animation_player = current_section.querySelector("lottie-player");

		if(current_animation_player){
			current_animation_player.stop();
		}

		// remove "active" from current slide
		current_section.classList.remove("active");

		// add "active" to the target slide
		target_section.classList.add("active");


		// update current slide
		window.current_slide = parseInt(target_index);
		window.transitioning = false;
	}, 300);
	
}

function setup_wheel_transitions(){
	window.addEventListener("swiped-up", function(){
		if(transitioning){ return; }
		console.log("swiped up");
		next_slide();
	});

	window.addEventListener("swiped-down", function(){
		if(transitioning){ return; }
		console.log("swiped down");
		prev_slide();
	});

	window.addEventListener("wheel", function(){
		if(transitioning){ return; }
		if(event.deltaY > 10){
			next_slide();
		}else if(event.deltaY < 10){
			prev_slide();
		}
	});
}

function next_slide(){
	// check bounds
	let num_sections = document.querySelectorAll(".section-selector").length;
	let next_section_num = window.current_slide + 1;
	if(next_section_num < num_sections){
		// simulate a click on the next section
		document.querySelector("#selector-" + next_section_num).click();
	}
}

function prev_slide(){
	// check bounds
	let next_section_num = window.current_slide - 1;
	if(next_section_num >= 0){
		// simulate a click on the next section
		document.querySelector("#selector-" + next_section_num).click();
	}
}

function setup_colors(){

	let starting_hue = 220;
	let delta_hue = 20;

	let sections = document.querySelectorAll(".spacer, .section-background");

	let colors = Array.from(sections).map(function(section, index, all_sections){
		let hue = starting_hue + (index*delta_hue);
		return "hsl(" + hue + ", 50%, 70%)";
	});

	last_hue = starting_hue + (sections.length * delta_hue);

	colors.push("hsl(" + last_hue + ", 50%, 70%)");

	colors[0] = "hsl(181, 100%, 90%)";
	colors[1] = "hsl(200, 100%, 70%)"

	sections.forEach(function(current_section, index){

		let current_color = colors[index];
		let next_color = colors[index+1]

		current_section.style.background = "linear-gradient(0deg, " +
			next_color + " 0%," +
			current_color + " 100%)";
	});
}
