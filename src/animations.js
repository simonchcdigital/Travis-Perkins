window.addEventListener("DOMContentLoaded", function(event){
	number_sections();
	setup_section_selectors();
	setup_colors();
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

		/*

		let player = document.createElement("lottie-player");
		let img = window.selector_elements[Math.floor(Math.random()*window.selector_elements.length)];
		player.src = "./animations/elements/" + img + ".json";
		player.classList.add("selector-animation");
		player.loop = "true";

		section_selector.appendChild(player);

		*/

		section_selector.classList.add("section-selector")
		section_selector.id = "selector-" + index;
		section_selector.dataset.selectorNumber = index;
		
		section_selector.addEventListener("click", slide_transition);

		section_selector_container.appendChild(section_selector);

	});
}

function intro_animations(target_section){
	let elements = target_section.querySelectorAll(".section-content .enter");

	anime({
		targets: elements,
		translateY: [-500, 0],
		opacity: [0, 1],
		easing: "easeOutQuart",
		delay: anime.stagger(400, {start: 400})
	});
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

function slide_transition(event){

	window.transitioning = true;

	let target_selector = event.target;
	let target_index = parseInt(target_selector.dataset.selectorNumber);

	let target_section = document.querySelector("#section-" + target_index);

	// are we already on the current slide?
	if (target_section.classList.contains("active")){
		return;
	}

	// scroll the new section into view
	target_section.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});

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
		next_slide();
	});

	window.addEventListener("swiped-down", function(){
		if(transitioning){ return; }
		prev_slide();
	});

	window.addEventListener("wheel", function(){
		if(transitioning){ return; }
		if(event.deltaY > 50){
			next_slide();
		}
		if(event.deltaY < 50){
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
